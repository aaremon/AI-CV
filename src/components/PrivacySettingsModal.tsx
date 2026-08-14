import React, { useState, useEffect } from 'react';
import { ShieldCheck, X, Trash2, RefreshCw, Lock, Server, FileText, UserX, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface PrivacySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserEmail?: string;
  onDataDeleted?: () => void;
}

export default function PrivacySettingsModal({
  isOpen,
  onClose,
  currentUserEmail = '',
  onDataDeleted
}: PrivacySettingsModalProps) {
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [dataMinimizationEnabled, setDataMinimizationEnabled] = useState(true);
  const [deletingHistory, setDeletingHistory] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [showConfirmAccountDelete, setShowConfirmAccountDelete] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchAuditLogs();
    }
  }, [isOpen, currentUserEmail]);

  const fetchAuditLogs = async () => {
    setLoadingLogs(true);
    try {
      const emailQuery = currentUserEmail ? `?email=${encodeURIComponent(currentUserEmail)}` : '';
      const res = await fetch(`/api/privacy/audit${emailQuery}`);
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data.logs || []);
      }
    } catch (err) {
      console.warn("Failed to load privacy audit logs:", err);
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleDeleteHistory = async () => {
    if (!currentUserEmail) {
      setStatusMessage({ type: 'error', text: 'Please sign in to clear user-specific AI history.' });
      return;
    }
    setDeletingHistory(true);
    try {
      const res = await fetch(`/api/user/ai-history?email=${encodeURIComponent(currentUserEmail)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const data = await res.json();
        setStatusMessage({ type: 'success', text: data.message || 'AI processing history cleared successfully.' });
        fetchAuditLogs();
        if (onDataDeleted) onDataDeleted();
      } else {
        setStatusMessage({ type: 'error', text: 'Failed to clear AI processing history.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error occurred while clearing history.' });
    } finally {
      setDeletingHistory(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentUserEmail) {
      setStatusMessage({ type: 'error', text: 'Please sign in to delete account.' });
      return;
    }
    setDeletingAccount(true);
    try {
      const res = await fetch('/api/user/account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentUserEmail })
      });
      if (res.ok) {
        setStatusMessage({ type: 'success', text: 'Your account and all associated CV data have been permanently deleted.' });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setStatusMessage({ type: 'error', text: 'Failed to delete user account.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Account deletion failed.' });
    } finally {
      setDeletingAccount(false);
      setShowConfirmAccountDelete(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Privacy & AI Data Settings</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Server-side PII sanitization and zero-data retention policy
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {statusMessage && (
          <div className={`p-3.5 rounded-2xl text-xs flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-800 dark:text-rose-300'
          }`}>
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Mandatory Privacy Policy Card */}
        <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white">
              <Server className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              <span>AI Data Minimization Layer</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Active & Enforced
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            All requests sent to Google Gemini pass through server-side PII detection. Contact numbers, email addresses, dates of birth, street locations, government IDs, and profile images are automatically redacted before AI processing.
          </p>
        </div>

        {/* Privacy Audit Log */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-violet-500" />
              <span>Recent AI Privacy Audit Logs</span>
            </h3>
            <button
              onClick={fetchAuditLogs}
              disabled={loadingLogs}
              className="text-[11px] text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${loadingLogs ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 max-h-48 overflow-y-auto space-y-2 text-xs font-mono">
            {auditLogs.length === 0 ? (
              <p className="text-slate-400 text-center py-4 italic text-[11px]">
                No privacy audit records found.
              </p>
            ) : (
              auditLogs.slice().reverse().map((log, idx) => (
                <div key={log.id ? `priv-audit-${log.id}` : `priv-audit-${idx}`} className="p-2.5 rounded-xl bg-white dark:bg-[#182235] border border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-violet-600 dark:text-violet-400 mr-2">
                      [{log.feature}]
                    </span>
                    <span className="text-slate-600 dark:text-slate-300">
                      {log.piiDetected ? `Anonymized ${log.removedCategories?.length || 0} PII fields (${(log.removedCategories || []).join(', ') || 'contact metadata'})` : 'Zero raw PII detected'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* User Data Controls */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            User Data Controls
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleDeleteHistory}
              disabled={deletingHistory}
              className="flex items-center justify-center gap-2 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
            >
              <Trash2 className="w-4 h-4 text-slate-500" />
              <span>{deletingHistory ? 'Clearing History...' : 'Delete My CVs & AI History'}</span>
            </button>

            <button
              onClick={() => setShowConfirmAccountDelete(true)}
              className="flex items-center justify-center gap-2 p-3 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-400 font-semibold text-xs transition-colors"
            >
              <UserX className="w-4 h-4" />
              <span>Delete Account & All Data</span>
            </button>
          </div>
        </div>

        {/* Confirmation Modal for Account Deletion */}
        {showConfirmAccountDelete && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 space-y-3 animate-fade-in">
            <div className="flex items-center gap-2 text-rose-800 dark:text-rose-200 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Confirm Account & Data Eradication</span>
            </div>
            <p className="text-xs text-rose-700 dark:text-rose-300">
              This will permanently delete your user account ({currentUserEmail || 'current session'}), all stored CV analysis records, and your privacy audit history. This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowConfirmAccountDelete(false)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deletingAccount}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs"
              >
                {deletingAccount ? 'Deleting...' : 'Confirm Erase Everything'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
