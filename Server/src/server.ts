import express from "express";
import type { Express, Request, Response } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// CORS Configuration for Vercel deployment
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

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
        console.log(`✅ Loaded ${allData.length} records from CSV at fallback path ${fallbackPath}`);
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

app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    dataLoaded: allData.length > 0,
    recordCount: allData.length,
  });
});

// Get all users
app.get("/api/users", (req: Request, res: Response) => {
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

// Get user by ID
app.get("/api/users/:id", (req: Request, res: Response) => {
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

// Get all jobs
app.get("/api/jobs", (req: Request, res: Response) => {
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

// Get job by ID
app.get("/api/jobs/:id", (req: Request, res: Response) => {
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

// Dashboard Statistics
app.get("/api/dashboard", (req: Request, res: Response) => {
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

// Analytics Data
app.get("/api/analytics", (req: Request, res: Response) => {
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

// KYC Pending Users
app.get("/api/kyc/pending", (req: Request, res: Response) => {
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
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
  });
}

// Export for Vercel
export default app;
