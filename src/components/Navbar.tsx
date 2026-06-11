import React, { useState } from 'react';
import { Menu, X, Sun, Moon, Sparkles, Send, Info, Lock, AlertTriangle, LogOut, Home } from 'lucide-react';

interface NavbarProps {
  activeTab: 'analyzer' | 'feedback' | 'about' | 'admin';
  setActiveTab: (tab: 'analyzer' | 'feedback' | 'about' | 'admin') => void;
  currentTime: string;
  feedbackLength: number;
  isAdminLoggedIn: boolean;
  loggedInUser: any;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAuth: () => void;
  onGoHome: () => void;
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
  onGoHome
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showGuestPopup, setShowGuestPopup] = useState(false);

  interface NavItem {
    id: 'analyzer' | 'feedback' | 'about' | 'admin';
    label: string;
    icon: React.ComponentType<any>;
    badge?: number;
    dot?: boolean;
  }

  const navItems: NavItem[] = [
    { id: 'analyzer', label: 'Resume Analyzer', icon: Sparkles },
    { id: 'feedback', label: 'Reviews & Feedback', icon: Send, badge: feedbackLength > 0 ? feedbackLength : undefined },
    { id: 'about', label: 'NLP Details', icon: Info },
    { id: 'admin', label: 'Admin Terminal', icon: Lock, dot: isAdminLoggedIn }
  ];

  const handleNavClick = (tabId: 'analyzer' | 'feedback' | 'about' | 'admin') => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 w-full z-40 bg-white/95 dark:bg-[#0c111e]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo & Home Button */}
          <button
            onClick={onGoHome}
            className="flex items-center gap-2.5 group cursor-pointer text-left focus:outline-none"
            title="Go to Homepage"
            id="brand-home-button"
          >
            <div className="w-8.5 h-8.5 bg-slate-900 group-hover:bg-indigo-600 dark:bg-white dark:group-hover:bg-slate-100 rounded-full flex items-center justify-center font-black text-white dark:text-slate-900 shadow-sm transition-all transform group-hover:scale-105">
              <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
            </div>
            <div>
              <span className="font-black text-[#0c111e] dark:text-white text-base tracking-tight block uppercase leading-none">
                Mero Match
              </span>
              <span className="text-[9px] text-[#4f46e5] dark:text-indigo-400 font-mono tracking-widest uppercase block mt-1 font-bold">
                Home Dashboard
              </span>
            </div>
          </button>

          {/* Desktop Navigation Menu Links */}
          <div className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-900/40 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  id={`nav-link-${item.id}`}
                >
                  <IconComponent className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                  {item.dot && (
                    <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block animate-pulse"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* User Auth, Theme Switch & Mobile Hamburger controls */}
          <div className="flex items-center gap-3">
            
            {/* Desktop Auth and details view */}
            <div className="hidden md:flex items-center gap-3">
              {loggedInUser ? (
                <div className="flex items-center gap-3">
                  <span className="text-[11px] bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 font-mono px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-900/50 font-bold select-none">
                    Connected: {loggedInUser.email}
                  </span>
                  
                  {/* Quick logout button */}
                  <button
                    onClick={onLogout}
                    className="p-1.5 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                    title="Sign Out Session"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 relative">
                  {/* Guest Session Popup Trigger */}
                  <button
                    onClick={() => setShowGuestPopup(!showGuestPopup)}
                    className="text-[11px] bg-amber-50 dark:bg-amber-950/10 text-amber-700 dark:text-amber-400 font-mono px-3 py-1.5 rounded-full border border-amber-250 dark:border-amber-900/45 hover:bg-amber-100/50 dark:hover:bg-amber-950/20 font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    <span>Guest Mode</span>
                  </button>

                  {showGuestPopup && (
                    <div 
                      className="absolute right-0 top-10 w-72 bg-white dark:bg-[#141c2f] rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-xl z-50 animate-fade-in text-slate-750 transition-all text-left"
                      onMouseLeave={() => setShowGuestPopup(false)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-450 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>Guest Session Storage</span>
                        </span>
                        <button 
                          onClick={() => setShowGuestPopup(false)}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                        Your resume submissions are currently saved locally. Register to secure, review, and synchronized analysis history across all devices.
                      </p>
                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={() => {
                            setShowGuestPopup(false);
                            onOpenAuth();
                          }}
                          className="text-[10px] font-extrabold bg-[#0f172a] hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                        >
                          Sign In / Sign Up
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={onOpenAuth}
                    className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs font-bold px-4 py-1.5 rounded-full transition-all cursor-pointer shadow-xs uppercase tracking-wider"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>

            {/* Dark Mode switch */}
            <button
              onClick={onToggleDarkMode}
              className="p-1.5 rounded-full bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-300 transition-all cursor-pointer flex items-center justify-center border border-slate-200/60 dark:border-slate-800"
              title={darkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
              id="navbar-dark-toggle"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-full block lg:hidden hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 transition-colors"
              aria-label="Toggle Navigation Tray"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Profile Avatar identifier */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-900 to-indigo-650/70 dark:from-white dark:to-slate-300 font-bold text-white dark:text-slate-900 flex items-center justify-center text-[10px] shadow-xs select-none">
                {loggedInUser ? loggedInUser.name.substring(0, 2).toUpperCase() : 'GS'}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Mobile Drawer navigation overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-150 dark:border-slate-800/80 bg-white dark:bg-[#0c111e] px-4 py-4 space-y-3 animate-fade-in">
          
          <div className="space-y-1">
            <p className="text-[9px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest px-3 mb-2">
              Navigate Modules
            </p>
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/30 text-xs font-semibold'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile Home Link Trigger */}
          <button
            onClick={() => {
              onGoHome();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#141c2f] hover:text-slate-800 text-xs font-semibold"
          >
            <Home className="w-4 h-4" />
            <span>Go to Landing Page</span>
          </button>

          {/* Mobile Info Stats Block */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-150 dark:border-slate-800/75 space-y-2">
            <div className="flex justify-between items-center text-[10px] text-slate-450 dark:text-slate-500">
              <span className="font-mono">System Clock:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-350">{currentTime}</span>
            </div>
            
            {loggedInUser ? (
              <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
                <span className="text-[11px] text-emerald-600 font-bold truncate max-w-[150px]">
                  {loggedInUser.email}
                </span>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-[10px] text-rose-500 hover:text-rose-600 font-bold flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Out</span>
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold text-xs py-2 rounded-xl text-center"
                >
                  Sign In Session
                </button>
              </div>
            )}
          </div>

        </div>
      )}
    </nav>
  );
}
