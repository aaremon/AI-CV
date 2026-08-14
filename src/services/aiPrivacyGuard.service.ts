import { PiiSanitizationService } from "./piiSanitization.service";

export interface PrivacyGuardResult {
  sanitizedPayload: any;
  piiDetected: boolean;
  removedCategories: string[];
}

export class AiPrivacyGuardService {
  /**
   * Secondary Safety Check: Scans final payload right before Gemini API execution
   */
  public static validateAIPayload(payload: any, feature: string): PrivacyGuardResult {
    const categoriesSet = new Set<string>();

    const sanitizedPayload = this.scanAndClean(payload, feature, categoriesSet);
    const piiDetected = categoriesSet.size > 0;

    return {
      sanitizedPayload,
      piiDetected,
      removedCategories: Array.from(categoriesSet)
    };
  }

  private static scanAndClean(val: any, feature: string, categoriesTracker: Set<string>): any {
    if (val === null || val === undefined) return val;

    if (typeof val === "string") {
      return PiiSanitizationService.sanitizeString(val, feature, categoriesTracker);
    }

    if (Array.isArray(val)) {
      return val.map(item => this.scanAndClean(item, feature, categoriesTracker));
    }

    if (typeof val === "object") {
      const cleanObj: Record<string, any> = {};
      for (const [key, value] of Object.entries(val)) {
        // Redact any explicitly labeled contact or PII keys if present
        const lowerKey = key.toLowerCase();
        if (["email", "act_mail", "phone", "act_mob", "mobile", "ssn", "citizenship", "dob", "dateofbirth", "address"].includes(lowerKey)) {
          categoriesTracker.add(lowerKey);
          cleanObj[key] = `[${key.toUpperCase()}_REDACTED]`;
        } else {
          cleanObj[key] = this.scanAndClean(value, feature, categoriesTracker);
        }
      }
      return cleanObj;
    }

    return val;
  }
}
