import React, { useState } from 'react';
import { Send, Sparkles, Copy, Check, Mail } from 'lucide-react';

export default function OutreachEmailsTab() {
  const [recipientRole, setRecipientRole] = useState('Engineering Director');
  const [targetCompany, setTargetCompany] = useState('Stripe');
  const [myRole, setMyRole] = useState('Full Stack Software Engineer');
  const [emailSubject, setEmailSubject] = useState('Experienced Full Stack Engineer interested in Stripe\'s Infrastructure team');
  const [emailBody, setEmailBody] = useState(`Hi [Name],

I hope this email finds you well!

I have been following Stripe's recent technical milestones in API architecture with great admiration. As a Full Stack Engineer with 5+ years of experience building high-concurrency web systems (React, TypeScript, Node.js), I wanted to reach out directly regarding opportunities on your team.

At my previous company, I spearheaded frontend performance overhauls that improved core web vitals by 40% and reduced API response latency under peak load.

I would love to learn more about upcoming technical challenges on your engineering roadmap and see if my background might be a fit. Would you be open to a brief 10-minute coffee chat next week?

Best regards,
Aaryaman Thapa
GitHub / Portfolio: https://github.com/aaryaman`);

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${emailSubject}\n\n${emailBody}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-fade-in">
      <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-mono text-xs font-bold uppercase tracking-widest mb-1">
            <Send className="w-4 h-4" />
            <span>Recruiter Outreach & Cold Email Crafter</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Cold Email & Networking Templates</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Generate concise, high-conversion emails to engineering leads, recruiters, and founders.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Outreach Parameters
          </h2>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Target Company</label>
            <input
              type="text"
              value={targetCompany}
              onChange={e => setTargetCompany(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Recipient Title / Role</label>
            <input
              type="text"
              value={recipientRole}
              onChange={e => setRecipientRole(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Your Role / Specialty</label>
            <input
              type="text"
              value={myRole}
              onChange={e => setMyRole(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
            />
          </div>
        </div>

        <div className="lg:col-span-7 bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-xs font-mono font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-rose-600" />
              Email Template
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-200 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Full Email' : 'Copy Email'}</span>
            </button>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Subject Line</label>
            <input
              type="text"
              value={emailSubject}
              onChange={e => setEmailSubject(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Message Body</label>
            <textarea
              rows={11}
              value={emailBody}
              onChange={e => setEmailBody(e.target.value)}
              className="w-full text-xs p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 leading-relaxed outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
