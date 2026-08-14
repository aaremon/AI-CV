import { aiDataPolicy, FeatureDataPolicy } from "../config/aiDataPolicy";

export interface SanitizationResult {
  sanitizedPayload: any;
  sanitizedText: string;
  piiDetected: boolean;
  removedCategories: string[];
}

export class PiiSanitizationService {
  private static EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
  private static PHONE_REGEX = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}\b/g;
  private static DOB_REGEX = /(?:DOB|Date of Birth|Birth Date|Born|b\.)\s*[:.-]?\s*(?:\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4}|\d{4}[\/\.-]\d{1,2}[\/\.-]\d{1,2}|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4}\b)/gi;
  private static GOVT_ID_REGEX = /(?:Citizenship|Passport|National ID|SSN|Social Security|Tax ID|PAN|Driver'?s License|Govt ID|ID No\.?)\s*[:.-]?\s*([A-Za-z0-9\-]{5,20})/gi;
  private static GENDER_AGE_REGEX = /(?:Gender|Sex|Age)\s*[:.-]?\s*(?:Male|Female|Non-binary|Transgender|Other|\d{1,2}\s*years?\b)/gi;
  private static ADDRESS_REGEX = /(?:Address|Location|Residence|Living in)\s*[:.-]?\s*([^\n,]+(?:,[^\n,]+){1,3})/gi;
  private static NON_LINKEDIN_SOCIAL_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:facebook|instagram|twitter|tiktok|pinterest|github)\.com\/[A-Za-z0-9_.-]+/gi;

  /**
   * Main entry point for feature-aware PII sanitization
   */
  public static createPayload(data: Record<string, any>, feature: string): SanitizationResult {
    const policy = aiDataPolicy[feature] || {
      allowedFields: Object.keys(data),
      stripPii: true,
      replaceWithPlaceholders: true
    };

    const removedCategoriesSet = new Set<string>();
    let piiDetected = false;

    // Step 1: Filter fields strictly allowed by policy
    const filteredData: Record<string, any> = {};
    for (const key of Object.keys(data)) {
      if (policy.allowedFields.includes(key)) {
        filteredData[key] = data[key];
      } else {
        // Track category if pruned
        if (["act_mail", "email", "act_mob", "phone", "act_name", "name", "location", "dob", "gender", "citizenship"].includes(key.toLowerCase())) {
          piiDetected = true;
          removedCategoriesSet.add(key.toLowerCase().replace("act_", ""));
        }
      }
    }

    // Step 2: Recursively sanitize values in filtered fields
    const sanitizedObj = this.sanitizeValue(filteredData, feature, policy, removedCategoriesSet);

    // Step 3: If there's rawTextToAnalyze or text string, sanitize it directly
    let sanitizedText = "";
    if (typeof sanitizedObj === "string") {
      sanitizedText = sanitizedObj;
    } else if (sanitizedObj.rawTextToAnalyze) {
      sanitizedText = String(sanitizedObj.rawTextToAnalyze);
    } else if (sanitizedObj.text) {
      sanitizedText = String(sanitizedObj.text);
    } else {
      sanitizedText = JSON.stringify(sanitizedObj);
    }

    if (removedCategoriesSet.size > 0) {
      piiDetected = true;
    }

    return {
      sanitizedPayload: sanitizedObj,
      sanitizedText,
      piiDetected,
      removedCategories: Array.from(removedCategoriesSet)
    };
  }

  /**
   * Sanitizes string content or complex object values
   */
  public static sanitizeString(text: string, feature: string, categoriesTracker?: Set<string>): string {
    if (!text || typeof text !== "string") return "";

    let result = text;

    // 1. Government IDs / Citizenship / Passports (Run first to prevent misclassifying ID numbers as phone numbers)
    if (this.GOVT_ID_REGEX.test(result)) {
      if (categoriesTracker) categoriesTracker.add("governmentId");
      result = result.replace(this.GOVT_ID_REGEX, "ID: [GOVERNMENT_ID]");
    }

    // 2. Date of Birth
    if (this.DOB_REGEX.test(result)) {
      if (categoriesTracker) categoriesTracker.add("dateOfBirth");
      result = result.replace(this.DOB_REGEX, "DOB: [DATE_OF_BIRTH]");
    }

    // 3. Emails
    if (this.EMAIL_REGEX.test(result)) {
      if (categoriesTracker) categoriesTracker.add("email");
      result = result.replace(this.EMAIL_REGEX, "[EMAIL]");
    }

    // 4. Phone Numbers (matches standard numbers of length 7-15)
    result = result.replace(this.PHONE_REGEX, (match) => {
      // Filter out obvious numbers like years or placeholders
      if (match.includes("[") || match.includes("]")) return match;
      const digitsOnly = match.replace(/\D/g, "");
      if (digitsOnly.length >= 7 && digitsOnly.length <= 15) {
        if (categoriesTracker) categoriesTracker.add("phone");
        return "[PHONE]";
      }
      return match;
    });

    // 5. Gender & Age
    if (this.GENDER_AGE_REGEX.test(result)) {
      if (categoriesTracker) categoriesTracker.add("genderAge");
      result = result.replace(this.GENDER_AGE_REGEX, "[PERSONAL_METADATA]");
    }

    // 6. Address / Location
    if (this.ADDRESS_REGEX.test(result)) {
      if (categoriesTracker) categoriesTracker.add("location");
      result = result.replace(this.ADDRESS_REGEX, "Location: [LOCATION]");
    }

    // 7. Non-LinkedIn Social handles
    if (feature !== "linkedinOptimizer" && this.NON_LINKEDIN_SOCIAL_REGEX.test(result)) {
      if (categoriesTracker) categoriesTracker.add("socialProfile");
      result = result.replace(this.NON_LINKEDIN_SOCIAL_REGEX, "[SOCIAL_PROFILE]");
    }

    return result;
  }

  private static sanitizeValue(val: any, feature: string, policy: FeatureDataPolicy, categoriesTracker: Set<string>): any {
    if (val === null || val === undefined) return val;

    if (typeof val === "string") {
      return this.sanitizeString(val, feature, categoriesTracker);
    }

    if (Array.isArray(val)) {
      return val.map(item => this.sanitizeValue(item, feature, policy, categoriesTracker));
    }

    if (typeof val === "object") {
      const cleanObj: Record<string, any> = {};
      for (const [k, v] of Object.entries(val)) {
        // Strip photo base64, avatars, signatures
        if (["photo", "avatar", "signature", "profilephoto", "imagebase64"].includes(k.toLowerCase())) {
          categoriesTracker.add("visualMedia");
          continue;
        }
        cleanObj[k] = this.sanitizeValue(v, feature, policy, categoriesTracker);
      }
      return cleanObj;
    }

    return val;
  }
}
