import fs from "fs";
import path from "path";

export interface PrivacyAuditRecord {
  id: number;
  userId: string;
  feature: string;
  piiDetected: boolean;
  removedCategories: string[];
  timestamp: string;
}

const DB_DIR = path.join(process.cwd(), "data");
const AUDIT_FILE = path.join(DB_DIR, "privacy_audit.json");

function initAuditFile() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(AUDIT_FILE)) {
    fs.writeFileSync(AUDIT_FILE, JSON.stringify([], null, 2), "utf8");
  }
}

function readAuditFile(): PrivacyAuditRecord[] {
  initAuditFile();
  try {
    const data = fs.readFileSync(AUDIT_FILE, "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeAuditFile(records: PrivacyAuditRecord[]) {
  initAuditFile();
  fs.writeFileSync(AUDIT_FILE, JSON.stringify(records, null, 2), "utf8");
}

export class PrivacyAuditService {
  /**
   * Record privacy-safe audit record (NO RAW PII or PROMPT PAYLOADS STORED)
   */
  public static logAudit(entry: {
    userId?: string;
    feature: string;
    piiDetected: boolean;
    removedCategories: string[];
  }): PrivacyAuditRecord {
    const records = readAuditFile();
    const nextId = Math.max(...records.map(r => r.id || 0), 0) + 1;

    const newRecord: PrivacyAuditRecord = {
      id: nextId,
      userId: entry.userId ? entry.userId.toLowerCase().trim() : "anonymous-user",
      feature: entry.feature.toUpperCase(),
      piiDetected: entry.piiDetected,
      removedCategories: entry.removedCategories,
      timestamp: new Date().toISOString()
    };

    records.push(newRecord);
    // Keep last 100 entries max to manage storage efficiently
    const trimmed = records.slice(-100);
    writeAuditFile(trimmed);

    return newRecord;
  }

  /**
   * Get audit logs for a user or all users
   */
  public static getAuditLogs(userId?: string): PrivacyAuditRecord[] {
    const records = readAuditFile();
    if (userId) {
      const targetUser = userId.toLowerCase().trim();
      return records.filter(r => r.userId === targetUser || r.userId === "anonymous-user");
    }
    return records;
  }

  /**
   * Clear audit logs for user
   */
  public static clearAuditLogs(userId?: string): boolean {
    if (!userId) {
      writeAuditFile([]);
      return true;
    }
    const targetUser = userId.toLowerCase().trim();
    const records = readAuditFile();
    const filtered = records.filter(r => r.userId !== targetUser);
    writeAuditFile(filtered);
    return true;
  }
}
