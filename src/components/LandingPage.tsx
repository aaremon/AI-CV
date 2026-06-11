import React from 'react';
import { Sparkles, ArrowRight, Cpu, Target, Shield, CheckCircle, GraduationCap, Award, Play } from 'lucide-react';

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
          <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 font-extrabold text-xs shadow-sm">
            CV
          </div>
          <span className="text-[13px] font-black tracking-widest text-slate-900 dark:text-white uppercase font-display">
            CV Engine
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

        {/* Executive Key Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl bg-white dark:bg-[#141c2f] divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-800/80 overflow-hidden shadow-xs transition-colors mt-20 max-w-5xl mx-auto w-full">
          <div className="p-6 text-center">
            <div className="text-3xl font-black font-display text-slate-900 dark:text-white">85+</div>
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider mt-1.5 uppercase select-none font-mono">Hiring Benchmark</div>
          </div>
          <div className="p-6 text-center">
            <div className="text-3xl font-black font-display text-slate-900 dark:text-white">&lt; 3.0s</div>
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider mt-1.5 uppercase select-none font-mono">Average Latency</div>
          </div>
          <div className="p-6 text-center">
            <div className="text-3xl font-black font-display text-indigo-600 dark:text-indigo-400">A+</div>
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider mt-1.5 uppercase select-none font-mono">Format Verifier</div>
          </div>
          <div className="p-6 text-center">
            <div className="text-3xl font-black font-display text-emerald-500">100%</div>
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider mt-1.5 uppercase select-none font-mono">Data Privacy</div>
          </div>
        </div>

        {/* 3-Column Bento Grid Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto w-full">
          
          <div className="bg-white dark:bg-[#141c2f] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-800 dark:text-white font-bold select-none">
              <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-base font-bold font-display text-slate-900 dark:text-white tracking-tight">Structured Score Weighting</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Resumes are parsed across 10 vital parameters like Experience, Contact Details, Projects, Education, and Certifications to calculate an aggregate ATS Score.
            </p>
          </div>

          <div className="bg-white dark:bg-[#141c2f] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-800 dark:text-white font-bold select-none">
              <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-base font-bold font-display text-slate-900 dark:text-white tracking-tight">Predictive Pathway Routing</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Heuristics and language vocabularies dynamically classify candidates into matching technical fields including Frontend, Backend, Data Science, or Mobile.
            </p>
          </div>

          <div className="bg-white dark:bg-[#141c2f] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-800 dark:text-white font-bold select-none">
              <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-base font-bold font-display text-slate-900 dark:text-white tracking-tight">Zero-Data Retention Policy</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              We process text payloads strictly in-memory during execution. No resume copies or files are saved permanently without explicit guest login bindings.
            </p>
          </div>

        </div>

      </main>

      {/* Footer Branding info */}
      <footer className="w-full max-w-6xl mx-auto px-6 h-16 flex items-center justify-between border-t border-slate-200/40 dark:border-slate-800/30 text-[10px] text-slate-400 dark:text-slate-500 font-mono relative z-10">
        <span>© 2026 CV Engine. Built with Gemini & Python.</span>
        <span>Secure Sandbox Mode Enabled</span>
      </footer>

    </div>
  );
}
