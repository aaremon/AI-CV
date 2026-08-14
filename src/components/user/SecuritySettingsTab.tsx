import React, { useState, useEffect } from 'react';
import {
  Shield,
  KeyRound,
  User,
  Smartphone,
  Lock,
  History,
  Trash2,
  AlertTriangle,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  LogOut,
  Sparkles,
  Server,
  RefreshCw
} from 'lucide-react';

interface SecuritySettingsTabProps {
  loggedInUser: any;
  onLogout: () => void;
  onProfileUpdated?: (updatedUser: any) => void;
}

export default function SecuritySettingsTab({
  loggedInUser,
  onLogout,
  onProfileUpdated
}: SecuritySettingsTabProps) {
  // Profile State
  const [name, setName] = useState(loggedInUser?.name || '');
  const [phone, setPhone] = useState(loggedInUser?.phone || '');
  const [location, setLocation] = useState(loggedInUser?.location || '');
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Active Sessions & Security Log
  const [sessions, setSessions] = useState<any[]>([]);
  const [securityEvents, setSecurityEvents] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Deletion Modals
  const [showClearAiModal, setShowClearAiModal] = useState(false);
  const [showWipeDataModal, setShowWipeDataModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  const [confirmWipePhrase, setConfirmWipePhrase] = useState('');
  const [wipePassword, setWipePassword] = useState('');
  const [deleteAccountPassword, setDeleteAccountPassword] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    fetchSecurityData();
  }, [loggedInUser?.email]);

  const fetchSecurityData = async () => {
    if (!loggedInUser?.email) return;
    setLoadingData(true);
    try {
      const email = encodeURIComponent(loggedInUser.email);
      const [sessRes, secRes] = await Promise.all([
        fetch(`/api/user/sessions?email=${email}`),
        fetch(`/api/user/security-activity?email=${email}`)
      ]);
      const sessData = await sessRes.json();
      const secData = await secRes.json();

      setSessions(sessData.sessions || []);
      setSecurityEvents(secData.events || []);
    } catch (err) {
      console.error("Error fetching security settings data:", err);
    } fontally: {
      setLoadingData(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loggedInUser.email, name, phone, location })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProfileMsg({ type: 'success', text: 'Profile information updated successfully.' });
        if (onProfileUpdated) onProfileUpdated(data.user);
      } else {
        setProfileMsg({ type: 'error', text: data.error || 'Failed to update profile.' });
      }
    } catch (err) {
      setProfileMsg({ type: 'error', text: 'Network error updating profile.' });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);
    if (newPassword !== confirmPassword) {
      setPwMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setPwMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loggedInUser.email,
          currentPassword,
          newPassword
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPwMsg({ type: 'success', text: 'Password updated successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPwMsg({ type: 'error', text: data.error || 'Password update failed.' });
      }
    } catch (err) {
      setPwMsg({ type: 'error', text: 'Error changing password.' });
    }
  };

  const handleRevokeSession = async (sessionId: number) => {
    try {
      const res = await fetch('/api/user/sessions/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loggedInUser.email, sessionId })
      });
      if (res.ok) {
        setSessions(prev => prev.filter(s => s.id !== sessionId));
      }
    } catch (err) {
      console.error("Revoke session error:", err);
    }
  };

  const handleRevokeOtherSessions = async () => {
    try {
      const res = await fetch('/api/user/sessions/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loggedInUser.email, revokeAllOthers: true })
      });
      if (res.ok) {
        setSessions(prev => prev.slice(0, 1)); // keep current
      }
    } catch (err) {
      console.error("Revoke all sessions error:", err);
    }
  };

  const handleClearAiHistory = async () => {
    try {
      const email = encodeURIComponent(loggedInUser.email);
      const res = await fetch(`/api/user/ai-history?email=${email}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setShowClearAiModal(false);
        fetchSecurityData();
      }
    } catch (err) {
      console.error("Clear AI history failed:", err);
    }
  };

  const handleWipeAllData = async () => {
    setActionError(null);
    if (confirmWipePhrase !== "DELETE MY DATA") {
      setActionError('Please type "DELETE MY DATA" exactly.');
      return;
    }
    try {
      const res = await fetch('/api/user/all-data', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loggedInUser.email,
          confirmPhrase: confirmWipePhrase,
          password: wipePassword
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setShowWipeDataModal(false);
        fetchSecurityData();
      } else {
        setActionError(data.error || 'Data deletion failed. Verify password.');
      }
    } catch (err) {
      setActionError('Network error performing data wipe.');
    }
  };

  const handleDeleteAccount = async () => {
    setActionError(null);
    try {
      const res = await fetch('/api/user/account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loggedInUser.email,
          password: deleteAccountPassword
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onLogout();
      } else {
        setActionError(data.error || 'Account deletion failed.');
      }
    } catch (err) {
      setActionError('Network error deleting account.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Shield className="w-6 h-6 text-emerald-500" />
            Privacy & Security Control Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your account credentials, active sessions, security logs, and AI data deletion rights.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800">
            <Check className="w-3.5 h-3.5" />
            <span>Privacy Guard Enabled</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile & Credentials */}
        <div className="lg:col-span-2 space-y-8">
          {/* Account Profile Section */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <User className="w-4 h-4 text-indigo-500" />
              Account Profile
            </h2>

            {profileMsg && (
              <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                profileMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300' : 'bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
              }`}>
                {profileMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{profileMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={loggedInUser?.email || ''}
                    disabled
                    className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1-800-555-0199"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all cursor-pointer shadow-md"
              >
                Save Profile Changes
              </button>
            </form>
          </div>

          {/* Password Change Section */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <KeyRound className="w-4 h-4 text-purple-500" />
              Change Password
            </h2>

            {pwMsg && (
              <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                pwMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300' : 'bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
              }`}>
                {pwMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{pwMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPw ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPw(!showCurrentPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPw ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPw(!showNewPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all cursor-pointer shadow-md"
              >
                Update Password
              </button>
            </form>
          </div>

          {/* Active Sessions */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-blue-500" />
                Active Web Sessions
              </h2>

              <button
                onClick={handleRevokeOtherSessions}
                className="text-xs text-rose-600 dark:text-rose-400 font-semibold hover:underline"
              >
                Revoke All Other Sessions
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Current Web Browser Session</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 text-[10px] font-extrabold">
                      Active Now
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                    127.0.0.x (Hashed IP) • Chrome / Linux Sandbox
                  </span>
                </div>
              </div>

              {sessions.slice(1).map((sess, idx) => (
                <div key={sess.id ? `sess-${sess.id}` : `sess-${idx}`} className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">{sess.device_summary}</span>
                    <span className="text-slate-400 text-[10px]">Started: {new Date(sess.created_at).toLocaleDateString()}</span>
                  </div>
                  <button
                    onClick={() => handleRevokeSession(sess.id)}
                    className="px-3 py-1 bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 font-bold text-[11px] rounded-lg hover:bg-rose-100 transition-all"
                  >
                    Revoke
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Security Controls & Data Rights */}
        <div className="space-y-8">
          {/* Security Log */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <History className="w-4 h-4 text-amber-500" />
              Security Activity History
            </h3>

            <div className="space-y-2.5 max-h-60 overflow-y-auto">
              {securityEvents.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No recent security events logged.</p>
              ) : (
                securityEvents.slice(0, 5).map((ev, idx) => (
                  <div key={ev.id ? `user-sec-ev-${ev.id}` : `user-sec-ev-${idx}`} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-[11px] space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-900 dark:text-white">{ev.event_type}</span>
                      <span className="text-slate-400 font-mono text-[10px]">
                        {new Date(ev.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400">{ev.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Data Rights & Erasure Zone */}
          <div className="bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-900 rounded-3xl p-6 border border-rose-900/30 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-rose-400 flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-500" />
              Privacy Rights & Data Removal
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Exercise your legal privacy rights to clear AI activity logs, erase personal data, or delete your account.
            </p>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => setShowClearAiModal(true)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer text-left px-4 flex items-center justify-between"
              >
                <span>Clear AI History & Scans</span>
                <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setShowWipeDataModal(true)}
                className="w-full py-2.5 bg-rose-900/40 hover:bg-rose-900/60 text-rose-300 text-xs font-bold rounded-xl transition-all cursor-pointer text-left px-4 flex items-center justify-between border border-rose-800/50"
              >
                <span>Complete Personal Data Erase</span>
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              </button>

              <button
                onClick={() => setShowDeleteAccountModal(true)}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
              >
                Permanently Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Clear AI History Modal */}
      {showClearAiModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-center">
            <RefreshCw className="w-8 h-8 text-indigo-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Clear AI History?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              This will remove all stored CV analysis logs and AI processing records from your profile.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowClearAiModal(false)}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAiHistory}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Confirm Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wipe All Data Modal */}
      {showWipeDataModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="text-center space-y-2">
              <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Full Personal Data Erasure</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                To confirm permanent deletion of all CVs, cover letters, and history, type <span className="font-mono font-bold text-rose-500">DELETE MY DATA</span> below.
              </p>
            </div>

            {actionError && (
              <div className="p-2.5 bg-rose-50 dark:bg-rose-950/80 text-rose-600 text-xs font-semibold rounded-xl text-center">
                {actionError}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <input
                type="text"
                value={confirmWipePhrase}
                onChange={(e) => setConfirmWipePhrase(e.target.value)}
                placeholder='Type "DELETE MY DATA"'
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-rose-500"
              />

              <input
                type="password"
                value={wipePassword}
                onChange={(e) => setWipePassword(e.target.value)}
                placeholder="Enter password to authenticate"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowWipeDataModal(false)}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleWipeAllData}
                disabled={confirmWipePhrase !== "DELETE MY DATA" || !wipePassword}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Erase All Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-center">
            <Trash2 className="w-8 h-8 text-rose-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete Account Permanently?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your account and all associated documents will be permanently removed. Enter your password to proceed.
            </p>

            {actionError && (
              <div className="p-2.5 bg-rose-50 text-rose-600 text-xs font-semibold rounded-xl">
                {actionError}
              </div>
            )}

            <input
              type="password"
              value={deleteAccountPassword}
              onChange={(e) => setDeleteAccountPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowDeleteAccountModal(false)}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={!deleteAccountPassword}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
