import { Request, Response } from "express";
import { PrivacyAuditService } from "../../src/services/privacyAudit.service";

export async function getPrivacyAudit(req: Request, res: Response) {
  try {
    const email = req.query.email as string;
    const logs = PrivacyAuditService.getAuditLogs(email);
    return res.json({ success: true, logs });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
}

export async function getPrivacySettings(req: Request, res: Response) {
  try {
    return res.json({
      success: true,
      settings: {
        aiDataMinimization: true,
        serverSideSanitization: true,
        zeroDataRetentionPolicy: true,
        noRawPayloadLogging: true
      }
    });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
}
