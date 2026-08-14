import { Request, Response } from "express";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import {
  getUsers,
  insertUser,
  deleteUserRecord,
  insertAdminAuditLog,
  insertSecurityEvent
} from "../../src/db";
import { callGeminiWithRetry, getGeminiClient } from "../../src/gemini_service";
import { localHeuristicAnalysis } from "../../src/heuristic_service";

export async function analyzeResume(req: Request, res: Response) {
  try {
    const {
      act_name,
      act_mail,
      act_mob,
      fileBase64,
      fileType,
      rawText,
      fileName,
      owner_email,
      selected_field
    } = req.body || {};

    let extractedText = "";

    // 1. If raw text provided directly
    if (rawText && typeof rawText === "string" && rawText.trim().length > 0) {
      extractedText = rawText.trim();
    }

    // 2. If fileBase64 provided (uploaded file)
    if ((!extractedText || extractedText.length < 10) && fileBase64) {
      try {
        const cleanBase64 = fileBase64.includes(",") ? fileBase64.split(",")[1] : fileBase64;
        const fileBuffer = Buffer.from(cleanBase64, "base64");
        const lowerType = (fileType || "").toLowerCase();
        const lowerName = (fileName || "").toLowerCase();

        const isPdf = lowerType.includes("pdf") || lowerName.endsWith(".pdf") || fileBuffer.slice(0, 5).toString().includes("%PDF");
        const isDocx = lowerType.includes("word") || lowerType.includes("officedocument") || lowerName.endsWith(".docx") || lowerName.endsWith(".doc");

        if (isPdf) {
          try {
            const parser = new PDFParse({ data: fileBuffer });
            const parsed = await parser.getText();
            extractedText = parsed.text ? parsed.text.trim() : "";
          } catch (pdfErr) {
            console.warn("PDF extraction fallback:", pdfErr);
          }
        } else if (isDocx) {
          try {
            const docxRes = await mammoth.extractRawText({ buffer: fileBuffer });
            extractedText = docxRes.value ? docxRes.value.trim() : "";
          } catch (docxErr) {
            console.warn("DOCX extraction fallback:", docxErr);
          }
        }

        // Fallback text extraction from buffer
        if (!extractedText || extractedText.length < 5) {
          const rawBufferText = fileBuffer.toString("utf-8");
          const cleanText = rawBufferText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, " ").trim();
          if (cleanText.length > 20) {
            extractedText = cleanText;
          }
        }
      } catch (fileParseErr) {
        console.warn("Error processing file buffer:", fileParseErr);
      }
    }

    // 3. Perform Analysis
    const targetField = selected_field || "Software Development";
    let analysisData: any = null;

    if (process.env.GEMINI_API_KEY && extractedText && extractedText.length > 20) {
      try {
        const systemInstruction = `You are a world-class ATS Resume Evaluator and Career Advisor specializing in tech talent matching. Analyze the resume provided against industry benchmarks and the target field "${targetField}". Output valid JSON conforming to the schema with comprehensive analysis, score factors (boolean flags for each section), constructive feedback items (with factor name, status "added" or "missing", and detailed suggestions), ATS compatibility score (0-100), overall resume score (0-100), predicted field, candidate experience level (Fresher, Intermediate, Experienced), current skills found, recommended skills, recommended learning courses with title and real course links (e.g., Coursera, Udemy, edX), strengths, weaknesses, suggested projects, suggested certifications, suggested keywords, and career growth roadmap.`;

        const userPrompt = `Candidate Name: ${act_name || "Extract from resume text"}
Candidate Email: ${act_mail || "Extract from resume text"}
Candidate Phone: ${act_mob || "Extract from resume text"}
Target/Selected Field: ${targetField}

Resume Content:
${extractedText.slice(0, 15000)}`;

        const geminiRes = await callGeminiWithRetry([userPrompt], systemInstruction, 2, 600);
        if (geminiRes && geminiRes.text) {
          let cleanJson = geminiRes.text.trim();
          if (cleanJson.startsWith("```")) {
            cleanJson = cleanJson.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
          }
          analysisData = JSON.parse(cleanJson);
        }
      } catch (geminiErr) {
        console.warn("Gemini ATS evaluation fallback to local engine:", (geminiErr as any)?.message || geminiErr);
      }
    }

    // If Gemini didn't run or failed, use local heuristic parser
    if (!analysisData) {
      analysisData = localHeuristicAnalysis(
        extractedText || `Candidate Name: ${act_name}\nTarget Field: ${targetField}`,
        fileName || "Resume.pdf",
        act_name || "Candidate",
        act_mail || (owner_email || "candidate@example.com"),
        act_mob || "+1-555-0199"
      );
      if (selected_field && selected_field !== "Other") {
        analysisData.predicted_field = selected_field;
      }
    }

    // Normalize and ensure all fields are properly structured
    if (!analysisData.name || analysisData.name.trim().length === 0) {
      analysisData.name = act_name || "Applicant Candidate";
    }
    if (!analysisData.email || analysisData.email.trim().length === 0) {
      analysisData.email = act_mail || owner_email || "candidate@example.com";
    }
    if (!analysisData.phone || analysisData.phone.trim().length === 0) {
      analysisData.phone = act_mob || "+1 (555) 019-2834";
    }

    // 4. Save record into database
    const recordPayload = {
      owner_email: owner_email ? owner_email.toLowerCase().trim() : null,
      name: analysisData.name,
      email: analysisData.email,
      resume_score: String(analysisData.resume_score || 75),
      timestamp: new Date().toISOString(),
      reco_field: selected_field || analysisData.predicted_field || "Tech",
      cand_level: analysisData.cand_level || "Fresher",
      skills: analysisData.current_skills || [],
      recommended_skills: analysisData.recommended_skills || [],
      courses: analysisData.recommended_courses || [],
      pdf_name: fileName || (rawText ? "Pasted_Text_Resume.txt" : "Resume.pdf"),
      pdf_url: null,
      data_json: {
        scoring: {
          overallScore: analysisData.resume_score,
          atsScore: analysisData.ats_compatibility_score || analysisData.resume_score
        },
        ...analysisData
      }
    };

    const savedRecord = insertUser(recordPayload);

    insertAdminAuditLog({
      admin_email: owner_email || "system@cvoptimizer.com",
      action: "RESUME_ANALYZED",
      target_resource: `CV: ${recordPayload.pdf_name} (#${savedRecord.id})`,
      result: "SUCCESS"
    });

    return res.json({
      success: true,
      data: analysisData,
      record: savedRecord
    });
  } catch (err: any) {
    console.error("Error during ATS analysis:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Failed to process resume for ATS evaluation."
    });
  }
}

export async function generateCoverLetter(req: Request, res: Response) {
  try {
    const { jobTitle, companyName, hiringManager, keySkills, tone } = req.body || {};

    const prompt = `Write an exceptional, highly compelling, tailored cover letter for:
Position: ${jobTitle || 'Software Engineer'}
Company: ${companyName || 'Target Company'}
Hiring Manager: ${hiringManager || 'Hiring Manager'}
Key Skills / Qualifications: ${keySkills || 'Technical Problem Solving, Full-Stack Development'}
Tone: ${tone || 'professional'}

Provide ONLY the cover letter text ready to send.`;

    if (process.env.GEMINI_API_KEY) {
      try {
        const client = getGeminiClient();
        const response = await client.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt
        });
        if (response && response.text) {
          return res.json({ success: true, letter: response.text.trim() });
        }
      } catch (gemErr) {
        console.warn("Cover letter Gemini generation fallback:", gemErr);
      }
    }

    const fallbackLetter = `Dear ${hiringManager || 'Hiring Team'} at ${companyName || 'your company'},

I am writing to express my strong enthusiasm for the ${jobTitle || 'open role'} position. With core expertise spanning ${keySkills || 'modern software engineering, technical execution, and collaborative development'}, I am confident in my ability to immediately contribute to your team's success.

Throughout my career, I have focused on delivering high-impact solutions, improving reliability, and driving technical excellence. At ${companyName || 'your organization'}, I am particularly excited by your mission and engineering standards.

I welcome the opportunity to discuss how my experience aligns with your team's upcoming initiatives. Thank you for your time and consideration.

Sincerely,
Candidate`;

    return res.json({ success: true, letter: fallbackLetter });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Error generating cover letter." });
  }
}

export async function getRecords(req: Request, res: Response) {
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
}

export async function deleteRecord(req: Request, res: Response) {
  try {
    const recordId = parseInt(req.params.recordId, 10);
    const email = req.query.email as string;
    const ownerEmail = email ? email.toLowerCase().trim() : null;

    if (isNaN(recordId)) {
      return res.status(400).json({ error: "Invalid record ID" });
    }

    const deleted = deleteUserRecord(recordId, ownerEmail);
    if (deleted) {
      insertSecurityEvent({
        event_type: "CV_RECORD_DELETED",
        severity: "LOW",
        description: `CV Record #${recordId} deleted by ${ownerEmail || 'user'}`,
        email: ownerEmail || undefined
      });
      return res.json({ success: true, message: "Record successfully deleted from database." });
    }
    return res.status(404).json({ error: "Record not found or unauthorized deletion." });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
}
