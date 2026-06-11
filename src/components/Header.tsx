import React, { useState } from 'react';
import { Sun, Moon, AlertTriangle, X, Info } from 'lucide-react';

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
  const [showGuestPopup, setShowGuestPopup] = useState(false);

  return (
    <header className="h-16 bg-white dark:bg-[#0c111e] border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between px-8 z-20 shrink-0 transition-colors duration-200">
      <div className="flex items-center gap-4">
        <h1 className="text-base font-extrabold font-display tracking-tight text-slate-900 dark:text-slate-105 uppercase transition-colors">
          {activeTab === 'analyzer' && "Resume Analyzer"}
          {activeTab === 'feedback' && "Applicant Reviews & Feedback"}
          {activeTab === 'about' && "Under the Hood & NLP Details"}
          {activeTab === 'admin' && "Secure Administrator Control Center"}
        </h1>
      </div>

      <div className="flex items-center gap-4 relative">
        {/* Auth / Profile button */}
        {loggedInUser ? (
          <div className="flex items-center gap-3">
            <span className="text-[11px] bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 font-mono px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-900/50 font-bold select-none">
              Connected: {loggedInUser.email}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {/* Clickable Guest Mode Badge with hover info */}
            <div className="relative">
              <button
                onClick={() => setShowGuestPopup(!showGuestPopup)}
                onMouseEnter={() => setShowGuestPopup(true)}
                className="text-[11px] bg-amber-50 dark:bg-amber-950/10 text-amber-700 dark:text-amber-400 font-mono px-3 py-1.5 rounded-full border border-amber-250 dark:border-amber-900/40 hover:bg-amber-100/50 dark:hover:bg-amber-950/20 font-bold transition-all cursor-pointer flex items-center gap-1.5"
                aria-label="Guest mode summary"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>Guest Mode</span>
              </button>

              {/* absolute popup banner */}
              {showGuestPopup && (
                <div 
                  className="absolute right-0 mt-2.5 w-72 bg-white dark:bg-[#141c2f] rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-xl z-50 animate-fade-in text-slate-750 transition-all text-left"
                  onMouseLeave={() => setShowGuestPopup(false)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-450 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>Guest Session Restrictions</span>
                    </span>
                    <button 
                      onClick={() => setShowGuestPopup(false)}
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                    You are currently analyzing resumes in Guest Mode. Your processing history is stored locally in this browser. To securely synchronize, safeguard, and download past records across multiple devices, please sign up or bind your account details.
                  </p>
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => {
                        setShowGuestPopup(false);
                        onOpenAuth();
                      }}
                      className="text-[10px] font-extrabold bg-[#0f172a] hover:bg-slate-805 text-white dark:bg-white dark:text-slate-900 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                    >
                      Bind History Now
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={onOpenAuth}
              className="bg-[#0f172a] hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-105 text-white dark:text-slate-950 text-xs font-bold px-4 py-1.5 rounded-full transition-all cursor-pointer shadow-xs"
            >
              Sign In
            </button>
          </div>
        )}

        {/* Global Dark Mode Switch Toggle button */}
        <button
          onClick={onToggleDarkMode}
          className="p-1.5 rounded-full bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-300 transition-all cursor-pointer flex items-center justify-center border border-slate-200/60 dark:border-slate-800"
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
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0f172a] to-indigo-600/70 dark:from-white dark:to-slate-300 font-bold text-white dark:text-slate-900 flex items-center justify-center text-xs shadow-sm select-none">
            {loggedInUser ? loggedInUser.name.substring(0, 2).toUpperCase() : 'GS'}
          </div>
        </div>
      </div>
    </header>
  );
}
