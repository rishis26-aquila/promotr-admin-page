import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getJwtSecret(): string {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  if (fs.existsSync(path.join(__dirname, "..", "..", "jwt_secret.txt"))) {
    return fs
      .readFileSync(path.join(__dirname, "..", "..", "jwt_secret.txt"), "utf-8")
      .trim();
  }
  console.warn(
    "⚠️ Generating ephemeral JWT secret. Sessions will not persist across restarts!",
  );
  return crypto.randomBytes(32).toString("hex");
}

export const JWT_SECRET = getJwtSecret();

export interface AuthRequest extends Request {
  user?: { id: string; email: string; name: string; role: string };
}

// 1. Authentication Middleware
export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies?.promotr_session;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      name: string;
      role: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    res.clearCookie("promotr_session");
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired session" });
  }
}

// 2. Authorization Middleware (RBAC)
export function requireRole(allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    // Check if user has required role
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Insufficient permissions to access this resource",
      });
    }
    next();
  };
}
