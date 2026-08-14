import { PiiSanitizationService } from "./piiSanitization.service";
import { AiPrivacyGuardService } from "./aiPrivacyGuard.service";
import { PrivacyAuditService } from "./privacyAudit.service";
import { callGeminiWithRetry, getGeminiClient } from "../gemini_service";

export class CentralizedGeminiService {
  /**
   * Centralized gateway for processing AI requests securely through PII Sanitization & Privacy Guard
   */
  public static async executeAIRequest(options: {
    feature: string;
    payloadData: Record<string, any>;
    promptTemplate: (cleanData: any) => string;
    systemInstruction: string;
    userId?: string;
  }): Promise<{ resultText: string; jsonResult?: any; auditSummary: any }> {
    const { feature, payloadData, promptTemplate, systemInstruction, userId } = options;

    // 1. PII Sanitization Layer
    const sanitization = PiiSanitizationService.createPayload(payloadData, feature);

    // 2. AI Privacy Guard Secondary Check
    const privacyCheck = AiPrivacyGuardService.validateAIPayload(sanitization.sanitizedPayload, feature);

    // Combine detected removed categories
    const allRemovedCategories = Array.from(
      new Set([...sanitization.removedCategories, ...privacyCheck.removedCategories])
    );
    const piiDetected = sanitization.piiDetected || privacyCheck.piiDetected;

    // 3. Log Privacy-Safe Audit Entry
    const auditRecord = PrivacyAuditService.logAudit({
      userId,
      feature,
      piiDetected,
      removedCategories: allRemovedCategories
    });

    // 4. Construct Prompt using Sanitized Payload ONLY
    const cleanPrompt = promptTemplate(privacyCheck.sanitizedPayload);

    let resultText = "";
    let jsonResult: any = null;

    // 5. Send Sanitized Prompt to Gemini API
    if (feature === "atsAnalysis") {
      const contents = [cleanPrompt];
      const geminiRes = await callGeminiWithRetry(contents, systemInstruction);
      resultText = geminiRes.text || "";
      let cleanText = resultText.trim();
      if (cleanText.startsWith("```")) {
        cleanText = cleanText.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
      }
      try {
        jsonResult = JSON.parse(cleanText);
      } catch {
        jsonResult = null;
      }
    } else {
      const client = getGeminiClient();
      const geminiRes = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: cleanPrompt
      });
      resultText = geminiRes.text ? geminiRes.text.trim() : "";
    }

    return {
      resultText,
      jsonResult,
      auditSummary: auditRecord
    };
  }
}
