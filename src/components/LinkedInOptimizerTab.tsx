import React, { useState } from 'react';
import { Linkedin, Sparkles, Copy, Check, RefreshCw, Award, TrendingUp } from 'lucide-react';

export default function LinkedInOptimizerTab() {
  const [roleTitle, setRoleTitle] = useState('Senior Full Stack Developer');
  const [currentHeadline, setCurrentHeadline] = useState('Software Engineer at TechCorp | React, Node.js');
  const [generatedHeadlines, setGeneratedHeadlines] = useState([
    'Senior Full Stack Developer | Building High-Scale React & Node.js Architecture | 5+ YOE',
    'Full Stack Engineer | React • TypeScript • Cloud Native | Helping Brands Scale Digital Products',
    'Product-Minded Engineer | Ex-TechCorp | Spezializing in Frontend Performance & API Design'
  ]);
  const [generatedAbout, setGeneratedAbout] = useState(
    'Passionate Full Stack Software Engineer with over 5 years of experience architecting resilient web applications. Proven track record in optimizing application performance, leading cross-functional engineering teams, and shipping user-centric digital products.'
  );

  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-fade-in">
      <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-mono text-xs font-bold uppercase tracking-widest mb-1">
            <Linkedin className="w-4 h-4" />
            <span>LinkedIn Profile Optimizer</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">LinkedIn Optimization Engine</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Maximize recruiter visibility with search-optimized headlines, summaries, and skill keywords.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Profile Parameters
          </h2>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Target Professional Role</label>
            <input
              type="text"
              value={roleTitle}
              onChange={e => setRoleTitle(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Current Headline (Optional)</label>
            <input
              type="text"
              value={currentHeadline}
              onChange={e => setCurrentHeadline(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
            />
          </div>

          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-blue-900 dark:text-blue-300 text-xs space-y-2">
            <div className="font-bold flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>SEO Optimization Tip</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
              Recruiters search LinkedIn using boolean operators on exact skill keywords. Include core tech stacks in your headline.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          {/* Headlines Card */}
          <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span>Optimized High-Impact Headlines</span>
              <span className="text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full">
                Recruiter Ready
              </span>
            </h2>

            <div className="space-y-3">
              {generatedHeadlines.map((hl, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center gap-3">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{hl}</p>
                  <button
                    onClick={() => handleCopy(hl, `hl-${idx}`)}
                    className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-600 cursor-pointer shrink-0"
                  >
                    {copied === `hl-${idx}` ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* About Section Card */}
          <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">LinkedIn "About" Summary</h2>
              <button
                onClick={() => handleCopy(generatedAbout, 'about')}
                className="flex items-center gap-1 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-200 cursor-pointer"
              >
                {copied === 'about' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied === 'about' ? 'Copied' : 'Copy Summary'}</span>
              </button>
            </div>

            <textarea
              rows={6}
              value={generatedAbout}
              onChange={e => setGeneratedAbout(e.target.value)}
              className="w-full text-xs p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 leading-relaxed outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
