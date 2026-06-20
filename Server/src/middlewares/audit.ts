import type { Request } from "express";

export function auditLog(
  req: Request,
  action: string,
  target: string,
  details: any,
) {
  const actor = (req as any).user?.email || "unknown_system_or_unauthenticated";
  const ip_address = req.ip || req.headers["x-forwarded-for"] || "unknown_ip";
  const user_agent = req.headers["user-agent"] || "unknown_agent";

  const logEntry = {
    actor,
    target,
    action,
    timestamp: new Date().toISOString(),
    ip_address,
    user_agent,
    old_value: details.old_value || null,
    new_value: details.new_value || null,
  };

  // In a real application, this would write to an AuditLog table.
  // For now, structured JSON logging to stdout for Datadog/Vercel to ingest.
  console.log(`[AUDIT] ${JSON.stringify(logEntry)}`);
}
