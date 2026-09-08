import { Request, Response } from "express";
import {
  getUsers,
  getUserVersions,
  insertUserVersion,
  deleteUserVersion,
  getUserDocuments,
  insertUserDocument,
  deleteUserDocument,
  getUserSessions,
  revokeUserSession,
  revokeAllOtherSessions,
  getUserNotifications,
  getSecurityEvents,
  deleteUserRecordsByOwner,
  deleteAuthUserByEmail,
  getAuthUsers,
  insertSecurityEvent
} from "../../src/db";
import { PrivacyAuditService } from "../../src/services/privacyAudit.service";

export async function getUserCvs(req: Request, res: Response) {
  try {
    const email = req.query.email as string;
    if (!email) return res.status(400).json({ error: "Email parameter required." });
    const records = getUsers().filter(r => r.owner_email === email.toLowerCase().trim());
    return res.json({ success: true, cvs: records });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
}

export async function getVersions(req: Request, res: Response) {
  try {
    const email = req.query.email as string;
    if (!email) return res.status(400).json({ error: "Email required." });
    const versions = getUserVersions(email);
    return res.json({ success: true, versions });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
}

export async function createVersion(req: Request, res: Response) {
  try {
    const { owner_email, name, version_number, target_role, ats_score, cv_data } = req.body || {};
    if (!owner_email || !name) {
      return res.status(400).json({ error: "Owner email and version name required." });
    }
    const newVersion = insertUserVersion({
      owner_email: owner_email.toLowerCase().trim(),
      name,
      version_number: version_number || "1.0",
      target_role: target_role || "General Role",
      ats_score: ats_score || 80,
      cv_data: cv_data || {}
    });
    return res.json({ success: true, version: newVersion });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
}

export async function deleteVersion(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    const email = req.query.email as string;
    if (isNaN(id) || !email) return res.status(400).json({ error: "Invalid ID or missing email." });
    const deleted = deleteUserVersion(id, email);
    return res.json({ success: deleted });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
}

export async function getDocuments(req: Request, res: Response) {
  try {
    const email = req.query.email as string;
    if (!email) return res.status(400).json({ error: "Email required." });
    const docs = getUserDocuments(email);
    return res.json({ success: true, documents: docs });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
}

export async function createDocument(req: Request, res: Response) {
  try {
    const { owner_email, title, type, target_job, job_title, company_name, hiring_manager, tone, key_skills, content } = req.body || {};
    if (!owner_email || !title || !content) {
      return res.status(400).json({ error: "Missing required document fields." });
    }
    const newDoc = insertUserDocument({
      owner_email: owner_email.toLowerCase().trim(),
      title,
      type: type || "document",
      target_job: target_job || job_title || "",
      job_title: job_title || target_job || "",
      company_name: company_name || "",
      hiring_manager: hiring_manager || "",
      tone: tone || "",
      key_skills: key_skills || "",
      content,
      ...req.body
    });
    return res.json({ success: true, document: newDoc });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
}

export async function deleteDocument(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    const email = req.query.email as string;
    if (isNaN(id) || !email) return res.status(400).json({ error: "Invalid ID or email." });
    const deleted = deleteUserDocument(id, email);
    return res.json({ success: deleted });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
}

export async function getSessions(req: Request, res: Response) {
  try {
    const email = req.query.email as string;
    if (!email) return res.status(400).json({ error: "Email required." });
    const sessions = getUserSessions(email);
    return res.json({ success: true, sessions });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
}

export async function revokeSession(req: Request, res: Response) {
  try {
    const { email, sessionId, revokeAllOthers, currentSessionId } = req.body || {};
    if (!email) return res.status(400).json({ error: "Email required." });

    if (revokeAllOthers) {
      const revokedCount = revokeAllOtherSessions(currentSessionId || -1, email);
      insertSecurityEvent({
        event_type: "REVOKED_OTHER_SESSIONS",
        severity: "MEDIUM",
        description: `Revoked ${revokedCount} active sessions for ${email}`,
        email: email
      });
      return res.json({ success: true, revokedCount });
    }

    if (sessionId) {
      const revoked = revokeUserSession(sessionId, email);
      return res.json({ success: revoked });
    }

    return res.status(400).json({ error: "Specify sessionId or revokeAllOthers." });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
}

export async function getNotifications(req: Request, res: Response) {
  try {
    const email = req.query.email as string;
    if (!email) return res.status(400).json({ error: "Email required." });
    const notifs = getUserNotifications(email);
    return res.json({ success: true, notifications: notifs });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
}

export async function getSecurityActivity(req: Request, res: Response) {
  try {
    const email = req.query.email as string;
    if (!email) return res.status(400).json({ error: "Email required." });
    const allEvents = getSecurityEvents("ALL", "ALL");
    const userEvents = allEvents.filter(e => e.email === email.toLowerCase().trim());
    return res.json({ success: true, events: userEvents });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
}

export async function clearAiHistory(req: Request, res: Response) {
  try {
    const email = req.query.email as string;
    if (!email) {
      return res.status(400).json({ error: "Email parameter required to clear AI history." });
    }
    const deletedCount = deleteUserRecordsByOwner(email);
    PrivacyAuditService.clearAuditLogs(email);
    
    insertSecurityEvent({
      event_type: "AI_HISTORY_CLEARED",
      severity: "LOW",
      description: `Cleared AI processing history and ${deletedCount} records for ${email}`,
      email: email
    });

    return res.json({
      success: true,
      message: `Cleared ${deletedCount} CV analysis records and AI processing history for ${email}.`
    });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
}

export async function deleteAllUserData(req: Request, res: Response) {
  try {
    const { email, confirmPhrase, password } = req.body || {};
    if (!email || confirmPhrase !== "DELETE MY DATA") {
      return res.status(400).json({ error: "Invalid confirmation phrase or missing email." });
    }
    const normalizedEmail = email.toLowerCase().trim();
    const users = getAuthUsers();
    const user = users.find(u => u.email === normalizedEmail);

    if (!user || user.passwordHash !== `plain:${password}`) {
      return res.status(400).json({ error: "Re-authentication failed. Incorrect password." });
    }

    const recordsDeleted = deleteUserRecordsByOwner(normalizedEmail);
    PrivacyAuditService.clearAuditLogs(normalizedEmail);

    insertSecurityEvent({
      event_type: "ALL_USER_DATA_DELETED",
      severity: "HIGH",
      description: `User requested complete data deletion. Erased ${recordsDeleted} CVs, documents, and versions for ${normalizedEmail}`,
      email: normalizedEmail
    });

    return res.json({
      success: true,
      message: "Your complete personal data deletion request has been processed and completed."
    });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
}

export async function deleteAccount(req: Request, res: Response) {
  try {
    const { email, password } = req.body || {};
    if (!email) {
      return res.status(400).json({ error: "User email is required for account deletion." });
    }
    const normalizedEmail = email.toLowerCase().trim();
    const users = getAuthUsers();
    const user = users.find(u => u.email === normalizedEmail);

    if (password && user && user.passwordHash !== `plain:${password}`) {
      return res.status(400).json({ error: "Invalid password for account deletion." });
    }

    const recordsDeleted = deleteUserRecordsByOwner(normalizedEmail);
    const authDeleted = deleteAuthUserByEmail(normalizedEmail);
    PrivacyAuditService.clearAuditLogs(normalizedEmail);

    insertSecurityEvent({
      event_type: "ACCOUNT_PERMANENTLY_DELETED",
      severity: "CRITICAL",
      description: `Account and all records permanently removed for ${normalizedEmail}`,
      email: normalizedEmail
    });

    return res.json({
      success: true,
      message: `Account and associated data for ${normalizedEmail} permanently deleted. (${recordsDeleted} CV records removed)`,
      authDeleted
    });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
}
