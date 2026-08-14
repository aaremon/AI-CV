export interface FeatureDataPolicy {
  allowedFields: string[];
  stripPii: boolean;
  replaceWithPlaceholders: boolean;
  allowName?: boolean;
  allowCompany?: boolean;
  allowJobTitle?: boolean;
}

export const aiDataPolicy: Record<string, FeatureDataPolicy> = {
  atsAnalysis: {
    allowedFields: [
      "targetRole",
      "selectedField",
      "skills",
      "experience",
      "education",
      "projects",
      "certifications",
      "jobDescription",
      "rawTextToAnalyze"
    ],
    stripPii: true,
    replaceWithPlaceholders: true,
    allowName: false,
    allowCompany: true,
    allowJobTitle: true
  },

  bulletEnhancement: {
    allowedFields: [
      "jobTitle",
      "companyContext",
      "bulletPoint",
      "skills",
      "achievementContext"
    ],
    stripPii: true,
    replaceWithPlaceholders: true,
    allowName: false,
    allowCompany: true,
    allowJobTitle: true
  },

  coverLetter: {
    allowedFields: [
      "jobTitle",
      "companyName",
      "hiringManager",
      "keySkills",
      "tone",
      "professionalSummary",
      "candidateName"
    ],
    stripPii: true,
    replaceWithPlaceholders: true,
    allowName: true,
    allowCompany: true,
    allowJobTitle: true
  },

  linkedinOptimizer: {
    allowedFields: [
      "professionalSummary",
      "experience",
      "skills",
      "projects",
      "careerLevel",
      "targetRole"
    ],
    stripPii: true,
    replaceWithPlaceholders: true,
    allowName: false,
    allowCompany: true,
    allowJobTitle: true
  },

  grammarChecker: {
    allowedFields: [
      "text"
    ],
    stripPii: true,
    replaceWithPlaceholders: true,
    allowName: false,
    allowCompany: true,
    allowJobTitle: true
  },

  summaryGenerator: {
    allowedFields: [
      "experience",
      "skills",
      "education",
      "projects",
      "careerLevel",
      "targetRole"
    ],
    stripPii: true,
    replaceWithPlaceholders: true,
    allowName: false,
    allowCompany: true,
    allowJobTitle: true
  },

  bioGenerator: {
    allowedFields: [
      "role",
      "yearsExperience",
      "keySkills",
      "achievements"
    ],
    stripPii: true,
    replaceWithPlaceholders: true,
    allowName: false,
    allowCompany: true,
    allowJobTitle: true
  },

  outreachEmails: {
    allowedFields: [
      "recipientRole",
      "companyName",
      "targetRole",
      "valueProposition",
      "tone"
    ],
    stripPii: true,
    replaceWithPlaceholders: true,
    allowName: false,
    allowCompany: true,
    allowJobTitle: true
  }
};
