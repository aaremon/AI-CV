import React from 'react';
import { Sparkles, Send, Info, Lock, Code } from 'lucide-react';

interface SidebarProps {
  activeTab: 'analyzer' | 'feedback' | 'about' | 'admin' | 'python';
  setActiveTab: (tab: 'analyzer' | 'feedback' | 'about' | 'admin' | 'python') => void;
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
    <aside className="w-64 bg-[#1E293B] flex flex-col shrink-0 border-r border-[#334155]" id="app-sidebar">
      {/* Branding Header */}
      <div className="p-6">
        <div className="flex items-center gap-3 text-white">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center font-extrabold text-xl shadow-lg shadow-indigo-600/30">
            R
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight block">RESUMÉ</span>
            <span className="text-[10px] text-indigo-400 font-mono tracking-widest uppercase block -mt-1 font-semibold">AI ANALYZER</span>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <button
          onClick={() => setActiveTab('analyzer')}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-150 cursor-pointer ${
            activeTab === 'analyzer'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
              : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium text-sm">Resume Analyzer</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('feedback')}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-150 cursor-pointer ${
            activeTab === 'feedback'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
              : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <Send className="w-5 h-5" />
            <span className="font-medium text-sm">User Feedback</span>
          </div>
          {feedbackLength > 0 && (
            <span className="bg-[#334155] text-indigo-300 text-[11px] px-2 py-0.5 rounded-full font-bold">
              {feedbackLength}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('python')}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-150 cursor-pointer ${
            activeTab === 'python'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/10'
              : 'text-slate-400 hover:bg-slate-800/50 hover:text-white animate-pulse'
          }`}
        >
          <div className="flex items-center gap-3">
            <Code className="w-5 h-5 text-emerald-400" />
            <span className="font-medium text-sm">Python (.py) Code</span>
          </div>
          <span className="bg-emerald-950/40 text-emerald-300 text-[9px] px-2 py-0.5 rounded-full font-mono font-bold tracking-tight border border-emerald-500/20">
            STREAMLIT
          </span>
        </button>

        <button
          onClick={() => setActiveTab('about')}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-150 cursor-pointer ${
            activeTab === 'about'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
              : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5" />
            <span className="font-medium text-sm">About the Tool</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('admin')}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-150 cursor-pointer ${
            activeTab === 'admin'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
              : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5" />
            <span className="font-medium text-sm">Admin Terminal</span>
          </div>
          {isAdminLoggedIn && (
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
          )}
        </button>
      </nav>

      {/* User Session Profile block */}
      {loggedInUser && (
        <div className="p-4 mx-3 mb-2 bg-[#1e293b] border border-slate-700/60 rounded-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-bold text-xs shrink-0 select-none">
              {loggedInUser.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{loggedInUser.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{loggedInUser.email}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full mt-3 py-1.5 bg-slate-800/80 hover:bg-rose-500/10 hover:text-rose-400 text-slate-400 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      )}

      {/* Mini stats card on Sidebar footer */}
      <div className="p-4 mt-auto">
        <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/50">
          <p className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold mb-1">CURRENT TIME</p>
          <p className="text-xs text-white font-mono break-all font-semibold select-none">{currentTime} UTC</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block animate-pulse"></span>
            <span className="text-[10px] text-slate-400 font-mono">System Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
