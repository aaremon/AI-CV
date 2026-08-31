import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { NavTabType } from './Navbar';

interface TopHeaderProps {
  activeTab: NavTabType;
  setActiveTab: (tab: NavTabType) => void;
  isAdminLoggedIn: boolean;
  loggedInUser: any;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAuth: () => void;
  onOpenPrivacySettings?: () => void;
}

export default function TopHeader({
  activeTab,
  setActiveTab,
  isAdminLoggedIn,
  loggedInUser,
  darkMode,
  onToggleDarkMode,
  onOpenAuth,
  onOpenPrivacySettings
}: TopHeaderProps) {
  return (
    <header className="hidden md:flex items-center justify-between px-6 py-3 bg-white/80 dark:bg-[#0c111e]/80 backdrop-blur-md border-b border-slate-200/70 dark:border-slate-850/80 shrink-0 select-none z-20">
      {/* Left breadcrumb / active context info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-200 capitalize">
            {activeTab === 'ats' ? 'ATS Scanner' : activeTab.replace(/_/g, ' ')}
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-medium">
            Mero Match Engine
          </span>
        </div>
      </div>

      {/* Right Corner Controls: Theme Switcher */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleDarkMode}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
        </button>
      </div>
    </header>
  );
}
