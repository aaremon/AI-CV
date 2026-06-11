import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}

export const RESUME_RESPONSE_SCHEMA = {
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
    resume_score: { type: Type.INTEGER, description: "Overall Resume score out of 100 based on standard content checklist" },
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
        "has_objective",
        "has_education",
        "has_experience",
        "has_internship",
        "has_skills",
        "has_hobbies",
        "has_interests",
        "has_achievements",
        "has_certifications",
        "has_projects"
      ]
    },
    feedback: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          factor: { type: Type.STRING, description: "The name of the checked item" },
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
          title: { type: Type.STRING, description: "Custom realistic certification course title" },
          link: { type: Type.STRING, description: "Learning link" }
        },
        required: ["title", "link"]
      }
    }
  },
  required: [
    "name",
    "email",
    "phone",
    "degree",
    "no_of_pages",
    "cand_level",
    "predicted_field",
    "current_skills",
    "recommended_skills",
    "resume_score",
    "score_factors",
    "feedback",
    "recommended_courses"
  ]
};

export async function callGeminiWithRetry(
  contents: any[],
  systemInstruction: string,
  maxRetries = 2,
  baseDelayMs = 1000
): Promise<any> {
  const client = getGeminiClient();
  let attempt = 0;
  const currentModel = "gemini-3.5-flash";

  while (true) {
    try {
      // Set thinking level to LOW and temperature to 0.0 to optimize speed
      const response = await client.models.generateContent({
        model: currentModel,
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          responseSchema: RESUME_RESPONSE_SCHEMA,
          temperature: 0.0,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
        }
      });
      return response;
    } catch (e: any) {
      attempt++;
      const errMsg = (e.message || String(e)).toUpperCase();

      // Check for quota or rate limit violations
      const isQuotaExceeded = errMsg.includes("429") || 
                              errMsg.includes("RESOURCE_EXHAUSTED") || 
                              errMsg.includes("QUOTA EXCEEDED") || 
                              errMsg.includes("QUOTA_EXCEEDED");
      if (isQuotaExceeded) {
        console.warn("[Gemini API TS] Quota limit exceeded. Faltering immediately.");
        throw e;
      }

      const isRetryable = errMsg.includes("503") || 
                          errMsg.includes("UNAVAILABLE") || 
                          errMsg.includes("HIGH DEMAND") || 
                          errMsg.includes("TEMPORARY") || 
                          errMsg.includes("502") || 
                          errMsg.includes("504") || 
                          errMsg.includes("OVERLOADED");

      if (isRetryable && attempt <= maxRetries) {
        const delay = baseDelayMs * Math.pow(2, attempt - 1) + Math.random() * 500;
        console.log(`[Gemini API TS] Retryable error (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      throw e;
    }
  }
}
