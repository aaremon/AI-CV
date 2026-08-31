import React, { useState } from 'react';
import {
  Menu,
  X,
  Sun,
  Moon,
  Send,
  Info,
  AlertTriangle,
  LogOut,
  Home,
  Presentation,
  LayoutDashboard,
  FileText,
  Gauge,
  MailCheck,
  Linkedin,
  UserCheck,
  Shield,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Bell,
  Settings,
  HelpCircle,
  Grid,
  Share2,
  Layers,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';
import logo from '../assets/images/mero_match_exact_logo_1782115392578.jpg';

export type NavTabType =
  | 'dashboard'
  | 'my_cvs'
  | 'generated_docs'
  | 'privacy_security'
  | 'builder'
  | 'ats'
  | 'cover_letter'
  | 'linkedin'
  | 'bio'
  | 'emails'
  | 'slides'
  | 'feedback'
  | 'about'
  | 'admin';

interface NavbarProps {
  activeTab: NavTabType;
  setActiveTab: (tab: NavTabType) => void;
  currentTime: string;
  feedbackLength: number;
  isAdminLoggedIn: boolean;
  loggedInUser: any;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAuth: () => void;
  onGoHome: () => void;
  onOpenPrivacySettings?: () => void;
}

interface NavGroup {
  category: string;
  items: {
    id: NavTabType;
    label: string;
    icon: React.ComponentType<any>;
    badge?: number;
    dot?: boolean;
  }[];
}

export default function Navbar({
  activeTab,
  setActiveTab,
  currentTime,
  feedbackLength,
  isAdminLoggedIn,
  loggedInUser,
  onLogout,
  darkMode,
  onToggleDarkMode,
  onOpenAuth,
  onGoHome,
  onOpenPrivacySettings
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showGuestPopup, setShowGuestPopup] = useState(false);
  const [paneExpanded, setPaneExpanded] = useState(true);

  const navGroups: NavGroup[] = [
    {
      category: 'CORE TOOLS',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'builder', label: 'CV Builder', icon: FileText },
        { id: 'ats', label: 'ATS Scanner', icon: Gauge },
        { id: 'cover_letter', label: 'Cover Letter', icon: MailCheck },
      ]
    },
    {
      category: 'MY WORKSPACE',
      items: [
        { id: 'my_cvs', label: 'My Resumes', icon: Layers },
        { id: 'generated_docs', label: 'Saved Documents', icon: Sparkles },
      ]
    },
    {
      category: 'CAREER AGENTS',
      items: [
        { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
        { id: 'bio', label: 'Bio Generator', icon: UserCheck },
        { id: 'emails', label: 'Outreach Emails', icon: Send },
      ]
    }
  ];

  const handleNavClick = (tabId: NavTabType) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const supabaseActive = isSupabaseConfigured();

  // Find icon component for active item or category items
  const allNavItems = navGroups.flatMap(g => g.items);

  return (
    <>
      {/* MOBILE TOP BAR (visible on screens < md) */}
      <header className="md:hidden sticky top-0 z-40 w-full bg-white dark:bg-[#0c111e] border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
        <button
          onClick={onGoHome}
          className="flex items-center gap-2 text-left cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-white">
            <img src={logo} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
          </div>
          <div>
            <span className="font-black text-xs text-slate-900 dark:text-white uppercase tracking-tight block leading-tight">
              Mero Match
            </span>
            <span className="text-[9px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
              Hub
            </span>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleDarkMode}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* MOBILE DRAWER OVERLAY */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col">
          <div className="bg-white dark:bg-[#0c111e] w-4/5 max-w-xs h-full p-5 space-y-6 overflow-y-auto shadow-2xl border-r border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center">
                  MM
                </div>
                <div>
                  <span className="font-black text-xs text-slate-900 dark:text-white uppercase block tracking-wider">Mero Match</span>
                </div>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              {navGroups.map((group) => (
                <div key={group.category} className="space-y-1.5">
                  <div className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase px-2">
                    {group.category}
                  </div>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[9px] bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold px-1.5 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <button
                onClick={onGoHome}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl"
              >
                <Home className="w-4 h-4" />
                <span>Landing Page</span>
              </button>
              {loggedInUser ? (
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-2 text-xs">
                  <div className="font-bold text-slate-800 dark:text-slate-200 truncate">{loggedInUser.email}</div>
                  <button onClick={onLogout} className="text-rose-600 font-bold flex items-center gap-1 text-[11px]">
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="w-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-xs py-2.5 rounded-xl text-center"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP DUAL-PANE SIDEBAR (visible on screens >= md) */}
      <aside className="hidden md:flex shrink-0 h-screen bg-white dark:bg-[#0c111e] border-r border-slate-200/80 dark:border-slate-800/80 select-none z-30 transition-all duration-200">
        
        {/* PANE 1: NARROW ICON DOCK BAR (~64px) */}
        <div className="w-16 h-full flex flex-col justify-between items-center py-4 border-r border-slate-200/60 dark:border-slate-850 bg-white dark:bg-[#0c111e]">
          
          {/* Top Logo Badge (Matching Mero Match exact branding) */}
          <div className="flex flex-col items-center space-y-4">
            <button
              onClick={onGoHome}
              className="group flex flex-col items-center cursor-pointer"
              title="Mero Match Hub"
            >
              <div className="w-10 h-10 rounded-2xl bg-white dark:bg-white p-1 border border-slate-200 dark:border-slate-700 shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center overflow-hidden">
                <img src={logo} alt="Mero Match Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              </div>
            </button>

            {/* Vertical Stack of Core Icon Buttons */}
            <div className="space-y-1.5 pt-2">
              {allNavItems.slice(0, 4).map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer relative group ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200/80 dark:border-indigo-800/80 shadow-xs'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    title={item.label}
                  >
                    <Icon className="w-4 h-4" />
                    {/* Tooltip on hover */}
                    <span className="absolute left-14 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Stack Icons (Matching image bottom bell, apps, webhooks, settings, account) */}
          <div className="flex flex-col items-center space-y-2">
            
            {/* Toggle Pane Expanded / Collapsed */}
            <button
              onClick={() => setPaneExpanded(!paneExpanded)}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-850 transition-all cursor-pointer"
              title={paneExpanded ? "Collapse Sidebar Menu" : "Expand Sidebar Menu"}
            >
              {paneExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>

            {/* Theme Switcher */}
            <button
              onClick={onToggleDarkMode}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 transition-all cursor-pointer"
              title={darkMode ? "Light Mode" : "Dark Mode"}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>

            {/* Privacy & AI Data Settings Button */}
            {onOpenPrivacySettings && (
              <button
                onClick={onOpenPrivacySettings}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-all cursor-pointer relative group"
                title="Privacy & AI Data Controls"
              >
                <Shield className="w-4 h-4" />
                <span className="absolute left-14 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  Privacy & AI Data
                </span>
              </button>
            )}

            {/* Profile Avatar / User Button (Matching image cat avatar circle) */}
            <button
              onClick={loggedInUser ? onLogout : onOpenAuth}
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-900 to-indigo-600 text-white font-black text-[10px] flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-xs cursor-pointer hover:scale-105 transition-transform"
              title={loggedInUser ? `Logged in: ${loggedInUser.email} (Click to Sign Out)` : "Sign In Session"}
            >
              {loggedInUser ? loggedInUser.name.substring(0, 2).toUpperCase() : 'GS'}
            </button>
          </div>
        </div>

        {/* PANE 2: EXPANDABLE CATEGORIES & SUB-MENU PANE (~210px) */}
        {paneExpanded && (
          <div className="w-52 h-full flex flex-col justify-between p-4 bg-[#F8FAFC]/90 dark:bg-[#0c111e] overflow-y-auto border-r border-slate-200/60 dark:border-slate-850 animate-fade-in">
            
            {/* Top Workspace / Brand Header */}
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-200/70 dark:border-slate-800/80">
                <div className="flex items-center justify-between cursor-pointer group" onClick={onGoHome}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white dark:bg-white p-1 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-center shrink-0">
                      <img src={logo} alt="Mero Match" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1">
                        <span>MERO MATCH</span>
                        <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
                      </h2>
                    </div>
                  </div>
                </div>
              </div>

              {/* Categorized Menu Groups */}
              <div className="space-y-5">
                {navGroups.map((group) => (
                  <div key={group.category} className="space-y-1">
                    {/* Small uppercase category header (Matching image SCHEDULE, CUSTOM VIEWS, DEFAULT VIEW) */}
                    <div className="text-[10px] font-mono font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase px-2 mb-1 flex items-center justify-between">
                      <span>{group.category}</span>
                    </div>

                    {/* Navigation Items */}
                    <div className="space-y-0.5">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleNavClick(item.id)}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                              isActive
                                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200/60 dark:border-indigo-800/60 shadow-2xs'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white font-medium'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Icon className="w-3.5 h-3.5 shrink-0" />
                              <span>{item.label}</span>
                            </div>
                            {item.badge !== undefined && (
                              <span className="text-[9px] font-mono font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.2 rounded-md">
                                {item.badge}
                              </span>
                            )}
                            {item.dot && (
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Footer User & Status Banner */}
            <div className="pt-3 border-t border-slate-200/70 dark:border-slate-800/80 space-y-2">
              {loggedInUser ? (
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 text-[11px] space-y-1">
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">Account Active</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 truncate">{loggedInUser.email}</div>
                  <button
                    onClick={onLogout}
                    className="text-rose-600 dark:text-rose-400 hover:underline text-[10px] font-bold flex items-center gap-1 cursor-pointer pt-0.5"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <button
                    onClick={onOpenAuth}
                    className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold py-1.5 px-3 rounded-lg transition-all cursor-pointer text-center"
                  >
                    Sign In / Register
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

      </aside>
    </>
  );
}
