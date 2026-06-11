import fs from "fs";
import path from "path";

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "db.json");

function initDb() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ auth_users: [], users: [], feedback: [] }, null, 2), "utf8");
  } else {
    try {
      const content = fs.readFileSync(DB_FILE, "utf8");
      const data = JSON.parse(content);
      let modified = false;
      if (!data.auth_users) {
        data.auth_users = [];
        modified = true;
      }
      if (!data.users) {
        data.users = [];
        modified = true;
      }
      if (!data.feedback) {
        data.feedback = [];
        modified = true;
      }
      if (modified) {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
      }
    } catch (e) {
      fs.writeFileSync(DB_FILE, JSON.stringify({ auth_users: [], users: [], feedback: [] }, null, 2), "utf8");
    }
  }
}

function readDb(): { auth_users: any[]; users: any[]; feedback: any[] } {
  initDb();
  try {
    const content = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(content);
  } catch (e) {
    return { auth_users: [], users: [], feedback: [] };
  }
}

function writeDb(data: any) {
  initDb();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
}

export function getAuthUsers(): any[] {
  const db = readDb();
  return db.auth_users || [];
}

export function insertAuthUser(user: any): any {
  const db = readDb();
  const nextId = Math.max(...db.auth_users.map((u: any) => u.id || 0), 0) + 1;
  const newRecord = { id: nextId, ...user };
  db.auth_users.push(newRecord);
  writeDb(db);
  return newRecord;
}

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
