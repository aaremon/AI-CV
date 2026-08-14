import { Router } from "express";
import {
  signup,
  login,
  updateProfile,
  changePassword,
  toggleMfa
} from "../controllers/auth.controller";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/profile", updateProfile);
router.post("/change-password", changePassword);
router.post("/mfa/toggle", toggleMfa);

export default router;
