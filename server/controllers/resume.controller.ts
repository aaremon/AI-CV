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
            const parser = new PDFParse({ data: new Uint8Array(fileBuffer) });
            const parsed = await parser.getText();
            extractedText = parsed.text ? parsed.text.trim() : "";
            await parser.destroy();
          } catch (pdfErr) {
            console.warn("PDF extraction fallback with Uint8Array:", pdfErr);
          }
        } else if (isDocx) {
          try {
            const docxRes = await mammoth.extractRawText({ buffer: fileBuffer });
            extractedText = docxRes.value ? docxRes.value.trim() : "";
          } catch (docxErr) {
            console.warn("DOCX extraction fallback:", docxErr);
          }
        }

        // Fallback text extraction from buffer (extracting printable text streams)
        if (!extractedText || extractedText.length < 5) {
          const rawBufferText = fileBuffer.toString("utf-8");
          const cleanText = rawBufferText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, " ").replace(/\s+/g, " ").trim();
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

    console.log(`[ATS Server] Analyzing resume: length=${extractedText.length} chars, candidate=${act_name || 'N/A'}, field=${targetField}, hasGeminiKey=${Boolean(process.env.GEMINI_API_KEY)}`);

    if (process.env.GEMINI_API_KEY && extractedText && extractedText.length > 20) {
      try {
        const systemInstruction = `You are a world-class ATS Resume Evaluator and Career Advisor specializing in talent matching. Analyze the resume provided against industry benchmarks and the target field "${targetField}". Output valid JSON conforming to the schema with comprehensive analysis, score factors (boolean flags for each section), constructive feedback items (with factor name, status "added" or "missing", and detailed suggestions), ATS compatibility score (0-100), overall resume score (0-100), predicted field, candidate experience level (Fresher, Intermediate, Experienced), current skills found, recommended skills, recommended learning courses with title and real course links (e.g., Coursera, Udemy, edX), strengths, weaknesses, suggested projects, suggested certifications, suggested keywords, and career growth roadmap.`;

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

    // If Gemini didn't run or failed, use local multi-domain heuristic parser
    if (!analysisData) {
      analysisData = localHeuristicAnalysis(
        extractedText || `Candidate Name: ${act_name}\nTarget Field: ${targetField}`,
        fileName || "Resume.pdf",
        act_name || "Candidate",
        act_mail || (owner_email || "candidate@example.com"),
        act_mob || "+1-555-0199",
        targetField
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
          model: "gemini-3.7-flash",
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

export async function optimizeLinkedInProfile(req: Request, res: Response) {
  try {
    const {
      roleTitle,
      seniority,
      industry,
      templateStyle,
      tone,
      skills,
      achievements,
      currentCompany,
      location,
      openToWork,
      candidateName,
      rawResumeText,
      fileBase64,
      fileType,
      fileName
    } = req.body || {};

    let extractedResumeText = rawResumeText || "";

    // If a CV file is uploaded directly to LinkedIn optimizer
    if ((!extractedResumeText || extractedResumeText.length < 10) && fileBase64) {
      try {
        const cleanBase64 = fileBase64.includes(",") ? fileBase64.split(",")[1] : fileBase64;
        const fileBuffer = Buffer.from(cleanBase64, "base64");
        const lowerType = (fileType || "").toLowerCase();
        const lowerName = (fileName || "").toLowerCase();

        const isPdf = lowerType.includes("pdf") || lowerName.endsWith(".pdf") || fileBuffer.slice(0, 5).toString().includes("%PDF");
        const isDocx = lowerType.includes("word") || lowerType.includes("officedocument") || lowerName.endsWith(".docx") || lowerName.endsWith(".doc");

        if (isPdf) {
          try {
            const parser = new PDFParse({ data: new Uint8Array(fileBuffer) });
            const parsed = await parser.getText();
            extractedResumeText = parsed.text ? parsed.text.trim() : "";
            await parser.destroy();
          } catch (pdfErr) {
            console.warn("LinkedIn CV PDF extraction fallback:", pdfErr);
          }
        } else if (isDocx) {
          try {
            const docxRes = await mammoth.extractRawText({ buffer: fileBuffer });
            extractedResumeText = docxRes.value ? docxRes.value.trim() : "";
          } catch (docxErr) {
            console.warn("LinkedIn CV DOCX extraction fallback:", docxErr);
          }
        }

        if (!extractedResumeText || extractedResumeText.length < 5) {
          const rawBufferText = fileBuffer.toString("utf-8");
          const cleanText = rawBufferText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, " ").trim();
          if (cleanText.length > 20) {
            extractedResumeText = cleanText;
          }
        }
      } catch (fileErr) {
        console.warn("File decoding error in LinkedIn optimizer:", fileErr);
      }
    }

    const name = candidateName || "Candidate";
    const role = roleTitle || "Senior Full Stack Engineer";
    const skillList = Array.isArray(skills) && skills.length > 0 ? skills.join(", ") : (skills || "React, TypeScript, Node.js, Cloud Architecture");
    const style = templateStyle || "technical_leader";
    const toneChoice = tone || "authoritative";
    const level = seniority || "Senior";
    const sector = industry || "Technology / SaaS";
    const company = currentCompany || "TechCorp";
    const feats = achievements || "Scaled systems, improved performance, and delivered high-impact products";

    let result: any = null;

    if (process.env.GEMINI_API_KEY) {
      try {
        const client = getGeminiClient();
        const prompt = `You are an elite Executive LinkedIn Strategist and Recruiter Branding Expert.
The candidate wants to shape and optimize their LinkedIn profile directly from their CV / Resume.

Candidate Info (if provided):
- Provided Name: ${name}
- Provided Role / Title: ${role}
- Seniority: ${level}
- Industry: ${sector}
- Current/Target Company: ${company}
- Known Skills: ${skillList}
- Known Achievements: ${feats}
- Open to Work: ${openToWork ? "Yes" : "No"}
- Location: ${location || "San Francisco Bay Area (Open to Remote)"}

${extractedResumeText ? `CV / Resume Content (Extract candidate name, target role, company, top skills, and major quantifiable achievements from this text to personalize the entire output):\n${extractedResumeText.slice(0, 5000)}` : ""}

Task:
1. Extract or deduce the candidate's actual name, target role title, seniority, primary industry, most recent/prominent company, location, and core skills from the CV if present.
2. Generate a comprehensive, high-converting LinkedIn profile package and strategic CV-to-LinkedIn transformation guide.

Return valid JSON ONLY matching this exact structure:
{
  "extractedProfile": {
    "candidateName": "Extracted full name or best match",
    "roleTitle": "Extracted or target role title",
    "seniority": "Entry-Level, Mid-Level, Senior, Staff/Principal, or Lead",
    "industry": "Industry or Tech sector",
    "currentCompany": "Company name or target company",
    "location": "Location or Remote preference",
    "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6", "Skill 7", "Skill 8"]
  },
  "headlines": [
    {
      "label": "Keyword & Recruiter Search",
      "text": "Target Title | Skill 1 • Skill 2 • Skill 3 | Core Specialization",
      "charCount": 0
    },
    {
      "label": "Value Proposition & Business Impact",
      "text": "Target Title @ Company | Scaling Systems & Quantifiable Impact",
      "charCount": 0
    },
    {
      "label": "Technical Authority & Scale",
      "text": "Seniority Role | Architectural Scale | Key Differentiator",
      "charCount": 0
    },
    {
      "label": "Modern Minimalist",
      "text": "Clean punchy 1-line headline",
      "charCount": 0
    }
  ],
  "about": "Full LinkedIn About section with a high-retention opening hook, career story narrative, bulleted quantifiable accomplishments from their CV, technology clusters, and clear call-to-action.",
  "experienceBullets": [
    "High-impact STAR/XYZ bullet 1 with quantifiable results adapted for LinkedIn",
    "High-impact STAR/XYZ bullet 2 with quantifiable results adapted for LinkedIn",
    "High-impact STAR/XYZ bullet 3 with quantifiable results adapted for LinkedIn",
    "High-impact STAR/XYZ bullet 4 with quantifiable results adapted for LinkedIn"
  ],
  "featuredSkills": {
    "core": ["Top Skill 1", "Top Skill 2", "Top Skill 3", "Top Skill 4", "Top Skill 5"],
    "toolsAndCloud": ["Tool 1", "Tool 2", "Tool 3", "Tool 4"],
    "leadershipAndDomain": ["Leadership 1", "Domain 2", "Methodology 3"]
  },
  "networkingNotes": {
    "connectionRequest": "Under 300 character polite, high-converting connection request note.",
    "recruiterReply": "Polite, professional response template to a recruiter InMail."
  },
  "seoScore": 94,
  "seoTips": [
    "Tip 1 for recruiter visibility based on CV keywords",
    "Tip 2 for algorithmic ranking",
    "Tip 3 for engagement"
  ],
  "cvToLinkedInBlueprint": {
    "transformationStrategy": "Strategic summary explaining how to transform the formal CV into an engaging LinkedIn presence.",
    "whatToWriteGuidance": {
      "headlineGuide": "Actionable instructions on how to write their headline using their CV title + top 3 skills + metric.",
      "aboutGuide": "Breakdown of the 4-part LinkedIn summary formula (Hook, Story, CV Metric Highlights, Call to Action).",
      "experienceGuide": "How to convert dense CV bullets into readable, narrative LinkedIn experience entries with context.",
      "featuredGuide": "Specific suggestions on what items from the CV to pin to the LinkedIn Featured section (projects, repos, certs)."
    },
    "stepByStepChecklist": [
      {
        "step": "1. Update Headline & Open-to-Work",
        "action": "Set the optimized headline and configure Open to Work settings.",
        "why": "First 80 characters drive 70% of recruiter search clicks."
      },
      {
        "step": "2. Publish the Storyteller 'About' Section",
        "action": "Paste the crafted About summary with clean emoji formatting.",
        "why": "Transforms cold CV credentials into personal branding."
      },
      {
        "step": "3. Upgrade Work Experience Entries",
        "action": "Add quantifiable STAR bullets and link company pages.",
        "why": "Provides immediate proof of execution and impact."
      },
      {
        "step": "4. Pin Top 5 Skills & Featured Media",
        "action": "Reorder skills so the top 3 match target job postings.",
        "why": "Directly influences LinkedIn Recruiter boolean score."
      },
      {
        "step": "5. Request 2 Recommendations",
        "action": "Reach out to past managers or colleagues using the provided templates.",
        "why": "Provides unmatched social proof that resumes cannot offer."
      }
    ],
    "recommendationRequestTemplate": "Hi [Manager Name], I loved working together on [Project from CV]. As I update my LinkedIn, would you be open to writing a short 2-3 sentence recommendation highlighting [Key Skill]?"
  }
}`;

        const response = await client.models.generateContent({
          model: "gemini-3.7-flash",
          contents: prompt
        });

        if (response && response.text) {
          let cleanJson = response.text.trim();
          if (cleanJson.startsWith("```")) {
            cleanJson = cleanJson.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
          }
          result = JSON.parse(cleanJson);
        }
      } catch (gemErr) {
        console.warn("LinkedIn Gemini optimization fallback to heuristic template:", gemErr);
      }
    }

    if (!result) {
      // High-quality dynamic heuristic fallback based on template archetype and CV info
      const headline1 = `${role} | ${skillList.split(",").slice(0, 3).map((s: string) => s.trim()).join(" • ")} | ${level}`;
      const headline2 = `${role} @ ${company} | Helping ${sector} Scale Digital Architecture & User Impact`;
      const headline3 = `${level} ${role} | Building Resilient Systems | ${feats.slice(0, 55)}`;
      const headline4 = `${role} • Problem Solver • ${skillList.split(",")[0] || "Software Architecture"}`;

      let aboutNarrative = "";
      if (style === "0_to_1_builder") {
        aboutNarrative = `🚀 I turn complex technical challenges into scalable, high-velocity digital products.

As a ${level} ${role} with deep expertise in ${skillList}, I specialize in zero-to-one engineering, architectural resilience, and rapid product iterations across ${sector}.

⚡ CORE EXPERTISE & IMPACT (From CV):
• Architecture & Execution: Led end-to-end technical delivery for mission-critical applications.
• Measurable Delivery: ${feats}.
• Cross-Functional Leadership: Partnering closely with Product, Design, and DevOps to ship high-standard user experiences.

🛠️ TECHNICAL ARSENAL:
• Primary Languages & Frameworks: ${skillList}
• Architecture & Cloud: Distributed Systems, REST/GraphQL APIs, CI/CD, Cloud Infrastructure
• Focus Areas: System Performance, Reliability, Clean Code & Developer Velocity

📫 Let's connect! Whether discussing new engineering opportunities, architecture paradigms, or exciting tech collaborations, feel free to reach out or connect directly.`;
      } else if (style === "recruiter_seo") {
        aboutNarrative = `Results-oriented ${level} ${role} specializing in ${sector} software engineering, technical optimization, and scalable distributed systems.

🔍 SPECIALIZATIONS & KEYWORDS:
• Hard Skills: ${skillList}
• Domain Expertise: ${sector}, System Design, Cloud Deployments, Microservices
• Track Record: ${feats}

💼 PROFESSIONAL PHILOSOPHY:
I focus on building maintainable, high-throughput software that solves real user problems. Having worked across diverse technical stacks, I bring a structured approach to technical execution, automated testing, and team collaboration.

🎯 CURRENT FOCUS:
Exploring high-impact technical initiatives, architecture challenges, and engineering leadership opportunities. Connect with me on LinkedIn or send a message to discuss potential collaborations!`;
      } else {
        aboutNarrative = `👋 Hello! I am a ${level} ${role} passionate about architecting scalable, resilient digital solutions that drive measurable business outcomes.

Over the course of my career in ${sector}, I have focused on modernizing technical stacks, accelerating feature delivery, and mentoring engineering peers.

✨ KEY HIGHLIGHTS:
• Technical Leadership: Designed robust distributed architectures using ${skillList}.
• Proven Impact: ${feats}.
• Engineering Standards: Advocating for test automation, observability, and seamless user experiences.

💻 TECH STACK & COMPETENCIES:
• Technologies: ${skillList}
• Best Practices: Microservices, Agile/Scrum, API Design, Scalable Cloud Infrastructure

📩 Open to networking, tech exchange, and exciting engineering opportunities. Let's build something remarkable together!`;
      }

      result = {
        headlines: [
          { label: "Keyword & Search Optimized", text: headline1, charCount: headline1.length },
          { label: "Value Proposition & Impact", text: headline2, charCount: headline2.length },
          { label: "Authority & Scale", text: headline3, charCount: headline3.length },
          { label: "Modern Minimalist", text: headline4, charCount: headline4.length }
        ],
        about: aboutNarrative,
        experienceBullets: [
          `Architected and deployed scalable systems utilizing ${skillList.split(",").slice(0, 2).join(" & ")}, directly driving ${feats}.`,
          `Spearheaded the refactoring of critical service bottlenecks, improving response times by over 35% and enhancing system availability.`,
          `Collaborated with cross-functional product teams to design robust APIs and frontend workflows that streamlined user adoption.`,
          `Introduced modern CI/CD pipelines, automated testing suites, and observability dashboards to maintain high code quality.`
        ],
        featuredSkills: {
          core: skillList.split(",").map((s: string) => s.trim()).filter(Boolean).slice(0, 5),
          toolsAndCloud: ["Git & GitHub", "Docker / Containers", "CI/CD Pipelines", "Cloud Services (AWS/GCP)", "PostgreSQL / NoSQL"],
          leadershipAndDomain: ["System Architecture", "Agile & Scrum", "Code Reviews", "Cross-Functional Collaboration"]
        },
        networkingNotes: {
          connectionRequest: `Hi [Name], I noticed your work in ${sector} and wanted to connect! As a ${role} working with ${skillList.split(",")[0] || "modern tech"}, I'd love to follow your team's journey.`,
          recruiterReply: `Hi [Recruiter Name], thank you for reaching out regarding the ${role} opportunity. I am excited by your team's mission. I'd love to learn more about the technical stack and upcoming challenges. Feel free to share the JD!`
        },
        seoScore: 92,
        seoTips: [
          "Include high-frequency keywords like your primary tech stack in the first 80 characters of your headline for mobile recruiter views.",
          "Keep your LinkedIn About section structured with clear section emojis and bullet points to maximize recruiter read-through rate.",
          "Ensure your top 5 featured skills match the exact terminology used in LinkedIn job postings for your target role."
        ],
        cvToLinkedInBlueprint: {
          transformationStrategy: `A CV is a formal retrospective document written in concise 3rd-person bullets. LinkedIn is an interactive, searchable digital portfolio written in engaging 1st-person. Your goal after uploading your CV is not to copy-paste it verbatim, but to expand the narrative, highlight your engineering philosophy, and add social proof.`,
          whatToWriteGuidance: {
            headlineGuide: `Combine your target job title (${role}) + your primary stack (${skillList.split(',').slice(0, 3).join(', ')}) + your biggest metric (${feats.slice(0, 40)}). Avoid vague taglines like 'Aspiring Engineer' or 'Seeking Roles'.`,
            aboutGuide: `Structure your summary into 4 distinct blocks: 1) Hook (Who you are & what you build), 2) Career Story (Why you care about ${sector}), 3) Concrete CV Wins (Bullet points with numbers), and 4) Call to Action (How to reach you).`,
            experienceGuide: `For each role from your CV, write 1 summary paragraph explaining team context and tech architecture, followed by 3-4 XYZ accomplishment bullets (Accomplished [X] as measured by [Y] by doing [Z]).`,
            featuredGuide: `Pin 2-3 links directly connected to your CV: GitHub repositories, live demo URLs, architecture diagrams, certifications, or major company announcements.`
          },
          stepByStepChecklist: [
            {
              step: "1. Update Headline & Open-to-Work",
              action: `Apply the '${headline1}' headline and toggle Open-to-Work visibility to Recruiters Only or Public.`,
              why: "Recruiter algorithms rank profiles based on the exact match of job title + top 3 skill keywords in the headline."
            },
            {
              step: "2. Publish the Storyteller 'About' Section",
              action: "Paste your generated summary with bullet dividers and clear contact links.",
              why: "Mobile LinkedIn truncates after 3 lines — hook the recruiter before they scroll away."
            },
            {
              step: "3. Upgrade Experience with STAR Bullets",
              action: "Update your latest positions with quantifiable impact bullets from your CV analysis.",
              why: "Proves real-world execution capacity rather than just listing job duties."
            },
            {
              step: "4. Pin Top 5 Skills & Featured Media",
              action: "Add your core tech skills and pin your portfolio projects to the Featured ribbon.",
              why: "Recruiters use Skill filters as hard pass/fail criteria when searching candidates."
            },
            {
              step: "5. Request 2 Recommendations",
              action: "Send the tailored message to past managers or senior teammates from previous companies.",
              why: "Endorsements and written recommendations boost profile credibility by over 300%."
            }
          ],
          recommendationRequestTemplate: `Hi [Manager Name], I really enjoyed working together on ${company} projects. I'm currently refreshing my LinkedIn profile to highlight my contributions in ${skillList.split(',')[0] || 'software development'}. Would you be willing to write a brief 2-3 sentence recommendation about our collaboration?`
        }
      };
    }

    return res.json({ success: true, data: result, extractedResumeText: extractedResumeText.slice(0, 300) });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Error generating LinkedIn optimization package." });
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
