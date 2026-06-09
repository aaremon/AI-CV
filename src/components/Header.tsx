import React from 'react';

interface HeaderProps {
  activeTab: 'analyzer' | 'feedback' | 'about' | 'admin' | 'python';
  loggedInUser: any;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export default function Header({
  activeTab,
  loggedInUser,
  onOpenAuth,
  onLogout
}: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10 shrink-0">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold font-display tracking-tight text-slate-800 uppercase">
          {activeTab === 'analyzer' && "✨ AI-Powered ATS Optimizer"}
          {activeTab === 'feedback' && "💬 Applicant Reviews & Feedback"}
          {activeTab === 'about' && "ℹ️ Under the Hood & NLP Details"}
          {activeTab === 'admin' && "🔐 Secure Administrator Control Center"}
          {activeTab === 'python' && "🐍 Python Streamlit Equivalent Sandbox"}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Auth / Profile button */}
        {loggedInUser ? (
          <div className="flex items-center gap-3">
            <span className="text-xs bg-emerald-50 text-emerald-700 font-mono px-3 py-1.5 rounded-lg border border-emerald-200 font-medium select-none">
              👤 Bound Account: {loggedInUser.email}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs bg-amber-50 text-amber-700 font-mono px-3 py-1.5 rounded-lg border border-amber-200 font-medium select-none mr-2">
              ⚠️ Running in Guest Mode (History not synced)
            </span>
            <button
              onClick={onOpenAuth}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              Sign Up / Sign In
            </button>
          </div>
        )}

        <div className="w-px h-6 bg-slate-200 mx-1"></div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">DEVELOPER CREDIT</p>
            <a
              href="https://dnoobnerd.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-indigo-600 hover:underline block -mt-0.5"
            >
              Deepak Padhi
            </a>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-700 font-bold text-white flex items-center justify-center text-sm shadow-sm select-none">
            {loggedInUser ? loggedInUser.name.substring(0, 2).toUpperCase() : 'Guest'}
          </div>
        </div>
      </div>
    </header>
  );
}
