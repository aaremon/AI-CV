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
    },
    ats_compatibility_score: { type: Type.INTEGER, description: "ATS compatibility score out of 100" },
    missing_skills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of missing skills for the selected field"
    },
    experience_relevance: { type: Type.STRING, description: "Experience relevance analysis for the selected field" },
    education_relevance: { type: Type.STRING, description: "Education relevance for the selected field" },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of candidate's strengths"
    },
    weaknesses: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of candidate's weaknesses/gaps"
    },
    industry_specific_recommendations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of industry-specific recommendations for the selected field"
    },
    suggested_certifications: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Suggested professional certifications"
    },
    suggested_projects: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Suggested projects for portfolio improvement"
    },
    suggested_keywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Suggested keywords for ATS optimization"
    },
    interview_readiness: { type: Type.STRING, description: "Interview readiness assessment details" },
    career_growth_suggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Career growth and development roadmaps"
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
    "recommended_courses",
    "ats_compatibility_score",
    "missing_skills",
    "experience_relevance",
    "education_relevance",
    "strengths",
    "weaknesses",
    "industry_specific_recommendations",
    "suggested_certifications",
    "suggested_projects",
    "suggested_keywords",
    "interview_readiness",
    "career_growth_suggestions"
  ]
};

export const RESILIENT_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.7-flash",
  "gemini-3.1-flash-lite",
  "gemini-flash-latest",
  "gemini-3.8-flash"
];

export async function callGeminiWithRetry(
  contents: any[],
  systemInstruction: string,
  maxRetries = 2,
  baseDelayMs = 800
): Promise<any> {
  const client = getGeminiClient();
  const models = RESILIENT_MODELS;
  let lastError: any = null;

  for (const model of models) {
    let attempt = 0;
    while (attempt <= maxRetries) {
      try {
        const response = await client.models.generateContent({
          model: model,
          contents: contents,
          config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: RESUME_RESPONSE_SCHEMA,
            temperature: 0.1
          }
        });
        return response;
      } catch (e: any) {
        attempt++;
        lastError = e;
        const errMsg = (e.message || String(e)).toUpperCase();

        const isQuotaExceeded = errMsg.includes("429") || 
                                errMsg.includes("RESOURCE_EXHAUSTED") || 
                                errMsg.includes("QUOTA_EXCEEDED");

        const isRetryable = errMsg.includes("503") || 
                            errMsg.includes("UNAVAILABLE") || 
                            errMsg.includes("HIGH DEMAND") || 
                            errMsg.includes("TEMPORARY") || 
                            errMsg.includes("502") || 
                            errMsg.includes("504") || 
                            errMsg.includes("OVERLOADED") ||
                            isQuotaExceeded;

        if (isRetryable && attempt <= maxRetries) {
          const delay = baseDelayMs * Math.pow(2, attempt - 1) + Math.random() * 300;
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        break; // break to try next model in loop
      }
    }
  }

  throw lastError || new Error("All Gemini model attempts failed.");
}

export async function generateTextWithRetry(
  prompt: string,
  candidateModels: string[] = RESILIENT_MODELS
): Promise<string> {
  const client = getGeminiClient();
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const response = await client.models.generateContent({
        model: model,
        contents: prompt
      });
      if (response && response.text) {
        return response.text.trim();
      }
    } catch (e: any) {
      lastError = e;
      // Continue to next available resilient model
    }
  }

  throw lastError || new Error("All candidate text models failed.");
}
