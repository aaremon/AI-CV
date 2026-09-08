import React, { useState, useEffect } from 'react';
import PrivacyIndicator from './PrivacyIndicator';
import { MailCheck, Sparkles, Copy, Check, RefreshCw, FileText, Database, CheckCircle2, History, Trash2, Clock, ExternalLink } from 'lucide-react';

interface CoverLetterTabProps {
  loggedInUser?: any;
}

export default function CoverLetterTab({ loggedInUser }: CoverLetterTabProps) {
  const [jobTitle, setJobTitle] = useState('Senior Full Stack Developer');
  const [companyName, setCompanyName] = useState('Acme Tech Corp');
  const [hiringManager, setHiringManager] = useState('Hiring Manager');
  const [keySkills, setKeySkills] = useState('React, TypeScript, Node.js, Cloud Architecture, Team Leadership');
  const [tone, setTone] = useState('professional');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{ saved: boolean; message: string } | null>(null);
  const [recentLetters, setRecentLetters] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Derive candidate email with fallback cascading
  const effectiveEmail = loggedInUser?.email || (() => {
    try {
      const raw = localStorage.getItem('resume_auth_user');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.email) return parsed.email;
      }
    } catch (_) {}
    return localStorage.getItem('cv_user_email') || 'Aaryamanthapa123@gmail.com';
  })();

  const [generatedLetter, setGeneratedLetter] = useState(`Dear Hiring Team at Acme Tech Corp,

I am writing to express my enthusiastic interest in the Senior Full Stack Developer position. With extensive hands-on expertise in React, TypeScript, Node.js, Cloud Architecture, Team Leadership, I am confident in my ability to make an immediate impact on your engineering initiatives.

Throughout my career, I have consistently driven technical innovation, optimized system performance, and delivered scalable web applications. At Acme Tech Corp, I am particularly drawn to your mission and technical vision.

My experience aligns directly with the core requirements of this role. I welcome the opportunity to discuss how my skill set and passion for engineering excellence can support your team's goals.

Thank you for your time and consideration.

Sincerely,
Aaryaman Thapa`);

  const fetchRecentLetters = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch(`/api/cover-letter?email=${encodeURIComponent(effectiveEmail)}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.cover_letters)) {
          setRecentLetters(data.cover_letters);
        }
      }
    } catch (err) {
      console.warn("[CoverLetter] Failed to load history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchRecentLetters();
  }, [effectiveEmail]);

  const handleGenerate = async () => {
    setLoading(true);
    setSyncFeedback(null);
    try {
      const res = await fetch('/api/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle,
          companyName,
          hiringManager,
          keySkills,
          tone,
          owner_email: effectiveEmail
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.letter) {
          setGeneratedLetter(data.letter);
          setSyncFeedback({
            saved: true,
            message: `Persisted to cover_letter.json (Doc ID: #${data.document?.id || 'latest'})`
          });
          setLoading(false);
          fetchRecentLetters();
          return;
        }
      }

      // If backend responded with non-200 or no letter, generate high-quality fallback and persist
      const fallback = `Dear ${hiringManager || 'Hiring Manager'} at ${companyName || 'the hiring company'},

I am writing to express my strong interest in the ${jobTitle || 'open position'}. With proven expertise in ${keySkills}, I bring a track record of high-performance technical execution and collaborative problem-solving.

Having closely followed ${companyName || 'your organization'}'s growth, I am eager to contribute to your upcoming projects and help scale your software architecture.

I look forward to discussing how my background and dedication can add value to your team.

Best regards,
Aaryaman Thapa`;

      setGeneratedLetter(fallback);

      // Force persistence to cover_letter.json
      try {
        const saveRes = await fetch('/api/user/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            owner_email: effectiveEmail,
            title: `Cover Letter - ${jobTitle || 'Role Application'}`,
            type: 'cover_letter',
            job_title: jobTitle || '',
            company_name: companyName || '',
            hiring_manager: hiringManager || '',
            content: fallback
          })
        });
        if (saveRes.ok) {
          const saveData = await saveRes.json();
          setSyncFeedback({
            saved: true,
            message: `Persisted fallback to cover_letter.json (Doc ID: #${saveData.document?.id || 'latest'})`
          });
        }
      } catch (saveErr) {
        console.warn("[CoverLetter] Fallback save error:", saveErr);
      }

      fetchRecentLetters();
      setLoading(false);
    } catch (err) {
      console.error("[CoverLetter] Generation error:", err);
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveDocument = async () => {
    if (!generatedLetter || saving) return;
    setSaving(true);
    try {
      const res = await fetch('/api/user/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          owner_email: effectiveEmail,
          title: `Cover Letter - ${jobTitle || 'Role Application'}`,
          type: 'cover_letter',
          job_title: jobTitle || '',
          company_name: companyName || '',
          hiring_manager: hiringManager || '',
          tone: tone || 'professional',
          key_skills: keySkills || '',
          content: generatedLetter
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSaved(true);
        setSyncFeedback({
          saved: true,
          message: `Saved snapshot to cover_letter.json (Doc ID: #${data.document?.id || 'latest'})`
        });
        fetchRecentLetters();
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (e) {
      console.warn("Save document error:", e);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLetter = async (id: number) => {
    try {
      const res = await fetch(`/api/user/documents/${id}?email=${encodeURIComponent(effectiveEmail)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setRecentLetters(prev => prev.filter(l => l.id !== id));
      }
    } catch (err) {
      console.warn("[CoverLetter] Delete error:", err);
    }
  };

  const handleLoadLetter = (letter: any) => {
    if (letter.content) {
      setGeneratedLetter(letter.content);
    }
    if (letter.job_title) {
      setJobTitle(letter.job_title);
    }
    if (letter.company_name) {
      setCompanyName(letter.company_name);
    }
    if (letter.hiring_manager) {
      setHiringManager(letter.hiring_manager);
    }
    setSyncFeedback({
      saved: true,
      message: `Loaded #${letter.id} into editor`
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-fade-in">
      <PrivacyIndicator featureName="Cover Letter Generation" />

      {/* Header Banner */}
      <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold uppercase tracking-widest mb-1">
            <MailCheck className="w-4 h-4" />
            <span>AI Cover Letter Generator & Store</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Custom Cover Letters</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Generate role-tailored cover letters and automatically persist them directly to <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">cover_letter.json</span>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 font-mono">
            <Database className="w-3.5 h-3.5 text-emerald-500" />
            <span>Store: cover_letter.json</span>
            <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {recentLetters.length} saved
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Sync Status Banner */}
      {syncFeedback && (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span className="font-medium">{syncFeedback.message}</span>
          </div>
          <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 opacity-80">
            Synced Live
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Parameters */}
        <div className="lg:col-span-5 space-y-4 bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Target Job Parameters
            </h2>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate max-w-[180px]">
              {effectiveEmail}
            </span>
          </div>

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
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold py-3 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{loading ? 'Synthesizing & Saving to cover_letter.json...' : 'Generate AI Cover Letter'}</span>
          </button>
        </div>

        {/* Right Form: Preview & Live Editor */}
        <div className="lg:col-span-7 bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-600" />
                Generated Letter Preview
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveDocument}
                  disabled={saving || !generatedLetter}
                  className="flex items-center gap-1.5 text-xs font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-3 py-1.5 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 cursor-pointer disabled:opacity-50"
                  title="Persist latest version to cover_letter.json"
                >
                  {saved ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Sparkles className="w-3.5 h-3.5 text-indigo-500" />}
                  <span>{saved ? 'Saved to cover_letter.json' : saving ? 'Saving...' : 'Save to cover_letter.json'}</span>
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-200 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Text'}</span>
                </button>
              </div>
            </div>

            <textarea
              rows={16}
              value={generatedLetter}
              onChange={e => setGeneratedLetter(e.target.value)}
              className="w-full text-xs p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 leading-relaxed font-sans outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Your cover letter content..."
            />
          </div>
        </div>
      </div>

      {/* Saved Cover Letters in cover_letter.json */}
      <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Stored in cover_letter.json
            </h2>
            <span className="text-[11px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-mono px-2 py-0.5 rounded-full">
              {recentLetters.length} records
            </span>
          </div>

          <button
            onClick={fetchRecentLetters}
            disabled={loadingHistory}
            className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingHistory ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {recentLetters.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400 font-mono">
            No cover letters stored in cover_letter.json yet. Click "Generate AI Cover Letter" above to create and persist one!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentLetters.map((item: any) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                      {item.title || item.job_title || 'Cover Letter'}
                    </span>
                    <span className="text-[10px] font-mono bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 flex-shrink-0">
                      #{item.id}
                    </span>
                  </div>

                  {item.company_name && (
                    <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                      {item.company_name}
                    </p>
                  )}

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-3 mt-2 font-mono leading-relaxed">
                    {item.content}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleLoadLetter(item)}
                      className="px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 font-semibold cursor-pointer"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => handleDeleteLetter(item.id)}
                      className="p-1 rounded text-slate-400 hover:text-red-500 cursor-pointer"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
