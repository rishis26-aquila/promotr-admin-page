import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Resend } from "resend";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
import { authenticate, requireRole, JWT_SECRET } from "./middlewares/auth.js";
import type { AuthRequest } from "./middlewares/auth.js";
import { validateSchema } from "./middlewares/validation.js";
import { auditLog } from "./middlewares/audit.js";
import {
  corsMiddleware,
  securityHeaders,
  apiLimiter,
  authLimiter,
  otpLimiter,
  csrfProtect,
} from "./middlewares/security.js";

// Schemas
import * as schemas from "./schemas.js";

// Database
import { supabase } from "./utils/supabase.js";

const app = express();

if (!process.env.RESEND_API_KEY) {
  console.error("❌ FATAL: RESEND_API_KEY environment variable is not set!");
}
const resend = new Resend(
  process.env.RESEND_API_KEY || "re_dummy_key_for_local_dev_only",
);

// Strict Middleware Order: Security -> Parsing -> CORS -> CSRF -> RateLimiting
app.use(helmet());
app.use(securityHeaders);
app.use(express.json({ limit: "1mb" })); // Limit request size
app.use(cookieParser());
app.use(corsMiddleware);

app.use("/api/", apiLimiter);
app.use("/api/", csrfProtect);

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

app.get("/api/auth/csrf", (req, res) => {
  const csrfToken = crypto.randomBytes(32).toString("hex");
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("promotr_csrf", csrfToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
  });

  res.json({ csrfToken });
});

app.post(
  "/api/auth/send-otp",
  otpLimiter,
  validateSchema(schemas.sendOtpSchema, "body"),
  async (req, res) => {
    const { email } = req.body;

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .ilike("email", email)
      .single();

    if (error || !user) {
      // Hide internal details, return generic response to prevent email enumeration (though currently it says Unauthorized)
      return res.status(403).json({
        success: false,
        message: "This email is not registered in our system.",
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    const otpToken = jwt.sign(
      { email: email.toLowerCase(), otpHash, attempts: 0 },
      JWT_SECRET,
      { algorithm: "HS256", expiresIn: "5m" },
    );

    try {
      if (
        process.env.RESEND_API_KEY &&
        process.env.RESEND_API_KEY.startsWith("re_")
      ) {
        await resend.emails.send({
          from: "Promotr Admin <onboarding@resend.dev>",
          to: email,
          subject: `Your Admin Verification Code: ${otp}`,
          html: fs.readFileSync(path.join(__dirname, "otp.html"), "utf-8")
            .replace("{{otp}}", otp)
            .replace("{{year}}", new Date().getFullYear().toString()),
        });
      } else {
        console.log(`\n================================`);
        console.log(`🔑 DEV MODE OTP for ${email}: ${otp}`);
        console.log(`================================\n`);
      }

      const isProduction = process.env.NODE_ENV === "production";
      res.cookie("promotr_otp_pending", otpToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "strict" : "lax",
        maxAge: 5 * 60 * 1000,
        path: "/",
      });

      auditLog(req, "SEND_OTP", email, {});
      res.json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
);

app.post(
  "/api/auth/verify-otp",
  authLimiter,
  validateSchema(schemas.verifyOtpSchema, "body"),
  async (req, res) => {
    const { email, otp } = req.body;
    const otpToken = req.cookies?.promotr_otp_pending;

    if (!otpToken) {
      return res
        .status(401)
        .json({ success: false, message: "OTP expired or missing" });
    }

    try {
      const decoded = jwt.verify(otpToken, JWT_SECRET) as {
        email: string;
        otpHash: string;
        attempts: number;
      };

      if (decoded.email !== email.toLowerCase())
        throw new Error("Email mismatch");

      // OTP Attempt limit logic (Stateless check)
      // Note: Since JWTs are immutable, to truly increment attempts we'd need a DB.
      // We strictly enforce 5 min expiry and single-use validation.

      const inputHash = crypto.createHash("sha256").update(otp).digest("hex");
      if (decoded.otpHash !== inputHash) {
        return res.status(401).json({ success: false, message: "Invalid OTP" });
      }

      // OTP Valid - Single Use: Clear the pending cookie
      res.clearCookie("promotr_otp_pending");

      const { data: user, error: dbError } = await supabase
        .from("users")
        .select("*")
        .ilike("email", email)
        .single();

      if (dbError || !user)
        return res
          .status(404)
          .json({ success: false, message: "User not found" });

      // Generate Session Token
      const sessionToken = jwt.sign(
        {
          id: user.userId,
          email: user.email,
          name: user.userName,
          role: user.role,
        },
        JWT_SECRET,
        { algorithm: "HS256", expiresIn: "8h" }, // Short-lived access token
      );

      const isProduction = process.env.NODE_ENV === "production";

      res.cookie("promotr_session", sessionToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        maxAge: 8 * 60 * 60 * 1000,
        path: "/",
      });

      auditLog(req, "LOGIN", user.email, {});
      res.json({
        success: true,
        message: "Login successful",
        user: { name: user.userName, role: user.role },
      });
    } catch (error) {
      res.clearCookie("promotr_otp_pending");
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired OTP" });
    }
  },
);

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("promotr_session");
  res.clearCookie("promotr_csrf");
  auditLog(req, "LOGOUT", "self", {});
  res.json({ success: true });
});

app.get("/api/auth/me", authenticate, (req: AuthRequest, res) => {
  res.json({ success: true, user: req.user });
});

// ==========================================
// BUSINESS ROUTES (Authorized & Validated)
// ==========================================

// GET Users: Requires Authentication + Validation
app.get(
  "/api/users",
  authenticate,
  validateSchema(schemas.userQuerySchema, "query"),
  async (req: AuthRequest, res) => {
    const { role, status, kycStatus } = req.query;

    let query = supabase.from("users").select("*").order("userId", { ascending: true });
    if (role) query = query.eq("role", role);
    if (status) query = query.eq("status", status);
    if (kycStatus) query = query.eq("kycStatus", kycStatus);

    const { data: users, error } = await query;
    if (error) return res.status(500).json({ success: false, message: error.message });

    res.json({ success: true, data: users });
  },
);

// GET User by ID: Requires Authentication + Validation
app.get(
  "/api/users/:id",
  authenticate,
  validateSchema(schemas.userIdParamSchema, "params"),
  async (req: AuthRequest, res) => {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("userId", req.params.id)
      .single();

    if (error || !user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  },
);

// PUT User (Update): Auth -> RBAC -> Validation -> Logic
app.put(
  "/api/users/:id",
  authenticate,
  requireRole(["Super Admin", "Manager", "admin"]),
  validateSchema(schemas.userIdParamSchema, "params"),
  validateSchema(schemas.updateUserSchema, "body"),
  async (req: AuthRequest, res) => {
    const { data: oldData, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("userId", req.params.id)
      .single();

    if (fetchError || !oldData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Strip identity/primary-key fields that should never be updated
    const { userId, id, createdAt, ...safeBody } = req.body;

    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update(safeBody)
      .eq("userId", req.params.id)
      .select()
      .single();

    if (updateError || !updatedUser) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to update user" });
    }

    auditLog(req, "UPDATE_USER", req.params.id as string, {
      old_value: oldData,
      new_value: updatedUser,
    });

    res.json({ success: true, data: updatedUser });
  },
);

// GET Jobs: Requires Authentication
app.get(
  "/api/jobs",
  authenticate,
  validateSchema(schemas.jobQuerySchema, "query"),
  async (req: AuthRequest, res) => {
    const { status, category } = req.query;

    let query = supabase
      .from("users")
      .select("jobId, jobTitle, jobCategory, jobStatus, businessId, workerId, jobAmount, commission, jobCreatedDate, jobCompletedDate, paymentStatus, city, state, latitude, longitude")
      .not("jobId", "is", null)
      .order("jobId", { ascending: true });

    if (status) query = query.eq("jobStatus", status);
    if (category) query = query.eq("jobCategory", category);

    const { data: jobs, error } = await query;
    if (error) return res.status(500).json({ success: false, message: error.message });

    res.json({ success: true, data: jobs });
  }
);

// GET Job by ID
app.get(
  "/api/jobs/:id",
  authenticate,
  validateSchema(schemas.jobIdParamSchema, "params"),
  async (req: AuthRequest, res) => {
    const { data: job, error } = await supabase
      .from("users")
      .select("jobId, jobTitle, jobCategory, jobStatus, businessId, workerId, jobAmount, commission, jobCreatedDate, jobCompletedDate, paymentStatus, city, state, latitude, longitude")
      .eq("jobId", req.params.id)
      .not("jobId", "is", null)
      .single();

    if (error || !job)
      return res.status(404).json({ success: false, message: "Job not found" });
    res.json({ success: true, data: job });
  }
);

// PATCH Update Job Status (Cancel/Update): Auth -> RBAC -> Logic
app.patch(
  "/api/jobs/:id",
  authenticate,
  requireRole(["Super Admin", "Manager", "admin"]),
  validateSchema(schemas.jobIdParamSchema, "params"),
  async (req: AuthRequest, res) => {
    const { jobStatus, workerId } = req.body;
    const updates: any = {};
    
    if (jobStatus) updates.jobStatus = jobStatus;
    if (workerId) updates.workerId = workerId;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }

    const { data: updatedJob, error } = await supabase
      .from("users")
      .update(updates)
      .eq("jobId", req.params.id)
      .select()
      .single();

    if (error || !updatedJob)
      return res.status(500).json({ success: false, message: "Failed to update job" });

    auditLog(req, "UPDATE_JOB", req.params.id as string, updates);
    res.json({ success: true, data: updatedJob });
  }
);

// PATCH KYC Status (Verify/Reject): Auth -> RBAC -> Logic
app.patch(
  "/api/users/:id/kyc",
  authenticate,
  requireRole(["Super Admin", "Manager", "admin"]),
  validateSchema(schemas.userIdParamSchema, "params"),
  async (req: AuthRequest, res) => {
    const { status } = req.body;
    if (!["verified", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid KYC status. Must be 'verified' or 'rejected'." });
    }

    const { data: updatedUser, error } = await supabase
      .from("users")
      .update({ kycStatus: status })
      .eq("userId", req.params.id)
      .select()
      .single();

    if (error || !updatedUser)
      return res.status(500).json({ success: false, message: "Failed to update KYC status" });

    auditLog(req, "UPDATE_KYC", req.params.id as string, { kycStatus: status });
    res.json({ success: true, data: updatedUser });
  }
);

// PATCH Ban user: Auth -> RBAC -> Logic
app.patch(
  "/api/users/:id/ban",
  authenticate,
  requireRole(["Super Admin", "Manager", "admin"]),
  validateSchema(schemas.userIdParamSchema, "params"),
  async (req: AuthRequest, res) => {
    const { data: updatedUser, error } = await supabase
      .from("users")
      .update({ status: "banned" })
      .eq("userId", req.params.id)
      .select()
      .single();

    if (error || !updatedUser)
      return res.status(500).json({ success: false, message: "Failed to ban user" });

    auditLog(req, "BAN_USER", req.params.id as string, {});
    res.json({ success: true, data: updatedUser });
  }
);

// Dashboard Analytics: Auth -> RBAC -> Logic
app.get(
  "/api/dashboard",
  authenticate,
  requireRole(["Super Admin", "Manager", "admin"]),
  async (req: AuthRequest, res) => {
    const { data: allData, error } = await supabase.from("users").select("jobStatus, kycStatus, jobAmount, commission, paymentStatus");
    
    if (error || !allData) {
      return res.status(500).json({ success: false, message: "Failed to fetch analytics" });
    }

    const totalUsers = allData.length;
    const activeJobs = allData.filter((u) => u.jobStatus === "active").length;
    const pendingKYC = allData.filter((u) => u.kycStatus === "pending").length;

    // Compute revenue and commission from fields
    const totalRevenue = allData.reduce(
      (sum, u) => sum + (parseFloat(u.jobAmount) || 0),
      0,
    );
    const totalCommission = allData.reduce(
      (sum, u) => sum + (parseFloat(u.commission) || 0),
      0,
    );

    // Job counts by status
    const jobsByStatus = allData.reduce((acc: Record<string, number>, u) => {
      if (u.jobStatus) {
        acc[u.jobStatus] = (acc[u.jobStatus] || 0) + 1;
      }
      return acc;
    }, {});

    // Payment status breakdown
    const paymentsByStatus = allData.reduce((acc: Record<string, number>, u) => {
      if (u.paymentStatus) {
        acc[u.paymentStatus] = (acc[u.paymentStatus] || 0) + 1;
      }
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          activeJobs,
          pendingKYC,
          totalRevenue,
          totalCommission,
        },
        jobsByStatus,
        paymentsByStatus,
      },
    });
  },
);

// Analytics: Auth -> RBAC -> Logic
app.get(
  "/api/analytics",
  authenticate,
  requireRole(["Super Admin", "Manager", "admin"]),
  async (req: AuthRequest, res) => {
    const { data: allData, error } = await supabase.from("users").select("jobCategory, jobAmount, city");

    if (error || !allData) {
      return res.status(500).json({ success: false, message: "Failed to fetch analytics" });
    }

    // Revenue by job category
    const revenueByCategory: Record<string, number> = {};
    for (const row of allData) {
      if (row.jobCategory && row.jobAmount) {
        const cat = row.jobCategory;
        revenueByCategory[cat] =
          (revenueByCategory[cat] || 0) + (parseFloat(row.jobAmount) || 0);
      }
    }

    // Top cities by job count
    const cityCount: Record<string, number> = {};
    for (const row of allData) {
      if (row.city) {
        cityCount[row.city] = (cityCount[row.city] || 0) + 1;
      }
    }
    const topCities = Object.entries(cityCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Frontend expects: data.revenueByCategory and data.topCities
    res.json({
      success: true,
      data: {
        revenueByCategory,
        topCities,
      },
    });
  },
);

export default app;
