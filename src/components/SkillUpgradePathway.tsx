import React from 'react';
import { BookOpen, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { AnalysisData } from '../types';

interface SkillUpgradePathwayProps {
  analysisResult: AnalysisData;
}

export default function SkillUpgradePathway({ analysisResult }: SkillUpgradePathwayProps) {
  return (
    <div className="space-y-6" id="skill-upgrade-pathway">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Existing Recognized Skills */}
        <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
          <h4 className="font-extrabold text-slate-850 dark:text-slate-100 text-sm flex items-center gap-2">
            <CheckCircle className="w-4.5 h-4.5 text-emerald-500" />
            <span>Existing Recognized Skills</span>
          </h4>
          {(!analysisResult.current_skills || analysisResult.current_skills.length === 0) ? (
            <p className="text-xs text-slate-455 dark:text-slate-500 italic">
              No explicit developer skills parsed from your selection.
            </p>
          ) : (
            <div className="flex flex-wrap gap-1.5 animate-fade-in">
              {analysisResult.current_skills.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 rounded-lg text-[10px] font-semibold transition-colors border border-slate-200/30 dark:border-slate-700/50"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Recommended Skill Enhancements */}
        <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
          <h4 className="font-extrabold text-slate-850 dark:text-slate-100 text-sm flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-indigo-500" />
            <span>Recommended Skill Enhancements</span>
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
            Integrating these requested tech tools on your profile is highly vital for the{' '}
            <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
              {analysisResult.predicted_field}
            </span>{' '}
            track.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {analysisResult.recommended_skills.map((skill, sIdx) => (
              <span
                key={sIdx}
                className="px-2.5 py-1 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100/60 dark:hover:bg-indigo-900/40 rounded-lg text-[10px] font-bold transition-all"
              >
                + {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Certification / Courses recommendation list */}
      <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="space-y-1">
            <h4 className="font-extrabold text-slate-850 dark:text-slate-100 text-base flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
              <span>Custom Certification Curriculum</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Recommended custom-tailored certification pathways matching credentials gap analyses.
            </p>
          </div>
          <span className="text-[10px] bg-slate-100 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-700 font-mono px-2 py-1 rounded-md text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider leading-none">
            External Resources
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysisResult.recommended_courses.map((course, cIdx) => (
            <div
              key={cIdx}
              className="p-4 bg-slate-50 dark:bg-slate-900/20 border border-slate-150 dark:border-slate-800 rounded-2xl flex items-center justify-between hover:border-indigo-400 dark:hover:border-indigo-500 group transition-all"
            >
              <div className="overflow-hidden mr-2">
                <p className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate">
                  {course.title}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                  Syllabus Tailored
                </p>
              </div>
              <a
                href={course.link || 'https://www.coursera.org'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 px-3 bg-white dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-xl transition-all cursor-pointer inline-flex items-center gap-1 shrink-0 shadow-xs"
              >
                <span>Learn Course</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
