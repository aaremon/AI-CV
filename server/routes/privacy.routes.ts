import { Router } from "express";
import { getPrivacyAudit, getPrivacySettings } from "../controllers/privacy.controller";

const router = Router();

router.get("/audit", getPrivacyAudit);
router.get("/settings", getPrivacySettings);

export default router;
