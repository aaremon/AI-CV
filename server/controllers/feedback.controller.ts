import { Request, Response } from "express";
import { getFeedback, insertFeedback } from "../../src/db";

export async function getAllFeedback(req: Request, res: Response) {
  try {
    const feedbackList = getFeedback();
    return res.json(feedbackList);
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
}

export async function submitFeedback(req: Request, res: Response) {
  try {
    const { name, email, rating, comments } = req.body || {};

    if (!name || !email || rating === undefined || rating === null) {
      return res.status(400).json({ error: "Name, email, and rating score are required." });
    }

    const timestamp = new Date().toISOString();
    const payload = {
      feed_name: name,
      feed_email: email,
      feed_score: String(rating),
      comments: comments || "",
      timestamp: timestamp
    };

    const record = insertFeedback(payload);
    return res.json({ success: true, record: record });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
}
