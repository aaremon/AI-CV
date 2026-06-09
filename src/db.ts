import fs from 'fs';
import path from 'path';

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  phone: string;
  passwordHash: string; // Stored securely
  created_at: string;
}

export interface UserRecord {
  id: number;
  sec_token: string;
  ip_add: string;
  host_name: string;
  dev_user: string;
  os_name_ver: string;
  latlong: string;
  city: string;
  state: string;
  country: string;
  act_name: string;
  act_mail: string;
  act_mob: string;
  name: string;
  email: string;
  resume_score: string;
  timestamp: string;
  page_no: string;
  reco_field: string;
  cand_level: string;
  skills: string; // JSON encoded string array
  recommended_skills: string; // JSON encoded string array
  courses: string; // JSON encoded string array
  pdf_name: string;
  owner_email?: string; // Linked account, optional
}

export interface FeedbackRecord {
  id: number;
  feed_name: string;
  feed_email: string;
  feed_score: string;
  comments: string;
  timestamp: string;
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

function initDb() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(
      DB_FILE,
      JSON.stringify({ auth_users: [], users: [], feedback: [] }, null, 2)
    );
  } else {
    // Migrate if needed
    try {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
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
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
      }
    } catch (e) {
      fs.writeFileSync(
        DB_FILE,
        JSON.stringify({ auth_users: [], users: [], feedback: [] }, null, 2)
      );
    }
  }
}

// Auth Users Store
export function getAuthUsers(): AuthUser[] {
  initDb();
  try {
    const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    return data.auth_users || [];
  } catch (err) {
    return [];
  }
}

export function insertAuthUser(user: Omit<AuthUser, 'id'>): AuthUser {
  initDb();
  try {
    const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    const nextId = (data.auth_users.length > 0 ? Math.max(...data.auth_users.map((r: any) => r.id)) : 0) + 1;
    const newRecord: AuthUser = { id: nextId, ...user };
    data.auth_users.push(newRecord);
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return newRecord;
  } catch (err) {
    console.error('Error inserting auth user:', err);
    throw err;
  }
}

// Resume Analyzer Records Store
export function getUsers(): UserRecord[] {
  initDb();
  try {
    const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    return data.users || [];
  } catch (err) {
    return [];
  }
}

export function deleteUserRecord(id: number, owner_email?: string): boolean {
  initDb();
  try {
    const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    const initialLength = data.users.length;
    data.users = data.users.filter((r: UserRecord) => {
      if (r.id !== id) return true;
      if (owner_email && r.owner_email !== owner_email) return true;
      return false;
    });
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return data.users.length < initialLength;
  } catch (err) {
    console.error('Error deleting user record:', err);
    return false;
  }
}

export function insertUser(user: Omit<UserRecord, 'id'>): UserRecord {
  initDb();
  try {
    const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    const nextId = (data.users.length > 0 ? Math.max(...data.users.map((r: any) => r.id)) : 0) + 1;
    const newRecord: UserRecord = { id: nextId, ...user };
    data.users.push(newRecord);
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return newRecord;
  } catch (err) {
    console.error('Error inserting user record:', err);
    throw err;
  }
}

// Feedback Store
export function getFeedback(): FeedbackRecord[] {
  initDb();
  try {
    const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    return data.feedback || [];
  } catch (err) {
    return [];
  }
}

export function insertFeedback(feedback: Omit<FeedbackRecord, 'id'>): FeedbackRecord {
  initDb();
  try {
    const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    const nextId = (data.feedback.length > 0 ? Math.max(...data.feedback.map((r: any) => r.id)) : 0) + 1;
    const newRecord: FeedbackRecord = { id: nextId, ...feedback };
    data.feedback.push(newRecord);
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return newRecord;
  } catch (err) {
    console.error('Error inserting feedback:', err);
    throw err;
  }
}
