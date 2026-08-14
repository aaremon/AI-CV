import React, { useState } from 'react';
import { UserCheck, Sparkles, Copy, Check } from 'lucide-react';

export default function BioGeneratorTab() {
  const [role, setRole] = useState('Full Stack Software Engineer');
  const [yearsExperience, setYearsExperience] = useState('5+');
  const [keySkills, setKeySkills] = useState('React, TypeScript, Node.js, Cloud Architecture, GraphQL');
  const [shortBio, setShortBio] = useState('Full Stack Engineer with 5+ years building scalable React & Node.js web applications with a focus on clean architecture and high performance.');
  const [mediumBio, setMediumBio] = useState('Aaryaman is a Senior Full Stack Software Engineer with over 5 years of industry experience crafting robust web applications. Specializing in React, TypeScript, Node.js, and cloud native architectures, Aaryaman has led engineering teams to ship high-impact digital products used by hundreds of thousands of users globally.');
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-fade-in">
      <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 font-mono text-xs font-bold uppercase tracking-widest mb-1">
            <UserCheck className="w-4 h-4" />
            <span>Professional Bio & Summary Synthesizer</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Bio & Executive Summary Generator</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Craft short, punchy elevator pitches and executive bios for portfolios, speakers, and resumes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Bio Configuration
          </h2>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Current / Target Role</label>
            <input
              type="text"
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Years of Experience</label>
            <input
              type="text"
              value={yearsExperience}
              onChange={e => setYearsExperience(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Core Tech Stack / Specializations</label>
            <textarea
              rows={3}
              value={keySkills}
              onChange={e => setKeySkills(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
            />
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          {/* Elevator Pitch / Short Bio */}
          <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase">1-Line Elevator Pitch (Twitter / GitHub Bio)</span>
              <button
                onClick={() => handleCopy(shortBio, 'short')}
                className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer"
              >
                {copied === 'short' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied === 'short' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <textarea
              rows={2}
              value={shortBio}
              onChange={e => setShortBio(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none"
            />
          </div>

          {/* Full Professional Bio */}
          <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase">Executive Bio (Portfolio / Speaker Bio)</span>
              <button
                onClick={() => handleCopy(mediumBio, 'medium')}
                className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer"
              >
                {copied === 'medium' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied === 'medium' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <textarea
              rows={5}
              value={mediumBio}
              onChange={e => setMediumBio(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 leading-relaxed outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
