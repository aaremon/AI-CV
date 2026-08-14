import { Router } from "express";
import { getAllFeedback, submitFeedback } from "../controllers/feedback.controller";

const router = Router();

router.get("/", getAllFeedback);
router.post("/", submitFeedback);

export default router;
