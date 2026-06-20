import type { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";

// Allowed origins for CORS (Strict Whitelist)
export const ALLOWED_ORIGINS = [
  "https://admin-promotr.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

// CORS Configuration
export function corsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-CSRF-Token",
  );
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
}

// Security headers (Helmet covers most, but adding specific fallback)
export function securityHeaders(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.header("X-Content-Type-Options", "nosniff");
  res.header("X-Frame-Options", "DENY");
  res.header(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains",
  );
  next();
}

// Rate Limiters
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { success: false, message: "Too many requests from this IP" },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many login attempts" },
  standardHeaders: true,
  legacyHeaders: false,
});

export const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // STRICT: limit each IP to 5 OTP requests per 15 min
  message: {
    success: false,
    message:
      "Too many OTP requests from this IP, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// CSRF Protection Middleware (Double Submit Cookie)
export function csrfProtect(req: Request, res: Response, next: NextFunction) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }

  const tokenFromHeader = req.headers["x-csrf-token"];
  const isProduction = process.env.NODE_ENV === "production";
  const cookieName = isProduction ? "__Host-promotr_csrf" : "promotr_csrf";
  const tokenFromCookie = req.cookies?.[cookieName];

  if (
    !tokenFromHeader ||
    !tokenFromCookie ||
    tokenFromHeader !== tokenFromCookie
  ) {
    return res
      .status(403)
      .json({ success: false, message: "CSRF token missing or invalid" });
  }
  next();
}
