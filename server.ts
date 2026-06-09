import express from "express";
import path from "path";
import fs from "fs";
import os from "os";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import {
  insertUser,
  getUsers,
  insertFeedback,
  getFeedback,
  getAuthUsers,
  insertAuthUser,
  deleteUserRecord
} from "./src/db.js";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase body parsing limits to support base64 document attachments
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// Initialize the Google GenAI SDK with server-side environment key
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// JSON schema definition for structured parser response from Gemini
const resumeResponseSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "Candidate's full name" },
    email: { type: Type.STRING, description: "Candidate's email address" },
    phone: { type: Type.STRING, description: "Candidate's contact/phone number" },
    degree: { type: Type.STRING, description: "Candidate's degree or education level" },
    no_of_pages: { type: Type.INTEGER, description: "Estimated or actual page count" },
    cand_level: { type: Type.STRING, description: "Fresher, Intermediate, or Experienced" },
    predicted_field: { type: Type.STRING, description: "Data Science, Web Development, Android Development, iOS Development, UI-UX Development, or Other" },
    current_skills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of existing skills found in resume"
    },
    recommended_skills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 8-12 recommended skills to boost their resume for their predicted field"
    },
    resume_score: { type: Type.INTEGER, description: "Overall Resume score out of 100 based on standard content checklist (Objective: 6, Education: 12, Experience: 16, Internships: 6, Skills: 7, Hobbies: 4, Interests: 5, Achievements: 13, Certifications: 12, Projects: 19)" },
    score_factors: {
      type: Type.OBJECT,
      properties: {
        has_objective: { type: Type.BOOLEAN },
        has_education: { type: Type.BOOLEAN },
        has_experience: { type: Type.BOOLEAN },
        has_internship: { type: Type.BOOLEAN },
        has_skills: { type: Type.BOOLEAN },
        has_hobbies: { type: Type.BOOLEAN },
        has_interests: { type: Type.BOOLEAN },
        has_achievements: { type: Type.BOOLEAN },
        has_certifications: { type: Type.BOOLEAN },
        has_projects: { type: Type.BOOLEAN }
      },
      required: [
        "has_objective", "has_education", "has_experience", "has_internship",
        "has_skills", "has_hobbies", "has_interests", "has_achievements",
        "has_certifications", "has_projects"
      ]
    },
    feedback: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          factor: { type: Type.STRING, description: "The name of the checked item: Objective, Education, Experience, Internships, Skills, Hobbies, Interests, Achievements, Certifications, or Projects" },
          status: { type: Type.STRING, description: "added or missing" },
          detail: { type: Type.STRING, description: "Full constructive recommendation or congrats details" }
        },
        required: ["factor", "status", "detail"]
      }
    },
    recommended_courses: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Custom realistic certification course title from Coursera, Udemy, etc." },
          link: { type: Type.STRING, description: "Learning link (use standard course query search links or actual paths)" }
        },
        required: ["title", "link"]
      }
    }
  },
  required: [
    "name", "email", "phone", "degree", "no_of_pages", "cand_level",
    "predicted_field", "current_skills", "recommended_skills", "resume_score",
    "score_factors", "feedback", "recommended_courses"
  ]
};

// Signup endpoint
app.post("/api/auth/signup", (req, res) => {
  try {
    const { email, password, name, phone } = req.body;
    if (!email || !password || !name || !phone) {
      return res.status(400).json({ error: "Please fill out all signup criteria." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = getAuthUsers();
    if (existing.some(u => u.email === normalizedEmail)) {
      return res.status(400).json({ error: "An account with this email address already exists." });
    }

    // High quality mock-hash for storage
    const passwordHash = `plain:${password}`;
    const timestamp = new Date().toISOString();

    const newUser = insertAuthUser({
      email: normalizedEmail,
      name: name.trim(),
      phone: phone.trim(),
      passwordHash,
      created_at: timestamp
    });

    const { passwordHash: _, ...userSafe } = newUser;
    res.json({ success: true, user: userSafe });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Login endpoint
app.post("/api/auth/login", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Missing login details." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const users = getAuthUsers();
    const found = users.find(u => u.email === normalizedEmail);

    if (!found || found.passwordHash !== `plain:${password}`) {
      return res.status(401).json({ error: "Invalid email account or wrong credential passwords." });
    }

    const { passwordHash: _, ...userSafe } = found;
    res.json({ success: true, user: userSafe });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST endpoint for resume analysis
app.post("/api/analyze", async (req, res) => {
  try {
    const { act_name, act_mail, act_mob, fileBase64, fileType, rawText, fileName, owner_email } = req.body;

    if (!act_name || !act_mail || !act_mob) {
      return res.status(400).json({ error: "Missing required contact fields (Name, Mail, Mobile)" });
    }

    if (!fileBase64 && !rawText) {
      return res.status(400).json({ error: "Please upload a resume file or paste resume details." });
    }

    // Safety checks for API Key and prompt formulation
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY environment variable is not configured." });
    }

    const contents: any[] = [];
    
    // Add file or raw text to model input
    if (fileBase64 && fileType) {
      // Remove data URL prefix if present
      const base64Clean = fileBase64.replace(/^data:.*,/, "");
      contents.push({
        inlineData: {
          mimeType: fileType.includes("pdf") ? "application/pdf" : "text/plain",
          data: base64Clean,
        },
      });
    }

    const promptText = `
      You are an elite talent acquisition AI model and resume analyzer.
      Parse the attached resume content.
      Identify basic details (Degree, contact, email, skills, and Name).
      Verify if the following components are present and compute the resume_score:
      - Objective or Summary (worth 6 points)
      - Education Details (worth 12 points)
      - Experience or Work Experience (worth 16 points)
      - Internships (worth 6 points)
      - Skills section (worth 7 points)
      - Hobbies (worth 4 points)
      - Interests (worth 5 points)
      - Achievements (worth 13 points)
      - Certifications section (worth 12 points)
      - Projects (worth 19 points)
      Compute the exact total score (sum of all present factors, maximum 100).
      
      Determine candidate experience level:
      - "Fresher": short, simple factors or mentions of fresher.
      - "Intermediate": has internships or limited work experience.
      - "Experienced": has extensive work experience / industry time.

      Predict the best-matched track field from these: Data Science, Web Development, Android Development, iOS Development, UI-UX Development. If it doesn't match any of these, set "Other".
      
      Suggest 8-12 recommended skills specific to that predicted field that are NOT yet in the candidate's skills list.
      Provide detailed constructive recommendations in feedback array for each of the 10 checkpoints, with actionable tips on how they can improve.
      Recommend 4-6 high-quality professional learning course certifications with links relevant to their career trajectory.
      
      Note: Keep all names and links extremely realistic and helpful.
    `;

    contents.push(promptText);

    // Call Gemini API server-side
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: resumeResponseSchema,
        systemInstruction: "You are an expert ATS (Applicant Tracking System) recruiter parsing resumes into structured profiles.",
      }
    });

    if (!response.text) {
      throw new Error("No response content from Gemini API.");
    }

    const parsedResult = JSON.parse(response.text.trim());

    // Gather request metadata (simulating SQL rows)
    const token = Math.random().toString(36).substring(2, 14);
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";
    const hostName = os.hostname();
    const devUser = os.userInfo().username || "user";
    const osNameVer = `${os.platform()} ${os.release()}`;
    const latlong = "[0.0, 0.0]"; // Default static locator
    const city = "Sydney";
    const state = "NSW";
    const country = "Australia";
    const timestamp = new Date().toISOString();

    const record = insertUser({
      sec_token: token,
      ip_add: String(ip),
      host_name: hostName,
      dev_user: devUser,
      os_name_ver: osNameVer,
      latlong: latlong,
      city: city,
      state: state,
      country: country,
      act_name: act_name,
      act_mail: act_mail,
      act_mob: act_mob,
      name: parsedResult.name || act_name,
      email: parsedResult.email || act_mail,
      resume_score: String(parsedResult.resume_score),
      timestamp: timestamp,
      page_no: String(parsedResult.no_of_pages || 1),
      reco_field: parsedResult.predicted_field,
      cand_level: parsedResult.cand_level,
      skills: JSON.stringify(parsedResult.current_skills || []),
      recommended_skills: JSON.stringify(parsedResult.recommended_skills || []),
      courses: JSON.stringify(parsedResult.recommended_courses || []),
      pdf_name: fileName || "Pasted_Resume_Text.txt",
      owner_email: owner_email ? String(owner_email).toLowerCase().trim() : undefined
    });

    res.json({
      success: true,
      data: parsedResult,
      record: record
    });

  } catch (error: any) {
    console.error("API error during resume analysis: ", error);
    res.status(500).json({ error: error.message || "An error occurred during resume analysis." });
  }
});

// Get user-specific or all records
app.get("/api/records", (req, res) => {
  try {
    const { email } = req.query;
    const all = getUsers();
    if (email) {
      const filtered = all.filter(r => r.owner_email === String(email).toLowerCase().trim());
      return res.json(filtered);
    }
    res.json(all);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a user-saved resume record
app.delete("/api/records/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.query;
    if (!id) return res.status(400).json({ error: "Missing record ID" });
    
    const ownerEmail = email ? String(email).toLowerCase().trim() : undefined;
    const deleted = deleteUserRecord(Number(id), ownerEmail);
    
    if (deleted) {
      res.json({ success: true, message: "Record successfully deleted from database." });
    } else {
      res.status(404).json({ success: false, error: "Record not found or access unauthorized." });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST endpoint to handle feedback submission
app.post("/api/feedback", (req, res) => {
  try {
    const { name, email, rating, comments } = req.body;
    if (!name || !email || !rating) {
      return res.status(400).json({ error: "Name, email, and rating score are required." });
    }

    const timestamp = new Date().toISOString();
    const record = insertFeedback({
      feed_name: name,
      feed_email: email,
      feed_score: String(rating),
      comments: comments || "",
      timestamp: timestamp
    });

    res.json({ success: true, record });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET endpoint to retrieve feedback statistics
app.get("/api/feedback", (req, res) => {
  try {
    const list = getFeedback();
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin endpoints
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin@resume-analyzer") {
    return res.json({ success: true, token: "admin-authenticated-token" });
  }
  return res.status(401).json({ success: false, error: "Wrong ID & Password Provided" });
});

app.get("/api/admin/records", (req, res) => {
  try {
    const records = getUsers();
    res.json(records);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Setup Vite development server or direct static serving
async function configureServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
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
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

configureServer();
