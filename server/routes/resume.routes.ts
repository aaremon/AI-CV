import { Router } from "express";
import {
  analyzeResume,
  generateCoverLetter,
  optimizeLinkedInProfile,
  getRecords,
  deleteRecord
} from "../controllers/resume.controller";

const router = Router();

router.post("/analyze", analyzeResume);
router.post("/cover-letter", generateCoverLetter);
router.post("/linkedin-optimize", optimizeLinkedInProfile);
router.get("/records", getRecords);
router.delete("/records/:recordId", deleteRecord);

export default router;
