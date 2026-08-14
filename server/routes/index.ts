import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import adminRoutes from "./admin.routes";
import feedbackRoutes from "./feedback.routes";
import privacyRoutes from "./privacy.routes";
import resumeRoutes from "./resume.routes";

const router = Router();

// Route modules
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/admin", adminRoutes);
router.use("/feedback", feedbackRoutes);
router.use("/privacy", privacyRoutes);
router.use("/", resumeRoutes);

export default router;
