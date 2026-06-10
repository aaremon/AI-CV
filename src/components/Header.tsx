import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface HeaderProps {
  activeTab: 'analyzer' | 'feedback' | 'about' | 'admin';
  loggedInUser: any;
  onOpenAuth: () => void;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function Header({
  activeTab,
  loggedInUser,
  onOpenAuth,
  onLogout,
  darkMode,
  onToggleDarkMode
}: HeaderProps) {
  return (
    <header className="h-16 bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 z-10 shrink-0 transition-colors duration-200">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold font-display tracking-tight text-slate-800 dark:text-slate-100 uppercase transition-colors">
          {activeTab === 'analyzer' && "✨ AI-Powered ATS Optimizer"}
          {activeTab === 'feedback' && "💬 Applicant Reviews & Feedback"}
          {activeTab === 'about' && "ℹ️ Under the Hood & NLP Details"}
          {activeTab === 'admin' && "🔐 Secure Administrator Control Center"}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Auth / Profile button */}
        {loggedInUser ? (
          <div className="flex items-center gap-3">
            <span className="text-xs bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 font-mono px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-900/50 font-medium select-none">
              👤 Bound Account: {loggedInUser.email}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 font-mono px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-900/50 font-medium select-none mr-2">
              ⚠️ Running in Guest Mode (History not synced)
            </span>
            <button
              onClick={onOpenAuth}
              className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              Sign Up / Sign In
            </button>
          </div>
        )}

        {/* Global Dark Mode Switch Toggle button */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-650 dark:text-slate-300 transition-all cursor-pointer flex items-center justify-center border border-slate-200/60 dark:border-slate-700/60"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          id="dark-mode-toggle"
        >
          {darkMode ? (
            <Sun className="w-4 h-4 text-amber-500" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600" />
          )}
        </button>

        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1"></div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-700 font-bold text-white flex items-center justify-center text-sm shadow-sm select-none">
            {loggedInUser ? loggedInUser.name.substring(0, 2).toUpperCase() : 'Guest'}
          </div>
        </div>
      </div>
    </header>
  );
}
