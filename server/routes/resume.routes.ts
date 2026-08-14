import { Router } from "express";
import {
  analyzeResume,
  generateCoverLetter,
  getRecords,
  deleteRecord
} from "../controllers/resume.controller";

const router = Router();

router.post("/analyze", analyzeResume);
router.post("/cover-letter", generateCoverLetter);
router.get("/records", getRecords);
router.delete("/records/:recordId", deleteRecord);

export default router;
