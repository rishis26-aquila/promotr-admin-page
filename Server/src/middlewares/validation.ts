import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

// Validation Middleware (Strict validation to reject unknown fields)
export function validateSchema(
  schema: z.ZodSchema<any>,
  property: "body" | "query" | "params" = "body",
) {
  return (req: Request, res: Response, next: NextFunction) => {
    // 🛡️ SECURITY: validate_body/query/params rule, reject_unknown_fields rule
    const result = schema.safeParse(req[property]);

    if (!result.success) {
      // Return generic error structure (hide internal details)
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: result.error.issues.map((e: any) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      });
    }

    // Replace req property with sanitized/validated data (strips unknown fields if schema is strict)
    req[property] = result.data;
    next();
  };
}
