import React from 'react';
import { Trophy, Youtube } from 'lucide-react';

export default function CareerHacks() {
  return (
    <div className="space-y-6" id="career-placement-hacks">
      {/* New Section: Resume Writing Tips & Placement Checklist */}
      <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
        <div className="space-y-1 border-b border-slate-100 dark:border-slate-800 pb-4">
          <h4 className="font-extrabold text-slate-850 dark:text-slate-100 text-base flex items-center gap-2">
            <Trophy className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <span>Resume Performance Hacks & Placement Checklist</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Actionable advice for colleges, recruiters and candidates to push resumes past recruiters and computerized scanners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-indigo-50/30 dark:bg-indigo-950/10 rounded-2xl border border-indigo-100/60 dark:border-indigo-900/40 space-y-3 transition-colors">
            <h5 className="font-bold text-xs text-indigo-900 dark:text-indigo-200 uppercase tracking-wide">
              1. Strong Action Verbs
            </h5>
            <p className="text-[11px] text-slate-650 dark:text-slate-400 leading-relaxed">
              Avoid starting description bullets with passive words like "responsible for" or "carried out". Use powerful verbs instead: <b>Engineered, Optimized, Executed, Supervised, Standardized.</b>
            </p>
            <div className="flex gap-1 flex-wrap">
              <span className="text-[9px] bg-white dark:bg-slate-800 px-2 py-0.5 border rounded border-slate-250 dark:border-slate-700 font-mono text-slate-500 dark:text-slate-400">
                Engineered
              </span>
              <span className="text-[9px] bg-white dark:bg-slate-800 px-2 py-0.5 border rounded border-slate-250 dark:border-slate-700 font-mono text-slate-500 dark:text-slate-400">
                Pioneered
              </span>
              <span className="text-[9px] bg-white dark:bg-slate-800 px-2 py-0.5 border rounded border-slate-250 dark:border-slate-700 font-mono text-slate-500 dark:text-slate-400">
                Revamped
              </span>
            </div>
          </div>

          <div className="p-4 bg-emerald-50/30 dark:bg-emerald-950/10 rounded-2xl border border-emerald-100/60 dark:border-emerald-900/40 space-y-3 transition-colors">
            <h5 className="font-bold text-xs text-emerald-950 dark:text-emerald-200 uppercase tracking-wide">
              2. Quantum Metric Metrics
            </h5>
            <p className="text-[11px] text-slate-650 dark:text-slate-400 leading-relaxed">
              Recruiters look for numeric verification of achievements. Always provide quantifiable scores. E.g., change "designed system to speed up search" to "<b>optimized caching layers resulting in a 42% latency reduction</b>".
            </p>
            <div className="flex gap-1 flex-wrap">
              <span className="text-[9px] bg-white dark:bg-slate-800 px-2 py-0.5 border rounded border-slate-250 dark:border-slate-700 font-mono text-slate-500 dark:text-slate-400">
                Reduced by X%
              </span>
              <span className="text-[9px] bg-white dark:bg-slate-800 px-2 py-0.5 border rounded border-slate-250 dark:border-slate-700 font-mono text-slate-500 dark:text-slate-400">
                Managed $Xk
              </span>
              <span className="text-[9px] bg-white dark:bg-slate-800 px-2 py-0.5 border rounded border-slate-250 dark:border-slate-700 font-mono text-slate-500 dark:text-slate-400">
                Led X engineers
              </span>
            </div>
          </div>

          <div className="p-4 bg-rose-50/30 dark:bg-rose-950/10 rounded-2xl border border-rose-100/60 dark:border-rose-900/40 space-y-3 transition-colors">
            <h5 className="font-bold text-xs text-rose-950 dark:text-rose-200 uppercase tracking-wide">
              3. ATS Layout Cleanliness
            </h5>
            <p className="text-[11px] text-slate-650 dark:text-slate-400 leading-relaxed">
              Scanners fail when analyzing multi-column boxes, heavy graphical banners, or headers. Stick to <b>single-column layouts</b> with standard font structures (Arial, Georgia, Inter, Calibri) and clean sections.
            </p>
            <div className="flex gap-1 flex-wrap">
              <span className="text-[9px] bg-white dark:bg-slate-800 px-2 py-0.5 border rounded border-slate-250 dark:border-slate-700 font-mono text-slate-500 dark:text-slate-400">
                Single-Column
              </span>
              <span className="text-[9px] bg-white dark:bg-slate-800 px-2 py-0.5 border rounded border-slate-250 dark:border-slate-700 font-mono text-slate-500 dark:text-slate-400">
                Standard PDF
              </span>
              <span className="text-[9px] bg-white dark:bg-slate-800 px-2 py-0.5 border rounded border-slate-250 dark:border-slate-700 font-mono text-slate-500 dark:text-slate-400">
                No Image Blocks
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* New Section: Curated Video Resources for Careers & Interviews */}
      <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
        <div className="space-y-1">
          <h4 className="font-extrabold text-slate-850 dark:text-slate-100 text-base flex items-center gap-2">
            <Youtube className="w-5 h-5 text-rose-600" />
            <span>Interview Prep & Resume Tip Videos</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Expert video masterclasses to perfect your interview posture and placement outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-rose-350 dark:hover:border-rose-900/70 transition-all space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-mono uppercase bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-450 px-2 py-0.5 rounded font-bold">
                RECRUITER PERSPECTIVE
              </span>
              <h5 className="font-extrabold text-xs text-slate-800 dark:text-slate-200">
                Perfect Resume Layout (How To Pass the 6-Second Screen Test)
              </h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Learn about ATS filters, optimal font sizes, and exactly where Google and Meta hiring managers look first.
              </p>
            </div>
            <a
              href="https://www.youtube.com/watch?v=Tt08wAnQyMc"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer block mt-2"
            >
              <Youtube className="w-4 h-4 fill-white text-rose-600" />
              <span>Watch Perfect Resume Masterclass</span>
            </a>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-350 dark:hover:border-indigo-900/70 transition-all space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-mono uppercase bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded font-bold">
                SOFTWARE PLACEMENT PREP
              </span>
              <h5 className="font-extrabold text-xs text-slate-800 dark:text-slate-200">
                Cracking the Technical Behavioral Interview (STAR Method)
              </h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                An in-depth guide on handling behavioral interview queries using the Situation, Task, Action, Result methodology.
              </p>
            </div>
            <a
              href="https://www.youtube.com/watch?v=Gg3bZ6D7bEQ"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer block mt-2"
            >
              <Youtube className="w-4 h-4 fill-white text-indigo-650" />
              <span>Watch Behavioral Prep Tutorial</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
