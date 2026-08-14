import React, { useState } from 'react';
import PrivacyIndicator from './PrivacyIndicator';
import { MailCheck, Sparkles, Copy, Check, RefreshCw, Send, FileText } from 'lucide-react';

export default function CoverLetterTab() {
  const [jobTitle, setJobTitle] = useState('Senior Full Stack Developer');
  const [companyName, setCompanyName] = useState('Acme Tech Corp');
  const [hiringManager, setHiringManager] = useState('Hiring Manager');
  const [keySkills, setKeySkills] = useState('React, TypeScript, Node.js, Cloud Architecture, Team Leadership');
  const [tone, setTone] = useState('professional');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [generatedLetter, setGeneratedLetter] = useState(`Dear Hiring Team at Acme Tech Corp,

I am writing to express my enthusiastic interest in the Senior Full Stack Developer position. With extensive hands-on expertise in React, TypeScript, Node.js, Cloud Architecture, Team Leadership, I am confident in my ability to make an immediate impact on your engineering initiatives.

Throughout my career, I have consistently driven technical innovation, optimized system performance, and delivered scalable web applications. At Acme Tech Corp, I am particularly drawn to your mission and technical vision.

My experience aligns directly with the core requirements of this role. I welcome the opportunity to discuss how my skill set and passion for engineering excellence can support your team's goals.

Thank you for your time and consideration.

Sincerely,
Aaryaman Thapa`);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle, companyName, hiringManager, keySkills, tone })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.letter) {
          setGeneratedLetter(data.letter);
          setLoading(false);
          return;
        }
      }

      // Fallback generator if endpoint returns default
      setTimeout(() => {
        const fallback = `Dear ${hiringManager || 'Hiring Manager'} at ${companyName || 'the hiring company'},

I am writing to express my strong interest in the ${jobTitle || 'open position'}. With proven expertise in ${keySkills}, I bring a track record of high-performance technical execution and collaborative problem-solving.

Having closely followed ${companyName || 'your organization'}'s growth, I am eager to contribute to your upcoming projects and help scale your software architecture.

I look forward to discussing how my background and dedication can add value to your team.

Best regards,
Aaryaman Thapa`;
        setGeneratedLetter(fallback);
        setLoading(false);
      }, 800);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-fade-in">
      <PrivacyIndicator featureName="Cover Letter Generation" />

      <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold uppercase tracking-widest mb-1">
            <MailCheck className="w-4 h-4" />
            <span>AI Cover Letter Generator</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Custom Cover Letters</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Generate highly targeted, professional cover letters tailored to any job role in seconds.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4 bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Target Job Parameters
          </h2>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Target Job Title</label>
            <input
              type="text"
              value={jobTitle}
              onChange={e => setJobTitle(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Recipient Name / Title</label>
            <input
              type="text"
              value={hiringManager}
              onChange={e => setHiringManager(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Key Skills & Highlight Achievements</label>
            <textarea
              rows={3}
              value={keySkills}
              onChange={e => setKeySkills(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Tone & Voice</label>
            <select
              value={tone}
              onChange={e => setTone(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
            >
              <option value="professional">Professional & Direct</option>
              <option value="enthusiastic">Enthusiastic & High Energy</option>
              <option value="confident">Executive & Confident</option>
              <option value="creative">Creative & Narrative Driven</option>
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold py-3 rounded-xl shadow-md transition-all cursor-pointer"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{loading ? 'Synthesizing Cover Letter...' : 'Generate AI Cover Letter'}</span>
          </button>
        </div>

        <div className="lg:col-span-7 bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-600" />
                Generated Letter Preview
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-200 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>

            <textarea
              rows={16}
              value={generatedLetter}
              onChange={e => setGeneratedLetter(e.target.value)}
              className="w-full text-xs p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 leading-relaxed font-sans outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
