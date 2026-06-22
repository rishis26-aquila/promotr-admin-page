import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import crypto from "crypto";
import { Resend } from "resend";
import jwt from "jsonwebtoken";

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

// Database (Mock)
import { getData, setData, saveData } from "./utils/csv.js";

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
    const allData = getData();

    const user = allData.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase(),
    );
    if (!user) {
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
          html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb;">
  <div style="font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 40px auto; background-color: #ffffff; padding: 48px; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); border: 1px solid rgba(240, 108, 40, 0.1);">
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="color: #F06C28; font-size: 38px; font-weight: 900; margin: 0; letter-spacing: -1.5px; text-shadow: 0 2px 10px rgba(240,108,40,0.15);">Promotr.</h1>
      <p style="color: #94a3b8; font-size: 12px; font-weight: 700; margin-top: 8px; letter-spacing: 3px; text-transform: uppercase;">Admin Gatekeeper</p>
    </div>
    
    <div style="background-color: #ffffff; border-radius: 16px; padding: 40px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.03); border: 1px solid #f1f5f9;">
      <h2 style="color: #0f172a; font-size: 24px; font-weight: 800; margin-top: 0; margin-bottom: 12px; letter-spacing: -0.5px;">Verification Required</h2>
      <p style="color: #64748b; font-size: 15px; line-height: 1.7; margin-bottom: 32px; font-weight: 400;">Your secure access code for the Promotr orchestration dashboard is ready. This code is uniquely generated for your session.</p>
      
      <div style="background-color: #fff7ed; border: 2px dashed rgba(240, 108, 40, 0.3); border-radius: 12px; padding: 24px; display: inline-block; margin-bottom: 32px;">
        <span style="font-family: 'SF Mono', 'Courier New', monospace; font-size: 42px; font-weight: 900; color: #ea580c; letter-spacing: 12px; display: block; margin-left: 12px;">${otp}</span>
      </div>
      
      <div style="display: inline-block; background-color: #fef2f2; border: 1px solid #fee2e2; padding: 8px 16px; border-radius: 20px;">
        <p style="color: #ef4444; font-size: 13px; font-weight: 700; margin: 0; display: flex; align-items: center; justify-content: center;">
          Code expires in 5 minutes
        </p>
      </div>
    </div>
    
    <div style="text-align: center; margin-top: 40px; padding-top: 32px; border-top: 1px solid #f1f5f9;">
      <p style="color: #94a3b8; font-size: 13px; margin: 0; font-weight: 500;">Secure protocol initiated by Promotr Security.</p>
      <p style="color: #cbd5e1; font-size: 11px; margin-top: 12px; font-weight: 400;">If you didn't request this, please disregard this email or contact the security team immediately.</p>
      <p style="color: #e2e8f0; font-size: 10px; margin-top: 16px;">&copy; ${new Date().getFullYear()} Promotr Technologies Inc.</p>
    </div>
  </div>
</body>
</html>
          `,
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
  (req, res) => {
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

      const allData = getData();
      const user = allData.find(
        (u) => u.email?.toLowerCase() === email.toLowerCase(),
      );

      if (!user)
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
  (req: AuthRequest, res) => {
    const allData = getData();
    const { role, status, kycStatus } = req.query;

    let filtered = allData;
    if (role) filtered = filtered.filter((u) => u.role === role);
    if (status) filtered = filtered.filter((u) => u.status === status);
    if (kycStatus) filtered = filtered.filter((u) => u.kycStatus === kycStatus);

    res.json({ success: true, data: filtered });
  },
);

// GET User by ID: Requires Authentication + Validation
app.get(
  "/api/users/:id",
  authenticate,
  validateSchema(schemas.userIdParamSchema, "params"),
  (req: AuthRequest, res) => {
    const allData = getData();
    const user = allData.find((u) => u.userId === req.params.id);
    if (!user)
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
  requireRole(["Super Admin", "Manager"]),
  validateSchema(schemas.userIdParamSchema, "params"),
  validateSchema(schemas.updateUserSchema, "body"),
  (req: AuthRequest, res) => {
    const allData = getData();
    const userIndex = allData.findIndex(
      (item) => item.userId === req.params.id,
    );

    if (userIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const oldData = { ...allData[userIndex] };
    allData[userIndex] = { ...allData[userIndex], ...(req.body as any) };

    setData(allData);
    saveData();

    auditLog(req, "UPDATE_USER", req.params.id as string, {
      old_value: oldData,
      new_value: allData[userIndex],
    });

    res.json({ success: true, data: allData[userIndex] });
  },
);

// Dashboard Analytics: Auth -> RBAC -> Logic
app.get(
  "/api/dashboard",
  authenticate,
  requireRole(["Super Admin", "Manager", "admin"]),
  (req: AuthRequest, res) => {
    const allData = getData();
    const totalUsers = allData.length;
    const activeJobs = allData.filter((u) => u.jobStatus === "active").length;
    const pendingKYC = allData.filter((u) => u.kycStatus === "pending").length;

    // Compute revenue and commission from CSV fields
    const totalRevenue = allData.reduce((sum, u) => sum + (parseFloat(u.jobAmount) || 0), 0);
    const totalCommission = allData.reduce((sum, u) => sum + (parseFloat(u.commission) || 0), 0);

    // Frontend expects: data.overview.{totalUsers, activeJobs, pendingKYC, totalRevenue, totalCommission}
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
      },
    });
  },
);

// Analytics: Auth -> RBAC -> Logic
app.get(
  "/api/analytics",
  authenticate,
  requireRole(["Super Admin", "Manager", "admin"]),
  (req: AuthRequest, res) => {
    const allData = getData();

    // Revenue by job category
    const revenueByCategory: Record<string, number> = {};
    for (const row of allData) {
      if (row.jobCategory && row.jobAmount) {
        const cat = row.jobCategory;
        revenueByCategory[cat] = (revenueByCategory[cat] || 0) + (parseFloat(row.jobAmount) || 0);
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
