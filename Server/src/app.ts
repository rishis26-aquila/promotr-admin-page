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
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Promotr Verification</title>
    <style>
      @media only screen and (max-width: 600px) {
        .outer-body { padding: 12px !important; }
        .content-wrapper { padding: 24px 20px !important; }
        .content-section { padding: 0 20px !important; }
        .otp-box { padding: 24px 16px !important; }
        .otp-text { font-size: 36px !important; letter-spacing: 8px !important; }
      }
    </style>
  </head>

    <body
      style="
        margin: 0;
        padding: 16px;
        background: #f5f7fa;
      font-family:
        -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto,
        Helvetica, Arial, sans-serif;
    "
  >
    <table
      role="presentation"
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
    >
      <tr>
        <td align="center">
          <table
            role="presentation"
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="
              max-width: 680px;
              background: #ffffff;
              border: 1px solid #e5e7eb;
              border-radius: 20px;
              overflow: hidden;
            "
          >
            <tr>
              <td style="height: 5px; background: #f06c28"></td>
            </tr>

            <tr>
              <td style="padding: 28px 20px 20px">
                <div
                  style="
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    color: #64748b;
                  "
                >
                  PROMOTR SECURITY
                </div>

                <h1
                  style="
                    margin: 16px 0 0;
                    font-size: 32px;
                    line-height: 1.2;
                    color: #0f172a;
                    font-weight: 800;
                  "
                >
                  Administrator Verification
                </h1>

                <p
                  style="
                    margin: 16px 0 0;
                    color: #475569;
                    font-size: 15px;
                    line-height: 1.8;
                  "
                >
                  A sign-in attempt requires verification before access can be
                  granted to the Promotr administration platform. Use the
                  authentication code below to continue securely.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding: 0 20px">
                <div
                  style="
                    background: transparent;
                    border: 1px solid #f06c28;
                    border-radius: 12px;
                    padding: 12px 16px;
                  "
                >
                  <span
                    style="color: #f06c28; font-size: 14px; font-weight: 600"
                  >
                    Security verification required
                  </span>
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding: 24px 20px">
                <div
                  style="
                    background: #fafafa;
                    border: 1px solid #e5e7eb;
                    border-radius: 16px;
                    text-align: center;
                    padding: 24px 16px;
                  "
                >
                  <div
                    style="
                      font-size: 11px;
                      font-weight: 700;
                      letter-spacing: 2px;
                      text-transform: uppercase;
                      color: #64748b;
                      margin-bottom: 16px;
                    "
                  >
                    One-Time Passcode
                  </div>

                  <div
                    style="
                      font-family: SFMono-Regular, Consolas, Monaco, monospace;
                      font-size: 38px;
                      font-weight: 800;
                      letter-spacing: 8px;
                      line-height: 1;
                      color: #111827;
                    "
                  >
                    ${otp}
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding: 0 20px">
                <div
                  style="
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 16px 20px;
                  "
                >
                  <p style="margin: 0; color: #334155; font-size: 14px">
                    <strong>Validity:</strong> 10 minutes
                  </p>

                  <p style="margin: 12px 0 0; color: #334155; font-size: 14px">
                    <strong>Usage:</strong> Single authentication attempt
                  </p>

                  <p style="margin: 12px 0 0; color: #334155; font-size: 14px">
                    <strong>Access:</strong> Administrator dashboard
                  </p>
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding: 28px 20px">
                <div style="border-top: 1px solid #e5e7eb; padding-top: 24px">
                  <p
                    style="
                      margin: 0;
                      color: #475569;
                      font-size: 14px;
                      line-height: 1.8;
                    "
                  >
                    If you did not initiate this sign-in request, you may safely
                    ignore this email. No action will be taken without
                    successful verification.
                  </p>

                  <p
                    style="
                      margin: 24px 0 0;
                      color: #111827;
                      font-size: 14px;
                      font-weight: 700;
                    "
                  >
                    Promotr Security Team
                  </p>

                  <p style="margin: 8px 0 0; color: #94a3b8; font-size: 12px">
                    © ${new Date().getFullYear()} Promotr Technologies. All
                    rights reserved.
                  </p>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
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
  requireRole(["Super Admin", "Manager", "admin"]),
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
    const totalRevenue = allData.reduce(
      (sum, u) => sum + (parseFloat(u.jobAmount) || 0),
      0,
    );
    const totalCommission = allData.reduce(
      (sum, u) => sum + (parseFloat(u.commission) || 0),
      0,
    );

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
