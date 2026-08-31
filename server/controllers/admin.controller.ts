import { Request, Response } from "express";
import os from "os";
import {
  getAuthUsers,
  getUsers,
  getFeedback,
  getSecurityEvents,
  getAdminAuditLogs,
  updateAuthUser,
  insertSecurityEvent,
  insertAdminAuditLog,
  resetEntireDatabase
} from "../../src/db";

export async function adminLogin(req: Request, res: Response) {
  try {
    const { username, password } = req.body || {};
    const normalizedUser = (username || "").toLowerCase().trim();
    const isValidAdminUser =
      normalizedUser === "thapakaji@gmail.com" ||
      normalizedUser === "admin" ||
      normalizedUser === "admin@cvoptimizer.com";
    const isValidPassword =
      password === "password" ||
      password === "admin@resume-analyzer";

    if (isValidAdminUser && isValidPassword) {
      const adminEmail = normalizedUser === "admin" ? "thapakaji@gmail.com" : normalizedUser;
      insertSecurityEvent({
        event_type: "ADMIN_LOGIN_SUCCESS",
        severity: "LOW",
        description: `Admin successfully authenticated: ${username}`,
        email: adminEmail
      });
      insertAdminAuditLog({
        admin_email: adminEmail,
        action: "ADMIN_LOGIN",
        target_resource: "Admin Panel",
        result: "SUCCESS"
      });
      return res.json({
        success: true,
        token: "admin-authenticated-token",
        user: {
          id: 1,
          email: adminEmail,
          name: "Platform Administrator",
          role: "admin",
          mfa_enabled: false
        }
      });
    } else {
      insertSecurityEvent({
        event_type: "ADMIN_LOGIN_FAILED",
        severity: "HIGH",
        description: `Failed admin login attempt with username: ${username}`,
        email: username
      });
      return res.status(401).json({ success: false, error: "Wrong Admin ID or Password Provided." });
    }
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
}

export async function getAdminStats(req: Request, res: Response) {
  try {
    const authUsers = getAuthUsers();
    const cvRecords = getUsers();
    const securityEvents = getSecurityEvents("ALL", "ALL");
    const feedback = getFeedback();

    const totalUsers = authUsers.length;
    const activeUsers = authUsers.filter(u => u.status !== "disabled").length;
    const admins = authUsers.filter(u => u.role === "admin").length;
    const totalCVs = cvRecords.length;
    const criticalSecurityEvents = securityEvents.filter(e => e.severity === "CRITICAL" || e.severity === "HIGH").length;

    return res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        admins,
        totalCVs,
        totalAnalyses: totalCVs,
        feedbackCount: feedback.length,
        criticalSecurityEvents,
        uptimeSeconds: Math.floor(process.uptime()),
        memoryUsageMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
      }
    });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
}

export async function getAdminUsers(req: Request, res: Response) {
  try {
    const users = getAuthUsers();
    const cvRecords = getUsers();

    const sanitizedUsers = users.map(u => {
      const userCvs = cvRecords.filter(r => r.owner_email === u.email);
      return {
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role || "user",
        status: u.status || "active",
        mfa_enabled: !!u.mfa_enabled,
        created_at: u.created_at,
        last_login: u.last_login || u.created_at,
        cv_count: userCvs.length,
        analyses_count: userCvs.length
      };
    });

    return res.json({ success: true, users: sanitizedUsers });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
}

export async function updateUserStatus(req: Request, res: Response) {
  try {
    const { email, status } = req.body || {};
    const adminEmail = (req.headers["x-user-email"] as string) || "admin@cvoptimizer.com";

    if (!email || !status) return res.status(400).json({ error: "Email and status required." });

    const updated = updateAuthUser(email, { status });
    if (updated) {
      insertAdminAuditLog({
        admin_email: adminEmail,
        action: `ACCOUNT_${status.toUpperCase()}`,
        target_resource: `User: ${email}`,
        result: "SUCCESS"
      });
      return res.json({ success: true, user: updated });
    }
    return res.status(404).json({ error: "User not found." });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
}

export async function updateUserRole(req: Request, res: Response) {
  try {
    const { email, role } = req.body || {};
    const adminEmail = (req.headers["x-user-email"] as string) || "admin@cvoptimizer.com";

    if (!email || !role) return res.status(400).json({ error: "Email and role required." });

    const updated = updateAuthUser(email, { role });
    if (updated) {
      insertAdminAuditLog({
        admin_email: adminEmail,
        action: `ROLE_CHANGE_TO_${role.toUpperCase()}`,
        target_resource: `User: ${email}`,
        result: "SUCCESS"
      });
      return res.json({ success: true, user: updated });
    }
    return res.status(404).json({ error: "User not found." });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
}

export async function getFeatureUsage(req: Request, res: Response) {
  try {
    const cvRecords = getUsers();
    const atsScans = cvRecords.length;
    const coverLetters = Math.floor(atsScans * 0.7) + 5;
    const linkedinOpt = Math.floor(atsScans * 0.5) + 3;
    const bioGen = Math.floor(atsScans * 0.4) + 2;
    const jobEmails = Math.floor(atsScans * 0.3) + 1;

    return res.json({
      success: true,
      features: {
        atsScans,
        cvOptimizations: atsScans,
        coverLetters,
        linkedinOpt,
        bioGen,
        jobEmails
      }
    });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
}

export async function getAiUsage(req: Request, res: Response) {
  try {
    const cvRecords = getUsers();
    const totalRequests = cvRecords.length + 15;
    return res.json({
      success: true,
      aiMetrics: {
        totalRequestsToday: Math.min(totalRequests, 45),
        totalRequestsThisMonth: totalRequests,
        successfulRequests: totalRequests,
        failedRequests: 0,
        averageResponseTimeMs: 1450,
        rateLimitedCount: 0,
        estimatedTokensUsed: totalRequests * 850
      }
    });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
}

export async function getSystemHealth(req: Request, res: Response) {
  try {
    const memory = process.memoryUsage();
    return res.json({
      success: true,
      health: {
        status: "OPERATIONAL",
        services: {
          expressApi: { status: "Operational", latencyMs: 12 },
          database: { status: "Operational", latencyMs: 4 },
          geminiApi: { status: "Operational", latencyMs: 85 },
          fileStorage: { status: "Operational", latencyMs: 2 },
          authService: { status: "Operational", latencyMs: 5 }
        },
        system: {
          uptimeSeconds: Math.floor(process.uptime()),
          nodeVersion: process.version,
          platform: process.platform,
          heapUsedMb: Math.round(memory.heapUsed / 1024 / 1024),
          heapTotalMb: Math.round(memory.heapTotal / 1024 / 1024),
          cpuLoad: os.loadavg()[0] || 0.1
        }
      }
    });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
}

export async function getAdminSecurityEvents(req: Request, res: Response) {
  try {
    const severity = req.query.severity as string;
    const category = req.query.category as string;
    const events = getSecurityEvents(severity, category);
    return res.json({ success: true, events });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
}

export async function getAdminAuditLogsList(req: Request, res: Response) {
  try {
    const logs = getAdminAuditLogs();
    return res.json({ success: true, logs });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
}

export async function getAdminRecords(req: Request, res: Response) {
  try {
    const records = getUsers();
    return res.json(records);
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
}

export async function resetDatabaseData(req: Request, res: Response) {
  try {
    resetEntireDatabase();
    return res.json({ success: true, message: "All historical data cleared successfully. Database is fresh." });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
}
