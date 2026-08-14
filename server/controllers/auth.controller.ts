import { Request, Response } from "express";
import {
  getAuthUsers,
  insertAuthUser,
  updateAuthUser,
  insertSecurityEvent,
  insertUserNotification,
  insertUserSession
} from "../../src/db";

export async function signup(req: Request, res: Response) {
  try {
    const { email, password, name, phone } = req.body || {};

    if (!email || !password || !name || !phone) {
      return res.status(400).json({ error: "Please fill out all signup criteria." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = getAuthUsers();
    if (existing.some((u) => u.email === normalizedEmail)) {
      return res.status(400).json({ error: "An account with this email address already exists." });
    }

    const passwordHash = `plain:${password}`;
    const timestamp = new Date().toISOString();

    const userPayload = {
      email: normalizedEmail,
      name: name.trim(),
      phone: phone.trim(),
      passwordHash,
      role: normalizedEmail.includes("admin") || normalizedEmail === "thapakaji@gmail.com" ? "admin" : "user",
      mfa_enabled: false,
      created_at: timestamp
    };

    const newUser = insertAuthUser(userPayload);
    const { passwordHash: _, ...userSafe } = newUser;

    // Log security event
    insertSecurityEvent({
      event_type: "USER_REGISTERED",
      severity: "LOW",
      description: `New user registration for ${normalizedEmail}`,
      email: normalizedEmail
    });

    // Create welcome notification
    insertUserNotification({
      owner_email: normalizedEmail,
      title: "Welcome to CV Optimizer! 👋",
      message: "Your account is created. Start by uploading or creating your first CV.",
      type: "info"
    });

    return res.json({ success: true, user: userSafe });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: "Missing login details." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const users = getAuthUsers();
    const found = users.find((u) => u.email === normalizedEmail);

    if (!found || found.passwordHash !== `plain:${password}`) {
      insertSecurityEvent({
        event_type: "LOGIN_FAILED",
        severity: "MEDIUM",
        description: `Failed login attempt for email: ${normalizedEmail}`,
        email: normalizedEmail
      });
      return res.status(401).json({ error: "Invalid email account or wrong credential passwords." });
    }

    if (found.status === "disabled") {
      insertSecurityEvent({
        event_type: "DISABLED_ACCOUNT_LOGIN",
        severity: "HIGH",
        description: `Login attempt on disabled account: ${normalizedEmail}`,
        email: normalizedEmail
      });
      return res.status(403).json({ error: "Your account has been disabled by an administrator." });
    }

    // Update last_login
    updateAuthUser(normalizedEmail, { last_login: new Date().toISOString() });

    // Track session
    const sessionRecord = insertUserSession({
      email: normalizedEmail,
      device_summary: "Chrome on Web Client"
    });

    // Log security event
    insertSecurityEvent({
      event_type: "USER_LOGIN_SUCCESS",
      severity: "LOW",
      description: `Successful user authentication for ${normalizedEmail}`,
      email: normalizedEmail
    });

    const { passwordHash: _, ...userSafe } = found;
    return res.json({ success: true, user: userSafe, session: sessionRecord });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
}

export async function updateProfile(req: Request, res: Response) {
  try {
    const { email, name, phone, location } = req.body || {};
    if (!email) return res.status(400).json({ error: "Email is required." });

    const updated = updateAuthUser(email, {
      name: name ? name.trim() : undefined,
      phone: phone ? phone.trim() : undefined,
      location: location ? location.trim() : undefined
    });

    if (updated) {
      const { passwordHash: _, ...userSafe } = updated;
      insertSecurityEvent({
        event_type: "PROFILE_UPDATED",
        severity: "LOW",
        description: `Profile information updated for ${email}`,
        email: email
      });
      return res.json({ success: true, user: userSafe });
    }
    return res.status(404).json({ error: "User account not found." });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
}

export async function changePassword(req: Request, res: Response) {
  try {
    const { email, currentPassword, newPassword } = req.body || {};
    if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({ error: "Missing required password change parameters." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const users = getAuthUsers();
    const found = users.find((u) => u.email === normalizedEmail);

    if (!found || found.passwordHash !== `plain:${currentPassword}`) {
      insertSecurityEvent({
        event_type: "PASSWORD_CHANGE_FAILED",
        severity: "HIGH",
        description: `Incorrect current password supplied during password update for ${normalizedEmail}`,
        email: normalizedEmail
      });
      return res.status(400).json({ error: "Current password does not match." });
    }

    updateAuthUser(normalizedEmail, { passwordHash: `plain:${newPassword}` });

    insertSecurityEvent({
      event_type: "PASSWORD_CHANGED",
      severity: "MEDIUM",
      description: `Password updated successfully for ${normalizedEmail}`,
      email: normalizedEmail
    });

    insertUserNotification({
      owner_email: normalizedEmail,
      title: "Password Changed 🔐",
      message: "Your account password was updated successfully.",
      type: "info"
    });

    return res.json({ success: true, message: "Password updated successfully." });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
}

export async function toggleMfa(req: Request, res: Response) {
  try {
    const { email, enable } = req.body || {};
    if (!email) return res.status(400).json({ error: "Email is required." });

    updateAuthUser(email, { mfa_enabled: !!enable });
    insertSecurityEvent({
      event_type: enable ? "MFA_ENABLED" : "MFA_DISABLED",
      severity: "MEDIUM",
      description: `Two-factor authentication ${enable ? 'enabled' : 'disabled'} for ${email}`,
      email: email
    });

    return res.json({
      success: true,
      mfa_enabled: !!enable,
      message: `2FA ${enable ? 'enabled' : 'disabled'} successfully.`
    });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
}
