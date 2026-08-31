import fs from "fs";
import path from "path";

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "db.json");

interface DbSchema {
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

function initDb() {
  if (isDbInitialized && fs.existsSync(DB_FILE)) {
    return;
  }
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  const defaultDb: DbSchema = {
    auth_users: [
      {
        id: 1,
        email: "thapakaji@gmail.com",
        name: "Platform Administrator",
        phone: "+1-800-555-ADMIN",
        passwordHash: "plain:password",
        role: "admin",
        status: "active",
        mfa_enabled: false,
        created_at: new Date().toISOString()
      }
    ],
    users: [],
    feedback: [],
    user_versions: [],
    user_documents: [],
    user_sessions: [],
    security_events: [],
    admin_audit_logs: [],
    notifications: []
  };

  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), "utf8");
    isDbInitialized = true;
  } else {
    try {
      const content = fs.readFileSync(DB_FILE, "utf8");
      const data = JSON.parse(content);
      let modified = false;
      const keys: (keyof DbSchema)[] = [
        "auth_users", "users", "feedback", "user_versions",
        "user_documents", "user_sessions", "security_events",
        "admin_audit_logs", "notifications"
      ];
      for (const k of keys) {
        if (!data[k]) {
          data[k] = defaultDb[k] || [];
          modified = true;
        }
      }
      // Clean up legacy/duplicate admin and ensure proper ID sequencing
      const emailMap = new Map();
      const cleanUsers: any[] = [];
      for (const u of data.auth_users || []) {
        if (!u.email) continue;
        const normalized = u.email.toLowerCase().trim();
        if (normalized === "admin@cvoptimizer.com") {
          modified = true;
          continue; // remove legacy placeholder admin
        }
        if (!emailMap.has(normalized)) {
          emailMap.set(normalized, true);
          cleanUsers.push(u);
        } else {
          modified = true;
        }
      }
      
      const existingAdmin = cleanUsers.find((u: any) => u.email.toLowerCase().trim() === "thapakaji@gmail.com");
      if (!existingAdmin) {
        cleanUsers.unshift(defaultDb.auth_users[0]);
        modified = true;
      } else {
        if (existingAdmin.role !== "admin") {
          existingAdmin.role = "admin";
          modified = true;
        }
        if (existingAdmin.passwordHash !== "plain:password") {
          existingAdmin.passwordHash = "plain:password";
          modified = true;
        }
      }

      // Ensure sequential distinct IDs
      cleanUsers.forEach((u, i) => {
        if (u.id !== i + 1) {
          u.id = i + 1;
          modified = true;
        }
      });
      data.auth_users = cleanUsers;
      if (modified) {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
      }
      isDbInitialized = true;
    } catch (e) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), "utf8");
      isDbInitialized = true;
    }
  }
}

function readDb(): DbSchema {
  initDb();
  try {
    const content = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(content);
  } catch (e) {
    return {
      auth_users: [],
      users: [],
      feedback: [],
      user_versions: [],
      user_documents: [],
      user_sessions: [],
      security_events: [],
      admin_audit_logs: [],
      notifications: []
    };
  }
}

const USER_JSON_FILE = path.join(process.cwd(), "user.json");
const DATA_USER_JSON_FILE = path.join(DB_DIR, "user.json");

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
    const jsonStr = JSON.stringify(cleanUserList, null, 2);
    fs.writeFileSync(USER_JSON_FILE, jsonStr, "utf8");
    fs.writeFileSync(DATA_USER_JSON_FILE, jsonStr, "utf8");
  } catch (err) {
    console.warn("Failed to sync user.json:", err);
  }
}

function writeDb(data: any) {
  initDb();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
  if (data.auth_users) {
    syncUserJson(data.auth_users);
  }
}

// --- Auth Users Helpers ---
export function getAuthUsers(): any[] {
  const db = readDb();
  return db.auth_users || [];
}

export function insertAuthUser(user: any): any {
  const db = readDb();
  const nextId = Math.max(...db.auth_users.map((u: any) => u.id || 0), 0) + 1;
  const newRecord = {
    id: nextId,
    role: "user",
    status: "active",
    mfa_enabled: false,
    ...user
  };
  db.auth_users.push(newRecord);
  writeDb(db);
  return newRecord;
}

export function updateAuthUser(email: string, updates: Partial<any>): any | null {
  const db = readDb();
  const targetEmail = email.toLowerCase().trim();
  const idx = db.auth_users.findIndex((u: any) => u.email === targetEmail);
  if (idx !== -1) {
    db.auth_users[idx] = { ...db.auth_users[idx], ...updates };
    writeDb(db);
    return db.auth_users[idx];
  }
  return null;
}

export function deleteAuthUserByEmail(email: string): boolean {
  const db = readDb();
  const targetEmail = email.toLowerCase().trim();
  const initialLength = db.auth_users.length;
  db.auth_users = db.auth_users.filter((u: any) => u.email !== targetEmail);
  writeDb(db);
  return db.auth_users.length < initialLength;
}

// --- CV Records Helpers ---
export function getUsers(): any[] {
  const db = readDb();
  return db.users || [];
}

export function insertUser(user: any): any {
  const db = readDb();
  const nextId = Math.max(...db.users.map((u: any) => u.id || 0), 0) + 1;
  const newRecord = { id: nextId, ...user };
  db.users.push(newRecord);
  writeDb(db);
  return newRecord;
}

export function deleteUserRecord(recordId: number, ownerEmail?: string | null): boolean {
  const db = readDb();
  const initialLength = db.users.length;
  db.users = db.users.filter((user: any) => {
    const matchId = user.id === recordId;
    const matchOwner = !ownerEmail || user.owner_email === ownerEmail;
    return !(matchId && matchOwner);
  });
  writeDb(db);
  return db.users.length < initialLength;
}

export function deleteUserRecordsByOwner(ownerEmail: string): number {
  const db = readDb();
  const targetEmail = ownerEmail.toLowerCase().trim();
  const initialLength = db.users.length;
  db.users = db.users.filter((user: any) => user.owner_email !== targetEmail);
  // Clean up versioning, documents, sessions and notifications
  db.user_versions = (db.user_versions || []).filter((v: any) => v.owner_email !== targetEmail);
  db.user_documents = (db.user_documents || []).filter((d: any) => d.owner_email !== targetEmail);
  db.user_sessions = (db.user_sessions || []).filter((s: any) => s.email !== targetEmail);
  db.notifications = (db.notifications || []).filter((n: any) => n.owner_email !== targetEmail);
  writeDb(db);
  return initialLength - db.users.length;
}

// --- CV Versions Helpers ---
export function getUserVersions(ownerEmail?: string): any[] {
  const db = readDb();
  const versions = db.user_versions || [];
  if (ownerEmail) {
    const target = ownerEmail.toLowerCase().trim();
    return versions.filter((v: any) => v.owner_email === target);
  }
  return versions;
}

export function insertUserVersion(version: any): any {
  const db = readDb();
  const nextId = Math.max(...(db.user_versions || []).map((v: any) => v.id || 0), 0) + 1;
  const newVersion = { id: nextId, created_at: new Date().toISOString(), ...version };
  db.user_versions = db.user_versions || [];
  db.user_versions.push(newVersion);
  writeDb(db);
  return newVersion;
}

export function deleteUserVersion(versionId: number, ownerEmail: string): boolean {
  const db = readDb();
  const targetEmail = ownerEmail.toLowerCase().trim();
  const initialLength = (db.user_versions || []).length;
  db.user_versions = (db.user_versions || []).filter(
    (v: any) => !(v.id === versionId && v.owner_email === targetEmail)
  );
  writeDb(db);
  return (db.user_versions || []).length < initialLength;
}

// --- User Documents Helpers ---
export function getUserDocuments(ownerEmail?: string): any[] {
  const db = readDb();
  const docs = db.user_documents || [];
  if (ownerEmail) {
    const target = ownerEmail.toLowerCase().trim();
    return docs.filter((d: any) => d.owner_email === target);
  }
  return docs;
}

export function insertUserDocument(doc: any): any {
  const db = readDb();
  const nextId = Math.max(...(db.user_documents || []).map((d: any) => d.id || 0), 0) + 1;
  const newDoc = { id: nextId, created_at: new Date().toISOString(), ...doc };
  db.user_documents = db.user_documents || [];
  db.user_documents.push(newDoc);
  writeDb(db);
  return newDoc;
}

export function deleteUserDocument(docId: number, ownerEmail: string): boolean {
  const db = readDb();
  const targetEmail = ownerEmail.toLowerCase().trim();
  const initialLength = (db.user_documents || []).length;
  db.user_documents = (db.user_documents || []).filter(
    (d: any) => !(d.id === docId && d.owner_email === targetEmail)
  );
  writeDb(db);
  return (db.user_documents || []).length < initialLength;
}

// --- User Sessions Helpers ---
export function getUserSessions(email?: string): any[] {
  const db = readDb();
  const sessions = db.user_sessions || [];
  if (email) {
    const target = email.toLowerCase().trim();
    return sessions.filter((s: any) => s.email === target && !s.revoked);
  }
  return sessions;
}

export function insertUserSession(session: any): any {
  const db = readDb();
  const nextId = Math.max(...(db.user_sessions || []).map((s: any) => s.id || 0), 0) + 1;
  const newSession = {
    id: nextId,
    created_at: new Date().toISOString(),
    last_active: new Date().toISOString(),
    revoked: false,
    ...session
  };
  db.user_sessions = db.user_sessions || [];
  db.user_sessions.push(newSession);
  writeDb(db);
  return newSession;
}

export function revokeUserSession(sessionId: number, email: string): boolean {
  const db = readDb();
  const targetEmail = email.toLowerCase().trim();
  const session = (db.user_sessions || []).find(
    (s: any) => s.id === sessionId && s.email === targetEmail
  );
  if (session) {
    session.revoked = true;
    writeDb(db);
    return true;
  }
  return false;
}

export function revokeAllOtherSessions(currentSessionId: number, email: string): number {
  const db = readDb();
  const targetEmail = email.toLowerCase().trim();
  let count = 0;
  (db.user_sessions || []).forEach((s: any) => {
    if (s.email === targetEmail && s.id !== currentSessionId && !s.revoked) {
      s.revoked = true;
      count++;
    }
  });
  writeDb(db);
  return count;
}

// --- Security Events Helpers ---
export function getSecurityEvents(filterSeverity?: string, category?: string): any[] {
  const db = readDb();
  let events = db.security_events || [];
  if (filterSeverity && filterSeverity !== "ALL") {
    events = events.filter((e: any) => e.severity === filterSeverity);
  }
  if (category && category !== "ALL") {
    events = events.filter((e: any) => e.event_type?.toLowerCase().includes(category.toLowerCase()));
  }
  return events.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
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
  const db = readDb();
  const nextId = Math.max(...(db.security_events || []).map((e: any) => e.id || 0), 0) + 1;
  const newEvent = {
    id: nextId,
    created_at: new Date().toISOString(),
    status: "RECORDED",
    ip_safe: "127.0.0.x (hashed)",
    user_agent_summary: "Browser/Client",
    ...event
  };
  db.security_events = db.security_events || [];
  db.security_events.push(newEvent);
  writeDb(db);
  return newEvent;
}

// --- Admin Audit Logs Helpers ---
export function getAdminAuditLogs(): any[] {
  const db = readDb();
  return (db.admin_audit_logs || []).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function insertAdminAuditLog(log: {
  admin_email: string;
  action: string;
  target_resource: string;
  result: string;
}): any {
  const db = readDb();
  const nextId = Math.max(...(db.admin_audit_logs || []).map((l: any) => l.id || 0), 0) + 1;
  const newLog = {
    id: nextId,
    timestamp: new Date().toISOString(),
    ...log
  };
  db.admin_audit_logs = db.admin_audit_logs || [];
  db.admin_audit_logs.push(newLog);
  writeDb(db);
  return newLog;
}

// --- Notifications Helpers ---
export function getUserNotifications(ownerEmail: string): any[] {
  const db = readDb();
  const targetEmail = ownerEmail.toLowerCase().trim();
  return (db.notifications || [])
    .filter((n: any) => n.owner_email === targetEmail)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function insertUserNotification(notification: {
  owner_email: string;
  title: string;
  message: string;
  type?: "info" | "success" | "warning";
}): any {
  const db = readDb();
  const nextId = Math.max(...(db.notifications || []).map((n: any) => n.id || 0), 0) + 1;
  const newNotif = {
    id: nextId,
    read: false,
    type: "info",
    created_at: new Date().toISOString(),
    ...notification,
    owner_email: notification.owner_email.toLowerCase().trim()
  };
  db.notifications = db.notifications || [];
  db.notifications.push(newNotif);
  writeDb(db);
  return newNotif;
}

// --- Feedback Helpers ---
export function getFeedback(): any[] {
  const db = readDb();
  return db.feedback || [];
}

export function insertFeedback(feedback: any): any {
  const db = readDb();
  const nextId = Math.max(...db.feedback.map((f: any) => f.id || 0), 0) + 1;
  const newRecord = { id: nextId, ...feedback };
  db.feedback.push(newRecord);
  writeDb(db);
  return newRecord;
}

// --- Reset Full Database Helper ---
export function resetEntireDatabase(): boolean {
  const defaultDb: DbSchema = {
    auth_users: [
      {
        id: 1,
        email: "thapakaji@gmail.com",
        name: "Platform Administrator",
        phone: "+1-800-555-ADMIN",
        passwordHash: "plain:password",
        role: "admin",
        status: "active",
        mfa_enabled: false,
        created_at: new Date().toISOString()
      }
    ],
    users: [],
    feedback: [],
    user_versions: [],
    user_documents: [],
    user_sessions: [],
    security_events: [],
    admin_audit_logs: [],
    notifications: []
  };
  writeDb(defaultDb);
  return true;
}
