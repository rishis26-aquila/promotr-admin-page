import express from "express";
import type { Express, Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { Resend } from "resend";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();
const PORT = process.env.PORT || 3000;

if (!process.env.RESEND_API_KEY) {
  console.error("❌ FATAL: RESEND_API_KEY environment variable is not set!");
  if (process.env.NODE_ENV === "production") {
    process.exit(1);
  }
}
const resend = new Resend(process.env.RESEND_API_KEY || "");

// JWT Secret - secure multi-tiered fallback
function getJwtSecret(): string {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  if (fs.existsSync(path.join(__dirname, "..", "jwt_secret.txt"))) {
    return fs.readFileSync(path.join(__dirname, "..", "jwt_secret.txt"), "utf-8").trim();
  }
  console.warn("⚠️ Generating ephemeral JWT secret. Sessions will not persist across restarts!");
  return crypto.randomBytes(32).toString("hex");
}
const JWT_SECRET = getJwtSecret();
const JWT_EXPIRY = "7d";

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  "https://admin-promotr.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

// Crypto-secure OTP generation
function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
}

// Hash OTP for safe storage in cookies
function hashOTP(otp: string): string {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

// Middleware
app.use(express.json());
app.use(cookieParser());

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// CORS Configuration - restrict to known origins only
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Security headers
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("X-Content-Type-Options", "nosniff");
  res.header("X-Frame-Options", "DENY");
  next();
});

// Authentication middleware
interface AuthRequest extends Request {
  user?: { id: string; email: string; name: string; role: string };
}

function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.__Host_promotr_session || req.cookies?.promotr_session;

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] }) as {
      id: string;
      email: string;
      name: string;
      role: string;
    };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired session" });
  }
}

// Global headers
let csvHeaders: string[] = [];

// CSV Parser Function
function parseCSV(filePath: string): any[] {
  try {
    const csvData = fs.readFileSync(filePath, "utf-8");
    const lines = csvData.trim().split("\n");

    if (lines.length === 0) {
      console.warn("CSV file is empty");
      return [];
    }

    const headerLine = lines[0];
    if (!headerLine) {
      console.warn("CSV file has no header line");
      return [];
    }

    const headers = headerLine.split(",");
    csvHeaders = headers; // Store headers for writing

    const data = lines.slice(1).map((line) => {
      const values = line.split(",");
      const obj: any = {};
      headers.forEach((header, index) => {
        const value = values[index];
        obj[header.trim()] = value ? value.trim() : "";
      });
      return obj;
    });

    return data;
  } catch (error) {
    console.error("Error reading CSV:", error);
    return [];
  }
}

// Save data to CSV
function saveData() {
  try {
    if (csvHeaders.length === 0) {
      console.error("❌ Cannot save CSV: Headers not loaded");
      return;
    }

    const headerLine = csvHeaders.join(",");

    const lines = allData.map((obj) => {
      return csvHeaders
        .map((header) => {
          const key = header.trim();
          return obj[key] !== undefined && obj[key] !== null ? obj[key] : "";
        })
        .join(",");
    });

    const csvContent = [headerLine, ...lines].join("\n");

    // Try primary path then fallback
    try {
      if (fs.existsSync(csvPath)) {
        fs.writeFileSync(csvPath, csvContent, "utf-8");
      } else {
        const fallbackPath = path.join(
          process.cwd(),
          "Server",
          "dummydata.csv",
        );
        fs.writeFileSync(fallbackPath, csvContent, "utf-8");
      }
      console.log(`✅ Saved ${allData.length} records to CSV`);
    } catch (err) {
      console.error("❌ Error writing to CSV file:", err);
    }
  } catch (error) {
    console.error("❌ Error stringifying CSV:", error);
  }
}

// Load data from CSV
const csvPath = path.join(__dirname, "..", "dummydata.csv");
let allData: any[] = [];

// Initialize data
function loadData() {
  try {
    if (fs.existsSync(csvPath)) {
      allData = parseCSV(csvPath);
      console.log(`✅ Loaded ${allData.length} records from CSV at ${csvPath}`);
    } else {
      // Fallback to cwd if run from root
      const fallbackPath = path.join(process.cwd(), "Server", "dummydata.csv");
      if (fs.existsSync(fallbackPath)) {
        allData = parseCSV(fallbackPath);
        console.log(
          `✅ Loaded ${allData.length} records from CSV at fallback path ${fallbackPath}`,
        );
      } else {
        console.error(`❌ CSV file not found at ${csvPath} or ${fallbackPath}`);
      }
    }
  } catch (error) {
    console.error("❌ Error loading CSV:", error);
  }
}

loadData();

// API Routes

// Health Check
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Promotr Admin API",
    status: "running",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      users: "/api/users",
      jobs: "/api/jobs",
      dashboard: "/api/dashboard",
      analytics: "/api/analytics",
    },
  });
});

// Auth Routes
app.post("/api/auth/send-otp", async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  // 🛡️ SECURITY: Only allow authorized emails from our CSV
  const user = allData.find(
    (u) => u.email?.toLowerCase() === email.toLowerCase(),
  );

  if (!user) {
    console.log(`⚠️ Blocked OTP attempt for unauthorized email: ${email}`);
    return res.status(403).json({
      success: false,
      error: "Unauthorized",
      message: "This email is not registered in our system.",
    });
  }

  const otp = generateOTP();

  // Create a signed JWT containing the OTP hash (stateless — works on serverless)
  const otpToken = jwt.sign(
    { email: email.toLowerCase(), otpHash: hashOTP(otp) },
    JWT_SECRET,
    { algorithm: "HS256", expiresIn: "5m" },
  );

  try {
    await resend.emails.send({
      from: "Promotr Admin <onboarding@resend.dev>",
      to: email,
      subject: `Your Admin Verification Code: ${otp}`,
      html: `
        <div style="font-family: sans-serif; max-width: 400px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #F06C28;">Promotr Admin</h2>
          <p>Login verification code for <b>${user.firstName || "Admin"}</b>:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #F06C28; background: #FFF5F0; padding: 15px; text-align: center; border-radius: 8px;">
            ${otp}
          </div>
          <p style="color: #666; font-size: 13px; margin-top: 20px;">
            This code will expire in 5 minutes. If you didn't request this, please ignore this email.
          </p>
        </div>
      `,
    });

    // Set OTP verification cookie (stateless — no in-memory storage needed)
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("promotr_otp_pending", otpToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 5 * 60 * 1000, // 5 minutes
      path: "/",
    });

    console.log(`✅ OTP sent to ${email}`);
    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("❌ Resend error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.post("/api/auth/verify-otp", (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const normalizedEmail = email?.toLowerCase();

  // Read the OTP verification token from the cookie
  const otpToken = req.cookies?.promotr_otp_pending;

  if (!otpToken) {
    return res
      .status(400)
      .json({ success: false, message: "OTP expired or not requested. Please request a new code." });
  }

  try {
    // Verify and decode the OTP token
    const decoded = jwt.verify(otpToken, JWT_SECRET, { algorithms: ["HS256"] }) as {
      email: string;
      otpHash: string;
    };

    // Ensure the email matches
    if (decoded.email !== normalizedEmail) {
      return res.status(400).json({ success: false, message: "Email mismatch" });
    }

    // Compare OTP hashes
    if (decoded.otpHash !== hashOTP(otp)) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // OTP is valid — clear the pending OTP cookie
    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("promotr_otp_pending", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    });

    // Find user to return details
    const user = allData.find(
      (u) => u.email?.toLowerCase() === normalizedEmail,
    );

    const payload = {
      id: user.userId,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      role: user.role,
    };

    // Generate session JWT
    const token = jwt.sign(payload, JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: JWT_EXPIRY,
    });

    // Set secure HttpOnly session cookie
    const cookieName = isProduction ? "__Host-promotr_session" : "promotr_session";

    res.cookie(cookieName, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    console.log(`✅ Session created for ${user.email}`);

    res.json({
      success: true,
      message: "Login successful",
      user: payload,
    });
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res.status(400).json({ success: false, message: "OTP expired. Please request a new code." });
    }
    return res.status(400).json({ success: false, message: "Invalid OTP verification" });
  }
});

// Session check - allows frontend to verify if user is logged in
app.get("/api/auth/me", authenticate, (req: AuthRequest, res: Response) => {
  res.json({ success: true, user: req.user });
});

// Logout - clear the session cookie
app.post("/api/auth/logout", (req: Request, res: Response) => {
  const isProduction = process.env.NODE_ENV === "production";
  const cookieName = isProduction ? "__Host-promotr_session" : "promotr_session";

  res.clearCookie(cookieName, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });

  res.json({ success: true, message: "Logged out successfully" });
});

app.post("/api/auth/signup", (req: Request, res: Response) => {
  const { firstName, lastName, email, role } = req.body;

  if (!firstName || !email) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  const existingUser = allData.find(
    (u) => u.email?.toLowerCase() === email.toLowerCase(),
  );
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "Account already exists with this email",
    });
  }

  const newUser = {
    userId: `USR${Date.now()}`,
    firstName,
    lastName: lastName || "",
    email: email.toLowerCase(),
    role: role || "Manager",
    status: "Active",
    kycStatus: "Pending",
    mobile: "",
    registeredDate: new Date().toISOString().split("T")[0],
  };

  allData.push(newUser);
  saveData();

  console.log(`🆕 New Admin Registered: ${email}`);
  res.json({
    success: true,
    message: "Account created successfully. You can now login.",
    user: newUser,
  });
});

app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    dataLoaded: allData.length > 0,
    recordCount: allData.length,
  });
});

// Get all users (PROTECTED)
app.get("/api/users", authenticate, (req: AuthRequest, res: Response) => {
  const { role, status, kycStatus } = req.query;

  let users = allData.filter((item) => item.userId);

  if (role) {
    users = users.filter((u) => u.role === role);
  }
  if (status) {
    users = users.filter((u) => u.status === status);
  }
  if (kycStatus) {
    users = users.filter((u) => u.kycStatus === kycStatus);
  }

  res.json({
    success: true,
    count: users.length,
    data: users,
  });
});

// Get user by ID (PROTECTED)
app.get("/api/users/:id", authenticate, (req: AuthRequest, res: Response) => {
  const user = allData.find((item) => item.userId === req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.json({
    success: true,
    data: user,
  });
});

// Update user (PROTECTED)
app.put("/api/users/:id", authenticate, (req: AuthRequest, res: Response) => {
  const userId = req.params.id;
  const updates = req.body;

  const userIndex = allData.findIndex((item) => item.userId === userId);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Update fields
  allData[userIndex] = { ...allData[userIndex], ...updates };

  // Save to CSV
  saveData();

  res.json({
    success: true,
    data: allData[userIndex],
    message: "User updated successfully",
  });
});

// Get all jobs (PROTECTED)
app.get("/api/jobs", authenticate, (req: AuthRequest, res: Response) => {
  const { status, category } = req.query;

  let jobs = allData.filter((item) => item.jobId);

  if (status) {
    jobs = jobs.filter((j) => j.jobStatus === status);
  }
  if (category) {
    jobs = jobs.filter((j) => j.jobCategory === category);
  }

  res.json({
    success: true,
    count: jobs.length,
    data: jobs,
  });
});

// Get job by ID (PROTECTED)
app.get("/api/jobs/:id", authenticate, (req: AuthRequest, res: Response) => {
  const job = allData.find((item) => item.jobId === req.params.id);

  if (!job) {
    return res.status(404).json({
      success: false,
      message: "Job not found",
    });
  }

  res.json({
    success: true,
    data: job,
  });
});

// Dashboard Statistics (PROTECTED)
app.get("/api/dashboard", authenticate, (req: AuthRequest, res: Response) => {
  const users = allData.filter((item) => item.userId && item.role !== "admin");
  const workers = users.filter((u) => u.role === "worker");
  const businesses = users.filter((u) => u.role === "business");
  const jobs = allData.filter((item) => item.jobId);

  const activeUsers = users.filter((u) => u.status === "active").length;
  const totalRevenue = jobs
    .filter((j) => j.paymentStatus === "paid")
    .reduce((sum, j) => sum + parseFloat(j.jobAmount || 0), 0);

  const totalCommission = jobs
    .filter((j) => j.paymentStatus === "paid")
    .reduce((sum, j) => sum + parseFloat(j.commission || 0), 0);

  const pendingKYC = users.filter((u) => u.kycStatus === "pending").length;
  const completedJobs = jobs.filter((j) => j.jobStatus === "completed").length;
  const activeJobs = jobs.filter((j) => j.jobStatus === "in_progress").length;
  const pendingJobs = jobs.filter((j) => j.jobStatus === "pending").length;

  res.json({
    success: true,
    data: {
      overview: {
        totalUsers: users.length,
        activeUsers,
        totalWorkers: workers.length,
        totalBusinesses: businesses.length,
        totalJobs: jobs.length,
        completedJobs,
        activeJobs,
        pendingJobs,
        totalRevenue,
        totalCommission,
        pendingKYC,
      },
      jobsByStatus: {
        completed: completedJobs,
        in_progress: activeJobs,
        pending: pendingJobs,
        cancelled: jobs.filter((j) => j.jobStatus === "cancelled").length,
      },
      usersByRole: {
        workers: workers.length,
        businesses: businesses.length,
      },
      kycStats: {
        verified: users.filter((u) => u.kycStatus === "verified").length,
        pending: pendingKYC,
        rejected: users.filter((u) => u.kycStatus === "rejected").length,
      },
    },
  });
});

// Analytics Data (PROTECTED)
app.get("/api/analytics", authenticate, (req: AuthRequest, res: Response) => {
  const jobs = allData.filter((item) => item.jobId);

  // Revenue by category
  const revenueByCategory: any = {};
  jobs.forEach((job) => {
    const category = job.jobCategory || "other";
    if (!revenueByCategory[category]) {
      revenueByCategory[category] = 0;
    }
    if (job.paymentStatus === "paid") {
      revenueByCategory[category] += parseFloat(job.jobAmount || 0);
    }
  });

  // Jobs by city
  const jobsByCity: any = {};
  jobs.forEach((job) => {
    const city = job.city || "Unknown";
    jobsByCity[city] = (jobsByCity[city] || 0) + 1;
  });

  res.json({
    success: true,
    data: {
      revenueByCategory,
      jobsByCity,
      topCities: Object.entries(jobsByCity)
        .sort(([, a]: any, [, b]: any) => b - a)
        .slice(0, 5),
    },
  });
});

// KYC Pending Users (PROTECTED)
app.get("/api/kyc/pending", authenticate, (req: AuthRequest, res: Response) => {
  const pendingKYC = allData.filter(
    (item) => item.userId && item.kycStatus === "pending",
  );

  res.json({
    success: true,
    count: pendingKYC.length,
    data: pendingKYC,
  });
});

// Start server
if (process.env.NODE_ENV !== "production") {
  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(` Server running on http://0.0.0.0:${PORT}`);
    console.log(` API endpoints available at http://localhost:${PORT}/api`);
  });
}

// Export for Vercel
export default app;
