import { Router } from "express";
import {
  getUserCvs,
  getVersions,
  createVersion,
  deleteVersion,
  getDocuments,
  createDocument,
  deleteDocument,
  getSessions,
  revokeSession,
  getNotifications,
  getSecurityActivity,
  clearAiHistory,
  deleteAllUserData,
  deleteAccount
} from "../controllers/user.controller";

const router = Router();

router.get("/cvs", getUserCvs);
router.get("/versions", getVersions);
router.post("/versions", createVersion);
router.delete("/versions/:id", deleteVersion);

router.get("/documents", getDocuments);
router.post("/documents", createDocument);
router.delete("/documents/:id", deleteDocument);

router.get("/sessions", getSessions);
router.post("/sessions/revoke", revokeSession);

router.get("/notifications", getNotifications);
router.get("/security-activity", getSecurityActivity);

router.delete("/ai-history", clearAiHistory);
router.delete("/all-data", deleteAllUserData);
router.delete("/account", deleteAccount);

export default router;
