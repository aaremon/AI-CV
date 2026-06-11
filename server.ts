import express from "express";
import path from "path";
import os from "os";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");
import { createServer as createViteServer } from "vite";
import {
  getAuthUsers,
  insertAuthUser,
  getUsers,
  insertUser,
  deleteUserRecord,
  getFeedback,
  insertFeedback
} from "./src/db";
import { callGeminiWithRetry } from "./src/gemini_service";
import { localHeuristicAnalysis } from "./src/heuristic_service";

const app = express();
const PORT = 3000;

// Set request size limit to 50MB
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Enable CORS if needed (built-in express headers is fine)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// APIs Implementation

app.get("/api/records", (req, res) => {
  try {
    const email = req.query.email as string;
    const allRecords = getUsers();
    if (email) {
      const targetEmail = email.toLowerCase().trim();
      const filtered = allRecords.filter((r) => r.owner_email === targetEmail);
      return res.json(filtered);
    }
    return res.json(allRecords);
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
});

app.get("/api/feedback", (req, res) => {
  try {
    const feedbackList = getFeedback();
    return res.json(feedbackList);
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
});

app.get("/api/admin/records", (req, res) => {
  try {
    const records = getUsers();
    return res.json(records);
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
});

app.delete("/api/records/:recordId", (req, res) => {
  try {
    const recordId = parseInt(req.params.recordId, 10);
    const email = req.query.email as string;
    const ownerEmail = email ? email.toLowerCase().trim() : null;

    if (isNaN(recordId)) {
      return res.status(400).json({ error: "Invalid record ID" });
    }

    const deleted = deleteUserRecord(recordId, ownerEmail);
    if (deleted) {
      return res.json({ success: true, message: "Record successfully deleted from database." });
    } else {
      return res.status(404).json({ success: false, error: "Record not found or access unauthorized." });
    }
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
});

app.post("/api/auth/signup", (req, res) => {
  try {
    const { email, password, name, phone } = req.body || {};

    if (!email || !password || !name || !phone) {
      return res.status(400).json({ error: "Please fill out all signup criteria." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = getAuthUsers();
    if (existing.some((u) => u.email === normalizedEmail)) {
      return res.status(400).json({ error: "An account with this email address already exists." });
    }

    const passwordHash = `plain:${password}`;
    const timestamp = new Date().toISOString();

    const userPayload = {
      email: normalizedEmail,
      name: name.trim(),
      phone: phone.trim(),
      passwordHash,
      created_at: timestamp
    };

    const newUser = insertAuthUser(userPayload);
    const { passwordHash: _, ...userSafe } = newUser;

    return res.json({ success: true, user: userSafe });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
});

app.post("/api/auth/login", (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: "Missing login details." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const users = getAuthUsers();
    const found = users.find((u) => u.email === normalizedEmail);

    if (!found || found.passwordHash !== `plain:${password}`) {
      return res.status(401).json({ error: "Invalid email account or wrong credential passwords." });
    }

    const { passwordHash: _, ...userSafe } = found;
    return res.json({ success: true, user: userSafe });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
});

app.post("/api/feedback", (req, res) => {
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
});

app.post("/api/admin/login", (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (username === "admin" && password === "admin@resume-analyzer") {
      return res.json({ success: true, token: "admin-authenticated-token" });
    } else {
      return res.status(401).json({ success: false, error: "Wrong ID & Password Provided" });
    }
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
});

app.post("/api/analyze", async (req, res) => {
  try {
    const {
      act_name,
      act_mail,
      act_mob,
      fileBase64,
      fileType,
      rawText,
      fileName,
      owner_email
    } = req.body || {};

    if (!act_name || !act_mail || !act_mob) {
      return res.status(400).json({ error: "Missing required contact fields (Name, Mail, Mobile)" });
    }

    if (!fileBase64 && !rawText) {
      return res.status(400).json({ error: "Please upload a resume file or paste resume details." });
    }

    let rawTextToAnalyze = rawText || "";
    let dataStrClean = "";

    if (fileBase64 && fileType) {
      dataStrClean = fileBase64;
      if (dataStrClean.includes(",")) {
        dataStrClean = dataStrClean.split(",")[1];
      }
      try {
        const decodedBytes = Buffer.from(dataStrClean, "base64");
        if (fileType.toLowerCase().includes("pdf") || (fileName && fileName.toLowerCase().endsWith(".pdf"))) {
          const pdfData = await pdf(decodedBytes);
          const extractedText = pdfData.text || "";
          rawTextToAnalyze = rawTextToAnalyze + "\n" + extractedText;
          console.log(`[Analyze TS] Successfully extracted ${extractedText.length} characters of clean text from PDF via pdf-parse.`);
        } else {
          const extracted = decodedBytes.toString("utf8");
          rawTextToAnalyze = rawTextToAnalyze + "\n" + extracted;
        }
      } catch (e: any) {
        console.warn("[Analyze error decoding base64 / extracting PDF]", e);
        try {
          const decodedBytes = Buffer.from(dataStrClean, "base64");
          const extracted = decodedBytes.toString("utf8");
          rawTextToAnalyze = rawTextToAnalyze + "\n" + extracted;
        } catch (_) {}
      }
    }

    const promptText = `
    You are an elite talent acquisition expert and senior technical recruiter.
    Analyze the candidate's exact resume text provided below and extract highly accurate, grounded attributes. Do not use generic placeholders unless something is completely missing from the resume.

    EXTRACTED RESUME TEXT:
    \"\"\"
    ${rawTextToAnalyze}
    \"\"\"

    INSTRUCTIONS:
    1. Extract candidate's objective full name (if not explicitly found or if unclear, use the user-provided: "${act_name}").
    2. Extract their actual email address (if not found, use: "${act_mail}").
    3. Extract their contact details/phone number (if not found, use: "${act_mob}").
    4. Determine their actual highest Degree or Education Level based on keywords in their education details of the CV.
    5. Count words/estimate pages (no_of_pages). Usually, up to 600 words is 1 page; more is 2.
    6. Formulate experience level (cand_level) precisely: "Fresher" (under 2 years or entry level), "Intermediate" (2-5 years), or "Experienced" (more than 5 years/leads).
    7. Predict their track (predicted_field) precisely from: "Data Science", "Web Development", "Android Development", "iOS Development", "UI-UX Development", or "Other".
    8. Extract all major skills listed in the CV for "current_skills" array.
    9. Suggest exactly 8-12 constructive "recommended_skills" that perfectly align with their predicted field and fill in trending gaps.
    10. Verify whether the following 10 sections are present in their CV ('true'/present or 'false'/missing) and compute the final 'resume_score' (sum of present sections):
        - Objective or Summary (6 points)
        - Education Details (12 points)
        - Experience or Work Experience (16 points)
        - Internships (6 points)
        - Skills section (7 points)
        - Hobbies (4 points)
        - Interests (5 points)
        - Achievements (13 points)
        - Certifications section (12 points)
        - Projects (19 points)
    11. Populate the 'feedback' array of exactly 10 objects (one for each section above). 
        - Prepare a highly constructive 'detail' sentence (about 15-25 words long) explaining exactly what is present or missing in their specific CV. Provide professional advice tailored only to their experience. Do NOT use overly generic templates.
    12. Recommend 3 highly specific learning courses with clickable resource links based on their predicted field.
    `;

    let parsedResult: any = null;

    try {
      const contents: any[] = [];
      if (fileBase64 && fileType) {
        const mime = fileType.includes("pdf") ? "application/pdf" : "text/plain";
        contents.push({
          inlineData: {
            data: dataStrClean,
            mimeType: mime
          }
        });
      } else if (rawText) {
        contents.push(rawText);
      }

      contents.push(promptText);

      const response = await callGeminiWithRetry(
        contents,
        "You are an elite Resume Coach and technical recruiter. Give accurate, highly grounded, detailed resume analysis to maximize candidate job opportunities."
      );

      const textResponse = response.text;
      if (!textResponse) {
        throw new Error("No text response returned from Gemini API.");
      }

      parsedResult = JSON.parse(textResponse.trim());
      console.log("[Analyze TS] Successfully analyzed resume with Gemini API.");
    } catch (err: any) {
      console.warn(`[Analyze TS Fallback] Gemini analysis failed/timing out: ${err.message || err}. Falling back to instant heuristic analyzer...`);
      parsedResult = localHeuristicAnalysis(
        rawTextToAnalyze,
        fileName || "Resume.pdf",
        act_name,
        act_mail,
        act_mob
      );
    }

    const token = Math.random().toString(36).substring(2, 14);
    const timestamp = new Date().toISOString();

    const mockLocations = [
      { city: "Sydney", state: "NSW", country: "Australia", latlong: "[-33.86, 151.20]" },
      { city: "New York", state: "NY", country: "United States", latlong: "[40.71, -74.00]" },
      { city: "San Francisco", state: "CA", country: "United States", latlong: "[37.77, -122.41]" },
      { city: "Mumbai", state: "MH", country: "India", latlong: "[19.07, 72.87]" },
      { city: "Paris", state: "IDF", country: "France", latlong: "[48.85, 2.35]" },
      { city: "London", state: "England", country: "United Kingdom", latlong: "[51.50, -0.12]" },
      { city: "Toronto", state: "ON", country: "Canada", latlong: "[43.65, -79.38]" },
      { city: "Berlin", state: "BE", country: "Germany", latlong: "[52.52, 13.40]" }
    ];
    const loc = mockLocations[Math.floor(Math.random() * mockLocations.length)];

    const recordPayload = {
      sec_token: token,
      ip_add: "127.0.0.1",
      host_name: os.hostname() || "node-server",
      dev_user: process.env.USER || "user",
      os_name_ver: `${os.type()} ${os.release()}`,
      latlong: loc.latlong,
      city: loc.city,
      state: loc.state,
      country: loc.country,
      act_name: act_name,
      act_mail: act_mail,
      act_mob: act_mob,
      name: parsedResult.name || act_name,
      email: parsedResult.email || act_mail,
      resume_score: String(parsedResult.resume_score || 0),
      timestamp: timestamp,
      page_no: String(parsedResult.no_of_pages || 1),
      reco_field: parsedResult.predicted_field || "Other",
      cand_level: parsedResult.cand_level || "Fresher",
      skills: JSON.stringify(parsedResult.current_skills || []),
      recommended_skills: JSON.stringify(parsedResult.recommended_skills || []),
      courses: JSON.stringify(parsedResult.recommended_courses || []),
      pdf_name: fileName || "Pasted_Resume_Text.txt",
      owner_email: owner_email ? owner_email.toLowerCase().trim() : null
    };

    const insertedRecord = insertUser(recordPayload);

    return res.json({
      success: true,
      data: parsedResult,
      record: insertedRecord
    });
  } catch (e: any) {
    console.error("[Analyze Error TS]", e);
    return res.status(500).json({ error: e.message || String(e) });
  }
});

// Setup Vite Dev Server Middleware or Production Static Server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Express Node Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
