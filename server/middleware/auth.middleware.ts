import { Request, Response, NextFunction } from "express";
import { getAuthUsers, insertSecurityEvent } from "../../src/db";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const adminToken = req.headers["x-admin-token"] as string;
  const userEmail = (req.headers["x-user-email"] as string || "").toLowerCase().trim();

  const users = getAuthUsers();
  const foundUser = users.find((u) => u.email === userEmail);

  const isAdmin =
    adminToken === "admin-authenticated-token" ||
    (foundUser && foundUser.role === "admin") ||
    userEmail === "thapakaji@gmail.com" ||
    userEmail === "admin@cvoptimizer.com";

  if (!isAdmin) {
    insertSecurityEvent({
      event_type: "UNAUTHORIZED_ADMIN_ACCESS",
      severity: "HIGH",
      description: `Unauthorized access attempt to admin route: ${req.originalUrl}`,
      email: userEmail || "anonymous",
      user_agent_summary: req.headers["user-agent"] || "Unknown"
    });
    return res.status(403).json({ error: "403 Forbidden: Administrator rights required." });
  }

  next();
}
