import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Play,
  Facebook,
  Twitter,
  Linkedin,
  Github,
  ChevronRight,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import logo from '../assets/images/mero_match_exact_logo_1782115392578.jpg';

interface LandingPageProps {
  onGetStarted: () => void;
  onOpenAuth: () => void;
  loggedInUser: any;
}

export default function LandingPage({ onGetStarted, onOpenAuth, loggedInUser }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0c111e] bg-grid-dot relative flex flex-col justify-between overflow-x-hidden antialiased transition-colors duration-200">
      
      {/* Editorial Decorative Upper Blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[300px] bg-gradient-to-b from-indigo-50/30 dark:from-indigo-950/5 via-transparent to-transparent pointer-events-none select-none" />

      {/* Landing Header */}
      <header className="w-full max-w-6xl mx-auto px-6 h-20 flex items-center justify-between relative z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-white border border-slate-200/60 dark:border-slate-800 shadow-sm">
            <img
              src={logo}
              alt="Mero Match Logo"
              className="w-full h-full object-contain bg-white"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-[14px] font-black tracking-widest text-slate-900 dark:text-white uppercase font-display">
            Mero Match
          </span>
        </div>

        <div className="flex items-center gap-4">
          {loggedInUser ? (
            <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/50 dark:bg-indigo-950/20 px-3 py-1.5 rounded-full border border-indigo-100/60 dark:border-indigo-900/40">
              Active Session: {loggedInUser.email}
            </span>
          ) : (
            <button
              onClick={onOpenAuth}
              className="text-xs font-bold text-slate-600 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
            >
              Sign In
            </button>
          )}
          
          <button
            onClick={onGetStarted}
            className="text-[11px] bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-extrabold px-4 py-2 rounded-full transition-all flex items-center gap-1.5 cursor-pointer shadow-xs uppercase tracking-wider"
          >
            <span>Analyze Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Body Content */}
      <main className="flex-1 flex flex-col justify-center max-w-6xl w-full mx-auto px-6 py-12 relative z-10 md:py-20 lg:py-24">
        
        {/* Lead Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 bg-white dark:bg-[#141c2f] border border-slate-200/80 dark:border-slate-800/80 px-3.5 py-1.5 rounded-full shadow-xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-650 dark:bg-indigo-400"></span>
            </span>
            <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 font-mono uppercase tracking-widest">
              ATS Compliance Parser v4.2
            </span>
          </div>
        </div>

        {/* Dynamic Title */}
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-display tracking-tight text-slate-900 dark:text-white uppercase leading-none">
            Diagnose your <br className="hidden md:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-950 via-indigo-750 to-slate-900 dark:from-white dark:via-indigo-400 dark:to-slate-300">
              Resume Scoring Potential
            </span>
          </h1>
          
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Upload your professional resume matching target career pathways instantly. Evaluate exact recruiter checkmarks, structural formats, and predictive tech stack requirements in under 3 seconds.
          </p>
        </div>

        {/* Primary Call to Action */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto h-12 px-8 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 font-black text-xs uppercase tracking-widest rounded-full transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-md select-none transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Launch Analyzer Dashboard</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
          
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto h-12 px-8 bg-white hover:bg-slate-50 dark:bg-[#141c2f] dark:hover:bg-slate-900/60 text-slate-800 dark:text-slate-200 border border-slate-200/90 dark:border-slate-850 font-extrabold text-xs uppercase tracking-wider rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Guest Sandbox Access</span>
          </button>
        </div>



      </main>

      {/* Footer Redesign with premium feel */}
      <footer className="w-full border-t border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 relative z-10 py-12 px-6 mt-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Mero Match Logo" className="w-7 h-7 rounded-lg object-cover" />
              <span className="font-display font-black tracking-tight text-slate-900 dark:text-white text-base">MERO MATCH</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm font-sans">
              An intelligent, schema-validated resume parsing and match optimizer engine delivering premium quality career checks in seconds.
            </p>
            {/* Social media icons with subtle hover states */}
            <div className="flex items-center gap-2.5 pt-1">
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-950 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-950 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-950 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-950 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-all">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Direct Company Navigation Links */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-display">
              About Mero Match
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400 font-sans">
              <li>
                <button onClick={onGetStarted} className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5 group text-left cursor-pointer">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  Analyze Your Resume
                </button>
              </li>
              <li>
                <span className="flex items-center gap-1.5 text-slate-450 dark:text-slate-400">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  System Blueprint Specs
                </span>
              </li>
              <li>
                <span className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
                  Career Coaching Hacks
                </span>
              </li>
              <li>
                <span className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
                  Secure Schema Sandbox
                </span>
              </li>
            </ul>
          </div>

          {/* Col 3: Beautiful Contact Information */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-display">
              Contact & Support
            </h4>
            <div className="space-y-3 text-xs text-slate-500 dark:text-slate-400 font-sans">
              
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-widest leading-none">Support Hotline</span>
                  <a href="tel:+2347047150598" className="hover:text-slate-900 dark:hover:text-white transition-colors font-semibold mt-0.5 block">+234 704 715 0598</a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-widest leading-none">Email Address</span>
                  <a href="mailto:support@meromatch.com" className="hover:text-slate-900 dark:hover:text-white transition-colors font-semibold mt-0.5 block">support@meromatch.com</a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-widest leading-none">Location</span>
                  <span className="font-semibold mt-0.5 block">Kathmandu, Nepal (Remote)</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom bar with copyright */}
        <div className="max-w-6xl mx-auto border-t border-slate-200/50 dark:border-slate-800/50 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-400 dark:text-slate-500 font-mono">
          <span>© 2026 Mero Match. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer">Terms & Conditions</span>
            <span>•</span>
            <span className="text-emerald-500 font-bold">Secure Sandbox Active</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
