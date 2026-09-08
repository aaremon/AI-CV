import fs from "fs";
import path from "path";

const DB_DIR = path.join(process.cwd(), "data");

// Specific JSON store paths
export const STORE_PATHS = {
  USER: path.join(DB_DIR, "user.json"),
  ATS_SCANNER: path.join(DB_DIR, "ATS_scanner.json"),
  CV_ANALYZED: path.join(DB_DIR, "cv_analyzed.json"),
  ADMIN_LOG: path.join(DB_DIR, "admin_log.json"),
  COVER_LETTER: path.join(DB_DIR, "cover_letter.json"),
  LINKEDIN: path.join(DB_DIR, "linkedin.json"),
  CV_VERSIONS: path.join(DB_DIR, "cv_versions.json"),
  FEEDBACK: path.join(DB_DIR, "feedback.json"),
  NOTIFICATIONS: path.join(DB_DIR, "notifications.json"),
  SESSIONS: path.join(DB_DIR, "sessions.json"),
  DOCUMENTS: path.join(DB_DIR, "documents.json"),

  // Root-mirrored files for user convenience and instant visibility
  ROOT_USER: path.join(process.cwd(), "user.json"),
  ROOT_ATS_SCANNER: path.join(process.cwd(), "ATS_scanner.json"),
  ROOT_CV_ANALYZED: path.join(process.cwd(), "cv_analyzed.json"),
  ROOT_ADMIN_LOG: path.join(process.cwd(), "admin_log.json"),
  ROOT_COVER_LETTER: path.join(process.cwd(), "cover_letter.json"),
  ROOT_LINKEDIN: path.join(process.cwd(), "linkedin.json"),
};

interface AdminLogStore {
  admin_audit_logs: any[];
  security_events: any[];
}

export interface DbSchema {
  auth_users: any[];
  users: any[];
  feedback: any[];
  user_versions: any[];
  user_documents: any[];
  user_sessions: any[];
  security_events: any[];
  admin_audit_logs: any[];
  notifications: any[];
}

let isDbInitialized = false;

// --- Safe File I/O Helpers ---

function safeReadJson<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) {
      return fallback;
    }
    const content = fs.readFileSync(filePath, "utf8");
    if (!content.trim()) return fallback;
    return JSON.parse(content) as T;
  } catch (err) {
    console.warn(`[DB] Error reading ${filePath}:`, err);
    return fallback;
  }
}

function safeWriteJson(filePath: string, data: any, mirrors?: string | string[]) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const jsonStr = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonStr, "utf8");

    if (mirrors) {
      const mirrorList = Array.isArray(mirrors) ? mirrors : [mirrors];
      for (const m of mirrorList) {
        try {
          const mDir = path.dirname(m);
          if (!fs.existsSync(mDir)) fs.mkdirSync(mDir, { recursive: true });
          fs.writeFileSync(m, jsonStr, "utf8");
        } catch (mErr) {
          console.warn(`[DB] Mirror write warning for ${m}:`, mErr);
        }
      }
    }
  } catch (err) {
    console.error(`[DB] Error writing ${filePath}:`, err);
  }
}

/**
 * @deprecated Legacy db.json has been removed permanently in favor of modular files (user.json, ATS_scanner.json, cover_letter.json, etc.)
 */
export function syncLegacyDb() {
  // Permanent no-op: db.json has been removed completely
}

// --- Initialize All Modular Stores ---

export function initDb() {
  if (isDbInitialized && fs.existsSync(STORE_PATHS.USER)) {
    return;
  }
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  // Ensure any legacy db.json file is permanently removed if detected
  const orphanedDbFiles = [
    path.join(DB_DIR, "db.json"),
    path.join(process.cwd(), "db.json")
  ];
  for (const legacyPath of orphanedDbFiles) {
    if (fs.existsSync(legacyPath)) {
      try {
        fs.unlinkSync(legacyPath);
      } catch (_) {}
    }
  }

  const defaultAdmin = {
    id: 1,
    email: "thapakaji@gmail.com",
    name: "Platform Administrator",
    phone: "+1-800-555-ADMIN",
    passwordHash: "plain:password",
    role: "admin",
    status: "active",
    mfa_enabled: false,
    created_at: new Date().toISOString()
  };

  // 1. user.json (Auth users & profile records)
  if (!fs.existsSync(STORE_PATHS.USER)) {
    safeWriteJson(STORE_PATHS.USER, [defaultAdmin], STORE_PATHS.ROOT_USER);
  } else {
    // Ensure default admin always present and updated
    const users = safeReadJson<any[]>(STORE_PATHS.USER, []);
    let modified = false;
    const adminIdx = users.findIndex(u => u.email && u.email.toLowerCase().trim() === "thapakaji@gmail.com");
    if (adminIdx === -1) {
      users.unshift(defaultAdmin);
      modified = true;
    } else {
      if (users[adminIdx].role !== "admin") {
        users[adminIdx].role = "admin";
        modified = true;
      }
      if (users[adminIdx].passwordHash !== "plain:password") {
        users[adminIdx].passwordHash = "plain:password";
        modified = true;
      }
    }
    // Remove legacy placeholder
    const cleanUsers = users.filter(u => u.email !== "admin@cvoptimizer.com");
    if (cleanUsers.length !== users.length) modified = true;

    if (modified) {
      safeWriteJson(STORE_PATHS.USER, cleanUsers, STORE_PATHS.ROOT_USER);
    }
  }

  // 2. ATS_scanner.json & cv_analyzed.json (Analyzed CV records and ATS evaluations)
  if (!fs.existsSync(STORE_PATHS.ATS_SCANNER)) {
    const existingCv = fs.existsSync(STORE_PATHS.CV_ANALYZED)
      ? safeReadJson<any[]>(STORE_PATHS.CV_ANALYZED, [])
      : [];
    safeWriteJson(STORE_PATHS.ATS_SCANNER, existingCv, [
      STORE_PATHS.CV_ANALYZED,
      STORE_PATHS.ROOT_ATS_SCANNER,
      STORE_PATHS.ROOT_CV_ANALYZED
    ]);
  } else if (!fs.existsSync(STORE_PATHS.CV_ANALYZED)) {
    const existingScan = safeReadJson<any[]>(STORE_PATHS.ATS_SCANNER, []);
    safeWriteJson(STORE_PATHS.CV_ANALYZED, existingScan, [
      STORE_PATHS.ROOT_ATS_SCANNER,
      STORE_PATHS.ROOT_CV_ANALYZED
    ]);
  }

  // 3. admin_log.json (Admin audit logs & security intrusion events)
  if (!fs.existsSync(STORE_PATHS.ADMIN_LOG)) {
    const initialLogs: AdminLogStore = {
      admin_audit_logs: [],
      security_events: []
    };
    safeWriteJson(STORE_PATHS.ADMIN_LOG, initialLogs, STORE_PATHS.ROOT_ADMIN_LOG);
  }

  // 4. cover_letter.json (Cover Letters)
  if (!fs.existsSync(STORE_PATHS.COVER_LETTER)) {
    safeWriteJson(STORE_PATHS.COVER_LETTER, [], STORE_PATHS.ROOT_COVER_LETTER);
  }

  // 5. linkedin.json (LinkedIn Strategies & Profiles)
  if (!fs.existsSync(STORE_PATHS.LINKEDIN)) {
    safeWriteJson(STORE_PATHS.LINKEDIN, [], STORE_PATHS.ROOT_LINKEDIN);
  }

  // 6. cv_versions.json (CV Builder versions & revisions)
  if (!fs.existsSync(STORE_PATHS.CV_VERSIONS)) {
    safeWriteJson(STORE_PATHS.CV_VERSIONS, []);
  }

  // 7. feedback.json (User ratings & testimonials)
  if (!fs.existsSync(STORE_PATHS.FEEDBACK)) {
    safeWriteJson(STORE_PATHS.FEEDBACK, []);
  }

  // 8. notifications.json (User system alerts)
  if (!fs.existsSync(STORE_PATHS.NOTIFICATIONS)) {
    safeWriteJson(STORE_PATHS.NOTIFICATIONS, []);
  }

  // 9. sessions.json (Active user sessions)
  if (!fs.existsSync(STORE_PATHS.SESSIONS)) {
    safeWriteJson(STORE_PATHS.SESSIONS, []);
  }

  // 10. documents.json (General non-cover/non-linkedin docs)
  if (!fs.existsSync(STORE_PATHS.DOCUMENTS)) {
    safeWriteJson(STORE_PATHS.DOCUMENTS, []);
  }

  isDbInitialized = true;
}

// Mirror public user summary (without passwordHash) to root user.json
function syncUserJson(authUsers: any[]) {
  try {
    const cleanUserList = (authUsers || []).map((u: any) => ({
      id: u.id,
      name: u.name || "User",
      email: u.email,
      phone: u.phone || "",
      role: u.role || "user",
      status: u.status || "active",
      mfa_enabled: !!u.mfa_enabled,
      registered_at: u.created_at || u.registered_at || new Date().toISOString()
    }));
    safeWriteJson(STORE_PATHS.ROOT_USER, cleanUserList);
  } catch (err) {
    console.warn("[DB] Failed to sync root user.json:", err);
  }
}

// --- Auth Users Helpers (`data/user.json`) ---

export function getAuthUsers(): any[] {
  initDb();
  return safeReadJson<any[]>(STORE_PATHS.USER, []);
}

export function insertAuthUser(user: any): any {
  initDb();
  const users = safeReadJson<any[]>(STORE_PATHS.USER, []);
  const nextId = Math.max(...users.map((u: any) => u.id || 0), 0) + 1;
  const newRecord = {
    id: nextId,
    role: "user",
    status: "active",
    mfa_enabled: false,
    created_at: new Date().toISOString(),
    ...user
  };
  users.push(newRecord);
  safeWriteJson(STORE_PATHS.USER, users);
  syncUserJson(users);
  return newRecord;
}

export function updateAuthUser(email: string, updates: Partial<any>): any | null {
  initDb();
  const users = safeReadJson<any[]>(STORE_PATHS.USER, []);
  const targetEmail = email.toLowerCase().trim();
  const idx = users.findIndex((u: any) => (u.email || "").toLowerCase().trim() === targetEmail);
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...updates };
    safeWriteJson(STORE_PATHS.USER, users);
    syncUserJson(users);
    return users[idx];
  }
  return null;
}

export function deleteAuthUserByEmail(email: string): boolean {
  initDb();
  const users = safeReadJson<any[]>(STORE_PATHS.USER, []);
  const targetEmail = email.toLowerCase().trim();
  const initialLength = users.length;
  const filtered = users.filter((u: any) => (u.email || "").toLowerCase().trim() !== targetEmail);
  if (filtered.length < initialLength) {
    safeWriteJson(STORE_PATHS.USER, filtered);
    syncUserJson(filtered);
    return true;
  }
  return false;
}

// --- ATS Scanner & CV Records Helpers (`data/ATS_scanner.json` and `data/cv_analyzed.json`) ---

export function getAtsScanResults(ownerEmail?: string): any[] {
  initDb();
  const records = safeReadJson<any[]>(STORE_PATHS.ATS_SCANNER, []);
  if (ownerEmail) {
    const target = ownerEmail.toLowerCase().trim();
    return records.filter((r: any) => (r.owner_email || "").toLowerCase().trim() === target);
  }
  return records;
}

export function getUsers(): any[] {
  return getAtsScanResults();
}

export function getCvAnalyzedRecords(ownerEmail?: string): any[] {
  return getAtsScanResults(ownerEmail);
}

export function insertAtsScanResult(user: any): any {
  initDb();
  const records = safeReadJson<any[]>(STORE_PATHS.ATS_SCANNER, []);
  const nextId = Math.max(...records.map((u: any) => u.id || 0), 0) + 1;
  const newRecord = {
    id: nextId,
    created_at: new Date().toISOString(),
    ...user
  };
  records.push(newRecord);
  safeWriteJson(STORE_PATHS.ATS_SCANNER, records, [
    STORE_PATHS.CV_ANALYZED,
    STORE_PATHS.ROOT_ATS_SCANNER,
    STORE_PATHS.ROOT_CV_ANALYZED
  ]);
  return newRecord;
}

export function insertUser(user: any): any {
  return insertAtsScanResult(user);
}

export function deleteUserRecord(recordId: number, ownerEmail?: string | null): boolean {
  initDb();
  const records = safeReadJson<any[]>(STORE_PATHS.ATS_SCANNER, []);
  const initialLength = records.length;
  const filtered = records.filter((user: any) => {
    const matchId = user.id === recordId;
    const matchOwner = !ownerEmail || (user.owner_email || "").toLowerCase().trim() === ownerEmail.toLowerCase().trim();
    return !(matchId && matchOwner);
  });
  if (filtered.length < initialLength) {
    safeWriteJson(STORE_PATHS.ATS_SCANNER, filtered, [
      STORE_PATHS.CV_ANALYZED,
      STORE_PATHS.ROOT_ATS_SCANNER,
      STORE_PATHS.ROOT_CV_ANALYZED
    ]);
    return true;
  }
  return false;
}

export function deleteUserRecordsByOwner(ownerEmail: string): number {
  initDb();
  const targetEmail = ownerEmail.toLowerCase().trim();

  // 1. Delete analyzed CVs
  const cvRecords = safeReadJson<any[]>(STORE_PATHS.ATS_SCANNER, []);
  const initialLength = cvRecords.length;
  const cleanCv = cvRecords.filter((u: any) => (u.owner_email || "").toLowerCase().trim() !== targetEmail);
  safeWriteJson(STORE_PATHS.ATS_SCANNER, cleanCv, [
    STORE_PATHS.CV_ANALYZED,
    STORE_PATHS.ROOT_ATS_SCANNER,
    STORE_PATHS.ROOT_CV_ANALYZED
  ]);

  // 2. Clean versions
  const versions = safeReadJson<any[]>(STORE_PATHS.CV_VERSIONS, []);
  safeWriteJson(STORE_PATHS.CV_VERSIONS, versions.filter((v: any) => (v.owner_email || "").toLowerCase().trim() !== targetEmail));

  // 3. Clean cover letters
  const coverLetters = safeReadJson<any[]>(STORE_PATHS.COVER_LETTER, []);
  const cleanCover = coverLetters.filter((c: any) => (c.owner_email || "").toLowerCase().trim() !== targetEmail);
  safeWriteJson(STORE_PATHS.COVER_LETTER, cleanCover, STORE_PATHS.ROOT_COVER_LETTER);

  // 4. Clean LinkedIn
  const linkedIn = safeReadJson<any[]>(STORE_PATHS.LINKEDIN, []);
  safeWriteJson(STORE_PATHS.LINKEDIN, linkedIn.filter((l: any) => (l.owner_email || "").toLowerCase().trim() !== targetEmail), STORE_PATHS.ROOT_LINKEDIN);

  // 5. Clean sessions & notifications
  const sessions = safeReadJson<any[]>(STORE_PATHS.SESSIONS, []);
  safeWriteJson(STORE_PATHS.SESSIONS, sessions.filter((s: any) => (s.email || "").toLowerCase().trim() !== targetEmail));

  const notifications = safeReadJson<any[]>(STORE_PATHS.NOTIFICATIONS, []);
  safeWriteJson(STORE_PATHS.NOTIFICATIONS, notifications.filter((n: any) => (n.owner_email || "").toLowerCase().trim() !== targetEmail));

  return initialLength - cleanCv.length;
}

// --- CV Versions Helpers (`data/cv_versions.json`) ---

export function getUserVersions(ownerEmail?: string): any[] {
  initDb();
  const versions = safeReadJson<any[]>(STORE_PATHS.CV_VERSIONS, []);
  if (ownerEmail) {
    const target = ownerEmail.toLowerCase().trim();
    return versions.filter((v: any) => (v.owner_email || "").toLowerCase().trim() === target);
  }
  return versions;
}

export function insertUserVersion(version: any): any {
  initDb();
  const versions = safeReadJson<any[]>(STORE_PATHS.CV_VERSIONS, []);
  const nextId = Math.max(...versions.map((v: any) => v.id || 0), 0) + 1;
  const newVersion = { id: nextId, created_at: new Date().toISOString(), ...version };
  versions.push(newVersion);
  safeWriteJson(STORE_PATHS.CV_VERSIONS, versions);
  return newVersion;
}

export function deleteUserVersion(versionId: number, ownerEmail: string): boolean {
  initDb();
  const targetEmail = ownerEmail.toLowerCase().trim();
  const versions = safeReadJson<any[]>(STORE_PATHS.CV_VERSIONS, []);
  const initialLength = versions.length;
  const filtered = versions.filter(
    (v: any) => !(v.id === versionId && (v.owner_email || "").toLowerCase().trim() === targetEmail)
  );
  if (filtered.length < initialLength) {
    safeWriteJson(STORE_PATHS.CV_VERSIONS, filtered);
    return true;
  }
  return false;
}

// --- Cover Letter Store Helpers (`data/cover_letter.json`) ---

export function getCoverLetters(ownerEmail?: string): any[] {
  initDb();
  const letters = safeReadJson<any[]>(STORE_PATHS.COVER_LETTER, []);
  if (ownerEmail) {
    const target = ownerEmail.toLowerCase().trim();
    return letters.filter((d: any) => (d.owner_email || "").toLowerCase().trim() === target);
  }
  return letters;
}

export function insertCoverLetter(doc: any): any {
  initDb();
  const letters = safeReadJson<any[]>(STORE_PATHS.COVER_LETTER, []);
  const nextId = Math.max(...letters.map((d: any) => d.id || 0), 0) + 1;
  const newDoc = {
    id: nextId,
    type: "cover_letter",
    created_at: new Date().toISOString(),
    ...doc
  };
  letters.push(newDoc);
  safeWriteJson(STORE_PATHS.COVER_LETTER, letters, STORE_PATHS.ROOT_COVER_LETTER);
  return newDoc;
}

// --- LinkedIn Store Helpers (`data/linkedin.json`) ---

export function getLinkedInDocuments(ownerEmail?: string): any[] {
  initDb();
  const docs = safeReadJson<any[]>(STORE_PATHS.LINKEDIN, []);
  if (ownerEmail) {
    const target = ownerEmail.toLowerCase().trim();
    return docs.filter((d: any) => (d.owner_email || "").toLowerCase().trim() === target);
  }
  return docs;
}

export function insertLinkedInDocument(doc: any): any {
  initDb();
  const docs = safeReadJson<any[]>(STORE_PATHS.LINKEDIN, []);
  const nextId = Math.max(...docs.map((d: any) => d.id || 0), 0) + 1;
  const newDoc = {
    id: nextId,
    type: doc.type || "linkedin_pack",
    created_at: new Date().toISOString(),
    ...doc
  };
  docs.push(newDoc);
  safeWriteJson(STORE_PATHS.LINKEDIN, docs, STORE_PATHS.ROOT_LINKEDIN);
  return newDoc;
}

// --- Unified User Documents Helpers (Aggregates Cover Letter + LinkedIn + General) ---

export function getUserDocuments(ownerEmail?: string): any[] {
  initDb();
  const coverLetters = getCoverLetters(ownerEmail);
  const linkedInDocs = getLinkedInDocuments(ownerEmail);
  const genericDocs = safeReadJson<any[]>(STORE_PATHS.DOCUMENTS, []);
  let filteredGeneric = genericDocs;
  if (ownerEmail) {
    const target = ownerEmail.toLowerCase().trim();
    filteredGeneric = genericDocs.filter((d: any) => (d.owner_email || "").toLowerCase().trim() === target);
  }
  return [...coverLetters, ...linkedInDocs, ...filteredGeneric].sort(
    (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  );
}

export function insertUserDocument(doc: any): any {
  initDb();
  const docType = (doc.type || "").toLowerCase();
  if (docType === "cover_letter" || (doc.title && doc.title.toLowerCase().includes("cover letter"))) {
    return insertCoverLetter(doc);
  }
  if (docType === "linkedin" || docType === "linkedin_pack" || (doc.title && doc.title.toLowerCase().includes("linkedin"))) {
    return insertLinkedInDocument(doc);
  }

  // Generic document
  const docs = safeReadJson<any[]>(STORE_PATHS.DOCUMENTS, []);
  const nextId = Math.max(...docs.map((d: any) => d.id || 0), 0) + 1;
  const newDoc = { id: nextId, created_at: new Date().toISOString(), ...doc };
  docs.push(newDoc);
  safeWriteJson(STORE_PATHS.DOCUMENTS, docs);
  return newDoc;
}

export function deleteUserDocument(docId: number, ownerEmail: string): boolean {
  initDb();
  const targetEmail = ownerEmail.toLowerCase().trim();
  let deleted = false;

  // 1. Try deleting from cover letter store
  const coverLetters = safeReadJson<any[]>(STORE_PATHS.COVER_LETTER, []);
  const cleanCover = coverLetters.filter(
    (d: any) => !(d.id === docId && (d.owner_email || "").toLowerCase().trim() === targetEmail)
  );
  if (cleanCover.length < coverLetters.length) {
    safeWriteJson(STORE_PATHS.COVER_LETTER, cleanCover, STORE_PATHS.ROOT_COVER_LETTER);
    deleted = true;
  }

  // 2. Try deleting from LinkedIn store
  const linkedIn = safeReadJson<any[]>(STORE_PATHS.LINKEDIN, []);
  const cleanLinkedIn = linkedIn.filter(
    (d: any) => !(d.id === docId && (d.owner_email || "").toLowerCase().trim() === targetEmail)
  );
  if (cleanLinkedIn.length < linkedIn.length) {
    safeWriteJson(STORE_PATHS.LINKEDIN, cleanLinkedIn, STORE_PATHS.ROOT_LINKEDIN);
    deleted = true;
  }

  // 3. Try deleting from generic documents
  const generic = safeReadJson<any[]>(STORE_PATHS.DOCUMENTS, []);
  const cleanGeneric = generic.filter(
    (d: any) => !(d.id === docId && (d.owner_email || "").toLowerCase().trim() === targetEmail)
  );
  if (cleanGeneric.length < generic.length) {
    safeWriteJson(STORE_PATHS.DOCUMENTS, cleanGeneric);
    deleted = true;
  }

  return deleted;
}

// --- User Sessions Helpers (`data/sessions.json`) ---

export function getUserSessions(email?: string): any[] {
  initDb();
  const sessions = safeReadJson<any[]>(STORE_PATHS.SESSIONS, []);
  if (email) {
    const target = email.toLowerCase().trim();
    return sessions.filter((s: any) => (s.email || "").toLowerCase().trim() === target && !s.revoked);
  }
  return sessions;
}

export function insertUserSession(session: any): any {
  initDb();
  const sessions = safeReadJson<any[]>(STORE_PATHS.SESSIONS, []);
  const nextId = Math.max(...sessions.map((s: any) => s.id || 0), 0) + 1;
  const newSession = {
    id: nextId,
    created_at: new Date().toISOString(),
    last_active: new Date().toISOString(),
    revoked: false,
    ...session
  };
  sessions.push(newSession);
  safeWriteJson(STORE_PATHS.SESSIONS, sessions);
  return newSession;
}

export function revokeUserSession(sessionId: number, email: string): boolean {
  initDb();
  const targetEmail = email.toLowerCase().trim();
  const sessions = safeReadJson<any[]>(STORE_PATHS.SESSIONS, []);
  const session = sessions.find(
    (s: any) => s.id === sessionId && (s.email || "").toLowerCase().trim() === targetEmail
  );
  if (session) {
    session.revoked = true;
    safeWriteJson(STORE_PATHS.SESSIONS, sessions);
    return true;
  }
  return false;
}

export function revokeAllOtherSessions(currentSessionId: number, email: string): number {
  initDb();
  const targetEmail = email.toLowerCase().trim();
  const sessions = safeReadJson<any[]>(STORE_PATHS.SESSIONS, []);
  let count = 0;
  sessions.forEach((s: any) => {
    if ((s.email || "").toLowerCase().trim() === targetEmail && s.id !== currentSessionId && !s.revoked) {
      s.revoked = true;
      count++;
    }
  });
  if (count > 0) {
    safeWriteJson(STORE_PATHS.SESSIONS, sessions);
  }
  return count;
}

// --- Security Events & Admin Logs Helpers (`data/admin_log.json`) ---

export function getSecurityEvents(filterSeverity?: string, category?: string): any[] {
  initDb();
  const store = safeReadJson<AdminLogStore>(STORE_PATHS.ADMIN_LOG, { admin_audit_logs: [], security_events: [] });
  let events = store.security_events || [];
  if (filterSeverity && filterSeverity !== "ALL") {
    events = events.filter((e: any) => e.severity === filterSeverity);
  }
  if (category && category !== "ALL") {
    events = events.filter((e: any) => (e.event_type || "").toLowerCase().includes(category.toLowerCase()));
  }
  return events.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
}

export function insertSecurityEvent(event: {
  event_type: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  description: string;
  user_id?: string | number;
  email?: string;
  ip_safe?: string;
  user_agent_summary?: string;
}): any {
  initDb();
  const store = safeReadJson<AdminLogStore>(STORE_PATHS.ADMIN_LOG, { admin_audit_logs: [], security_events: [] });
  const events = store.security_events || [];
  const nextId = Math.max(...events.map((e: any) => e.id || 0), 0) + 1;
  const newEvent = {
    id: nextId,
    created_at: new Date().toISOString(),
    status: "RECORDED",
    ip_safe: "127.0.0.x (hashed)",
    user_agent_summary: "Browser/Client",
    ...event
  };
  events.push(newEvent);
  store.security_events = events;
  safeWriteJson(STORE_PATHS.ADMIN_LOG, store, STORE_PATHS.ROOT_ADMIN_LOG);
  return newEvent;
}

export function getAdminAuditLogs(): any[] {
  initDb();
  const store = safeReadJson<AdminLogStore>(STORE_PATHS.ADMIN_LOG, { admin_audit_logs: [], security_events: [] });
  return (store.admin_audit_logs || []).sort(
    (a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()
  );
}

export function insertAdminAuditLog(log: {
  admin_email: string;
  action: string;
  target_resource: string;
  result: string;
}): any {
  initDb();
  const store = safeReadJson<AdminLogStore>(STORE_PATHS.ADMIN_LOG, { admin_audit_logs: [], security_events: [] });
  const logs = store.admin_audit_logs || [];
  const nextId = Math.max(...logs.map((l: any) => l.id || 0), 0) + 1;
  const newLog = {
    id: nextId,
    timestamp: new Date().toISOString(),
    ...log
  };
  logs.push(newLog);
  store.admin_audit_logs = logs;
  safeWriteJson(STORE_PATHS.ADMIN_LOG, store, STORE_PATHS.ROOT_ADMIN_LOG);
  return newLog;
}

// --- Notifications Helpers (`data/notifications.json`) ---

export function getUserNotifications(ownerEmail: string): any[] {
  initDb();
  const targetEmail = ownerEmail.toLowerCase().trim();
  const notifs = safeReadJson<any[]>(STORE_PATHS.NOTIFICATIONS, []);
  return notifs
    .filter((n: any) => (n.owner_email || "").toLowerCase().trim() === targetEmail)
    .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
}

export function insertUserNotification(notification: {
  owner_email: string;
  title: string;
  message: string;
  type?: "info" | "success" | "warning";
}): any {
  initDb();
  const notifs = safeReadJson<any[]>(STORE_PATHS.NOTIFICATIONS, []);
  const nextId = Math.max(...notifs.map((n: any) => n.id || 0), 0) + 1;
  const newNotif = {
    id: nextId,
    read: false,
    type: "info",
    created_at: new Date().toISOString(),
    ...notification,
    owner_email: notification.owner_email.toLowerCase().trim()
  };
  notifs.push(newNotif);
  safeWriteJson(STORE_PATHS.NOTIFICATIONS, notifs);
  return newNotif;
}

// --- Feedback Helpers (`data/feedback.json`) ---

export function getFeedback(): any[] {
  initDb();
  return safeReadJson<any[]>(STORE_PATHS.FEEDBACK, []);
}

export function insertFeedback(feedback: any): any {
  initDb();
  const records = safeReadJson<any[]>(STORE_PATHS.FEEDBACK, []);
  const nextId = Math.max(...records.map((f: any) => f.id || 0), 0) + 1;
  const newRecord = { id: nextId, created_at: new Date().toISOString(), ...feedback };
  records.push(newRecord);
  safeWriteJson(STORE_PATHS.FEEDBACK, records);
  return newRecord;
}

// --- Reset Full Database Across All Modular Files ---

export function resetEntireDatabase(): boolean {
  const defaultAdmin = {
    id: 1,
    email: "thapakaji@gmail.com",
    name: "Platform Administrator",
    phone: "+1-800-555-ADMIN",
    passwordHash: "plain:password",
    role: "admin",
    status: "active",
    mfa_enabled: false,
    created_at: new Date().toISOString()
  };

  safeWriteJson(STORE_PATHS.USER, [defaultAdmin], STORE_PATHS.ROOT_USER);
  safeWriteJson(STORE_PATHS.ATS_SCANNER, [], [STORE_PATHS.CV_ANALYZED, STORE_PATHS.ROOT_ATS_SCANNER, STORE_PATHS.ROOT_CV_ANALYZED]);
  safeWriteJson(STORE_PATHS.ADMIN_LOG, { admin_audit_logs: [], security_events: [] }, STORE_PATHS.ROOT_ADMIN_LOG);
  safeWriteJson(STORE_PATHS.COVER_LETTER, [], STORE_PATHS.ROOT_COVER_LETTER);
  safeWriteJson(STORE_PATHS.LINKEDIN, [], STORE_PATHS.ROOT_LINKEDIN);
  safeWriteJson(STORE_PATHS.CV_VERSIONS, []);
  safeWriteJson(STORE_PATHS.FEEDBACK, []);
  safeWriteJson(STORE_PATHS.NOTIFICATIONS, []);
  safeWriteJson(STORE_PATHS.SESSIONS, []);
  safeWriteJson(STORE_PATHS.DOCUMENTS, []);

  // Remove any legacy db.json if present
  const legacyFiles = [path.join(DB_DIR, "db.json"), path.join(process.cwd(), "db.json")];
  for (const f of legacyFiles) {
    if (fs.existsSync(f)) {
      try {
        fs.unlinkSync(f);
      } catch (_) {}
    }
  }

  return true;
}

// --- Store Health & Size Summary ---

export function getDataStoresSummary(): any {
  initDb();
  const getFileSize = (p: string) => {
    try {
      if (fs.existsSync(p)) return fs.statSync(p).size;
      return 0;
    } catch (_) {
      return 0;
    }
  };

  const users = getAuthUsers();
  const cvs = getUsers();
  const adminLogs = getAdminAuditLogs();
  const secEvents = getSecurityEvents("ALL", "ALL");
  const coverLetters = getCoverLetters();
  const linkedInDocs = getLinkedInDocuments();
  const versions = getUserVersions();
  const feedback = getFeedback();
  const notifications = safeReadJson<any[]>(STORE_PATHS.NOTIFICATIONS, []);
  const sessions = safeReadJson<any[]>(STORE_PATHS.SESSIONS, []);
  const docs = safeReadJson<any[]>(STORE_PATHS.DOCUMENTS, []);

  return {
    stores: [
      { name: "user.json", count: users.length, path: "data/user.json", sizeBytes: getFileSize(STORE_PATHS.USER) },
      { name: "ATS_scanner.json", count: cvs.length, path: "data/ATS_scanner.json", sizeBytes: getFileSize(STORE_PATHS.ATS_SCANNER) },
      { name: "cv_analyzed.json", count: cvs.length, path: "data/cv_analyzed.json", sizeBytes: getFileSize(STORE_PATHS.CV_ANALYZED) },
      { name: "admin_log.json", count: adminLogs.length + secEvents.length, path: "data/admin_log.json", sizeBytes: getFileSize(STORE_PATHS.ADMIN_LOG) },
      { name: "cover_letter.json", count: coverLetters.length, path: "data/cover_letter.json", sizeBytes: getFileSize(STORE_PATHS.COVER_LETTER) },
      { name: "linkedin.json", count: linkedInDocs.length, path: "data/linkedin.json", sizeBytes: getFileSize(STORE_PATHS.LINKEDIN) },
      { name: "cv_versions.json", count: versions.length, path: "data/cv_versions.json", sizeBytes: getFileSize(STORE_PATHS.CV_VERSIONS) },
      { name: "feedback.json", count: feedback.length, path: "data/feedback.json", sizeBytes: getFileSize(STORE_PATHS.FEEDBACK) },
      { name: "notifications.json", count: notifications.length, path: "data/notifications.json", sizeBytes: getFileSize(STORE_PATHS.NOTIFICATIONS) },
      { name: "sessions.json", count: sessions.length, path: "data/sessions.json", sizeBytes: getFileSize(STORE_PATHS.SESSIONS) },
      { name: "documents.json", count: docs.length, path: "data/documents.json", sizeBytes: getFileSize(STORE_PATHS.DOCUMENTS) }
    ]
  };
}
