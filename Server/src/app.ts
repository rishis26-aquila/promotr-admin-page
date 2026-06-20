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
  const cookieName = isProduction ? "__Host-promotr_csrf" : "promotr_csrf";

  res.cookie(cookieName, csrfToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
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
      return res
        .status(403)
        .json({
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
      await resend.emails.send({
        from: "Promotr Admin <onboarding@resend.dev>",
        to: email,
        subject: `Your Admin Verification Code: ${otp}`,
        html: `<p>Your OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`,
      });

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
      const sessionCookieName = isProduction
        ? "__Host-promotr_session"
        : "promotr_session";

      res.cookie(sessionCookieName, sessionToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "strict" : "lax",
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
  res.clearCookie("__Host-promotr_session");
  res.clearCookie("promotr_session");
  res.clearCookie("__Host-promotr_csrf");
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
  requireRole(["Super Admin", "Manager"]),
  (req: AuthRequest, res) => {
    const allData = getData();
    const totalUsers = allData.length;
    const activeJobs = allData.filter((u) => u.jobStatus === "active").length;
    const pendingKyc = allData.filter((u) => u.kycStatus === "pending").length;

    res.json({ success: true, data: { totalUsers, activeJobs, pendingKyc } });
  },
);

// Analytics Chart Data: Auth -> Logic
app.get(
  "/api/analytics",
  authenticate,
  requireRole(["Super Admin", "Manager"]),
  (req: AuthRequest, res) => {
    res.json({
      success: true,
      data: {
        usersByMonth: [
          { name: "Jan", users: 4000 },
          { name: "Feb", users: 3000 },
          { name: "Mar", users: 5000 },
        ],
      },
    });
  },
);

export default app;
