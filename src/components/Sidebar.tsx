import React from 'react';
import { Sparkles, Send, Info, Lock } from 'lucide-react';

interface SidebarProps {
  activeTab: 'analyzer' | 'feedback' | 'about' | 'admin';
  setActiveTab: (tab: 'analyzer' | 'feedback' | 'about' | 'admin') => void;
  currentTime: string;
  feedbackLength: number;
  isAdminLoggedIn: boolean;
  loggedInUser: any;
  onLogout: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  currentTime,
  feedbackLength,
  isAdminLoggedIn,
  loggedInUser,
  onLogout
}: SidebarProps) {
  return (
    <aside className="w-64 bg-white dark:bg-[#0c111e] flex flex-col shrink-0 border-r border-slate-200/85 dark:border-[#1e293b]/90 transition-colors" id="app-sidebar">
      {/* Branding Header */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center font-black text-white dark:text-slate-900 shadow-md">
            C
          </div>
          <div>
            <span className="font-extrabold text-[#0c111e] dark:text-white text-base tracking-tight block uppercase leading-none">CV ENGINE</span>
            <span className="text-[9px] text-[#4f46e5] dark:text-[#a5b4fc] font-mono tracking-widest uppercase block mt-1.5 font-bold">ATS OPTIMIZER</span>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <button
          onClick={() => setActiveTab('analyzer')}
          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-150 cursor-pointer ${
            activeTab === 'analyzer'
              ? 'bg-[#0f172a] dark:bg-white text-white dark:text-slate-950 font-bold shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-4.5 h-4.5 shrink-0" />
            <span className="font-semibold text-sm">Resume Analyzer</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('feedback')}
          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-150 cursor-pointer ${
            activeTab === 'feedback'
              ? 'bg-[#0f172a] dark:bg-white text-white dark:text-slate-950 font-bold shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <Send className="w-4.5 h-4.5 shrink-0" />
            <span className="font-semibold text-sm">User Feedback</span>
          </div>
          {feedbackLength > 0 && (
            <span className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
              {feedbackLength}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('about')}
          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-150 cursor-pointer ${
            activeTab === 'about'
              ? 'bg-[#0f172a] dark:bg-white text-white dark:text-slate-950 font-bold shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <Info className="w-4.5 h-4.5 shrink-0" />
            <span className="font-semibold text-sm">About the Tool</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('admin')}
          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-150 cursor-pointer ${
            activeTab === 'admin'
              ? 'bg-[#0f172a] dark:bg-white text-white dark:text-slate-950 font-bold shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-105/60 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <Lock className="w-4.5 h-4.5 shrink-0" />
            <span className="font-semibold text-sm">Admin Terminal</span>
          </div>
          {isAdminLoggedIn && (
            <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block animate-ping"></span>
          )}
        </button>
      </nav>

      {/* User Session Profile block */}
      {loggedInUser && (
        <div className="p-4 mx-3 mb-2 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-[#1e293b] rounded-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-xs shrink-0 select-none">
              {loggedInUser.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{loggedInUser.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{loggedInUser.email}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full mt-3 py-1.5 bg-slate-200/50 hover:bg-rose-500/10 hover:text-rose-600 dark:bg-slate-850 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 text-slate-600 dark:text-slate-400 text-[10px] font-bold rounded-xl transition-all cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      )}

      {/* Mini stats card on Sidebar footer */}
      <div className="p-4 mt-auto">
        <div className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl p-4 border border-slate-200 dark:border-[#1e293b]">
          <p className="text-[9px] text-[#4f46e5] dark:text-[#a5b4fc] uppercase tracking-widest font-bold mb-1">SYSTEM TIME</p>
          <p className="text-xs text-slate-700 dark:text-slate-300 font-mono break-all font-semibold select-none">{currentTime}</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse"></span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">System Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
