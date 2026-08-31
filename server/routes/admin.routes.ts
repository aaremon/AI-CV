import { Router } from "express";
import { requireAdmin } from "../middleware/auth.middleware";
import {
  adminLogin,
  getAdminStats,
  getAdminUsers,
  updateUserStatus,
  updateUserRole,
  getFeatureUsage,
  getAiUsage,
  getSystemHealth,
  getAdminSecurityEvents,
  getAdminAuditLogsList,
  getAdminRecords,
  resetDatabaseData
} from "../controllers/admin.controller";

const router = Router();

// Public admin login
router.post("/login", adminLogin);

// Protected admin endpoints
router.get("/stats", requireAdmin, getAdminStats);
router.get("/users", requireAdmin, getAdminUsers);
router.post("/users/status", requireAdmin, updateUserStatus);
router.post("/users/role", requireAdmin, updateUserRole);
router.get("/feature-usage", requireAdmin, getFeatureUsage);
router.get("/ai-usage", requireAdmin, getAiUsage);
router.get("/system-health", requireAdmin, getSystemHealth);
router.get("/security-events", requireAdmin, getAdminSecurityEvents);
router.get("/audit-logs", requireAdmin, getAdminAuditLogsList);
router.get("/records", requireAdmin, getAdminRecords);
router.post("/reset-data", requireAdmin, resetDatabaseData);

export default router;
