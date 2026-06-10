import React from 'react';
import { BookOpen, GraduationCap, Award, Youtube, Star, Trophy, Users, CheckCircle } from 'lucide-react';

export default function AboutTab() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-4">
        <h2 className="text-2xl font-extrabold font-display text-slate-800 tracking-tight">
          ℹ️ Resume AI Optimizer - Core Technologies
        </h2>
        <p className="text-slate-600 text-sm leading-relaxed">
          The Resumé AI Optimizer parses, processes, and scores applicant resumes against strict applicant tracking metrics using deep contextual models. It leverages server-side Generative LLMs with dynamic structured JSON schemas to extract and analyze skills, certifications, and structure in under 3 seconds.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 space-y-2">
            <h4 className="font-bold text-slate-800 text-sm">💡 ATS Scars & Criteria weights</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Resumes are rated out of 100 on absolute, quantifiable structures: Experience (16pts), Contact / Projects (19pts), Education (12pts), Certifications (12pts), Objectives (6pts), Internships (6pts), Hobbies (4pts), Skills (7pts), Achievements (13pts).
            </p>
          </div>

          <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100/50 space-y-2">
            <h4 className="font-bold text-slate-800 text-sm">🧠 Predictive Skill Matching</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Based on parsed vocabularies, candidates are routed to specialized tracks: Web, Mobile (iOS/Android), UI-UX, Data Science, or General. Custom missing tech-stack items are dynamically formulated.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
