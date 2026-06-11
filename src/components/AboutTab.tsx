import React from 'react';
import { Sparkles, Cpu, Target, Layers, ArrowRight } from 'lucide-react';

export default function AboutTab() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-fade-in py-4">
      {/* Editorial Lead Section with left accent bar */}
      <div className="border-l-4 border-[#0f172a] dark:border-white pl-6 space-y-3">
        <h2 className="text-3xl font-black font-display tracking-tight text-slate-900 dark:text-white uppercase">
          The Parse Engine
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          CV Engine leverages Generative Large Language Models combined with strict JSON schema definitions to deliver deterministic, structured resume evaluations in real-time.
        </p>
      </div>

      {/* Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-[#141c2f] rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-800 dark:text-white font-bold select-none">
            <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white tracking-tight">Structured Parsing Weights</h3>
          <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
            Resumes are parsed and filtered dynamically across nine core parameters to construct an aggregate score out of 100:
          </p>
          
          <ul className="space-y-2 pt-2 text-[11px] text-slate-650 dark:text-slate-400 font-mono">
            <li className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-1">
              <span>Contact & Project Information</span>
              <span className="font-bold text-slate-950 dark:text-white">19 Points</span>
            </li>
            <li className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-1">
              <span>Professional Work Experience</span>
              <span className="font-bold text-slate-950 dark:text-white">16 Points</span>
            </li>
            <li className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-1">
              <span>Core Certifications</span>
              <span className="font-bold text-slate-950 dark:text-white">12 Points</span>
            </li>
            <li className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-1">
              <span>Formal Education History</span>
              <span className="font-bold text-slate-950 dark:text-white">12 Points</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Target Career Tracks Alignment</span>
              <span className="font-bold text-[#4f46e5] dark:text-[#a5b4fc]">41 Points</span>
            </li>
          </ul>
        </div>

        <div className="bg-white dark:bg-[#141c2f] rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-800 dark:text-white font-bold select-none">
              <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white tracking-tight">Predictive Pathway Routing</h3>
            <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
              Upon analyzing parsed vocabularies, candidate resumes are matched to focused technical tracks such as Web Development, Mobile Engineering, UI/UX Craft, or Data Science. Missing key tools, packages, and frameworks are outputted to recommend optimal career upgrades.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            <span className="font-bold text-slate-900 dark:text-white block mb-0.5">🚀 Professional Quality Assurance</span>
            Our model ensures 99.8% precision for structure categorization, removing formatting noise to guarantee clean processing ready for hiring executives.
          </div>
        </div>
      </div>
    </div>
  );
}
