import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Clock,
  Gauge,
  FileText,
  MailCheck,
  Linkedin,
  UserCheck,
  Send,
  Shield,
  Layers,
  ArrowRight,
  Plus,
  CheckCircle2,
  Lock,
  HardDrive
} from 'lucide-react';
import logo from '../../assets/images/mero_match_exact_logo_1782115392578.jpg';

interface UserDashboardProps {
  loggedInUser: any;
  currentTime: string;
  onNavigate: (tab: string) => void;
  onOpenPrivacySettings: () => void;
}

export default function UserDashboard({
  loggedInUser,
  currentTime,
  onNavigate,
  onOpenPrivacySettings
}: UserDashboardProps) {
  const [cvRecords, setCvRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    avgScore: 0,
    totalScans: 0,
    versionsCount: 0,
    docsCount: 0
  });

  useEffect(() => {
    fetchUserData();
  }, [loggedInUser?.email]);

  const fetchUserData = async () => {
    if (!loggedInUser?.email) return;
    setLoading(true);
    try {
      const email = encodeURIComponent(loggedInUser.email);
      const [recordsRes, versionsRes, docsRes] = await Promise.all([
        fetch(`/api/user/cvs?email=${email}`),
        fetch(`/api/user/versions?email=${email}`),
        fetch(`/api/user/documents?email=${email}`)
      ]);

      const recordsData = await recordsRes.json();
      const versionsData = await versionsRes.json();
      const docsData = await docsRes.json();

      const userRecords = recordsData.cvs || [];
      setCvRecords(userRecords);

      let totalAts = 0;
      userRecords.forEach((r: any) => {
        const score = parseInt(r.data_json?.scoring?.overallScore || r.ats_score || '75', 10);
        totalAts += isNaN(score) ? 75 : score;
      });

      const avg = userRecords.length > 0 ? Math.round(totalAts / userRecords.length) : 0;

      setStats({
        avgScore: avg,
        totalScans: userRecords.length,
        versionsCount: (versionsData.versions || []).length,
        docsCount: (docsData.documents || []).length
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const quickTools = [
    {
      id: 'ats',
      title: 'ATS Resume Scanner',
      desc: 'Scan your resume against job descriptions using rule-based scoring & Gemini.',
      icon: Gauge,
      color: 'from-indigo-600 to-blue-600',
      badge: 'Core Tool'
    },
    {
      id: 'builder',
      title: 'CV Builder Workspace',
      desc: 'Create, format, and edit ATS-optimized resumes with live preview.',
      icon: FileText,
      color: 'from-emerald-600 to-teal-600',
      badge: 'Editor'
    },
    {
      id: 'cover_letter',
      title: 'Cover Letter Crafter',
      desc: 'Generate role-tailored cover letters for job applications.',
      icon: MailCheck,
      color: 'from-purple-600 to-pink-600',
      badge: 'AI Powered'
    },
    {
      id: 'linkedin',
      title: 'LinkedIn Optimizer',
      desc: 'Optimize headlines, summaries, and keyword density for recruiter search.',
      icon: Linkedin,
      color: 'from-blue-600 to-cyan-600',
      badge: 'Social'
    },
    {
      id: 'bio',
      title: 'Bio & Summary Generator',
      desc: 'Craft professional elevator bios and executive summaries.',
      icon: UserCheck,
      color: 'from-violet-600 to-purple-600',
      badge: 'Branding'
    },
    {
      id: 'emails',
      title: 'Outreach Email Crafter',
      desc: 'Write cold networking and recruiter follow-up emails.',
      icon: Send,
      color: 'from-rose-500 to-red-600',
      badge: 'Outreach'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Top Mero Match Brand Header */}
      <div className="flex items-center pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-white dark:bg-white p-1.5 shadow-sm border border-slate-200/90 dark:border-slate-700/80 flex items-center justify-center shrink-0">
            <img
              src={logo}
              alt="Mero Match"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-black font-display tracking-tight text-slate-900 dark:text-white uppercase font-sans">
              MERO MATCH
            </span>
          </div>
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 md:p-10 border border-slate-800 shadow-2xl">
        <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span>Career Acceleration Hub</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-300">{loggedInUser?.name || 'Career Seeker'}</span>
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
              Your personal workspace for ATS analysis, CV versioning, cover letters, and privacy-first AI tools.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10">
              <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
              <div className="text-xs">
                <span className="text-slate-400 block font-mono text-[10px] uppercase">System Time</span>
                <span className="font-mono font-bold text-white">{currentTime}</span>
              </div>
            </div>

            <button
              onClick={onOpenPrivacySettings}
              className="flex items-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer shadow-lg"
            >
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Privacy Active</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Average ATS Score</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Gauge className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.avgScore > 0 ? `${stats.avgScore}%` : 'N/A'}
            </span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              ATS Ready
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">CV Analyses</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats.totalScans}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Processed CVs</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">CV Versions</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats.versionsCount}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Tailored versions</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Privacy Protection</span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <Lock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">100%</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Zero Raw PII to AI</span>
          </div>
        </div>
      </div>

      {/* Quick Tools Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">AI Career Suite</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Launch any career tool with zero PII exposure</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quickTools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <div
                key={tool.id}
                onClick={() => onNavigate(tool.id)}
                className="group relative bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-500/30 transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {tool.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {tool.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  <span>Launch Tool</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity & Storage Privacy Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              Recent Resume Scans
            </h3>
            <button
              onClick={() => onNavigate('my_cvs')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View All CVs →
            </button>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">Loading CV activity...</div>
          ) : cvRecords.length === 0 ? (
            <div className="py-8 text-center space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">No CV scans found yet.</p>
              <button
                onClick={() => onNavigate('ats')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Scan Your First CV</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cvRecords.slice(0, 4).map((rec: any, idx: number) => {
                const score = parseInt(rec.data_json?.scoring?.overallScore || rec.ats_score || '75', 10);
                return (
                  <div
                    key={rec.id ? `user-cv-${rec.id}` : `user-cv-${idx}`}
                    className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-500/30 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                        {score}%
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {rec.applicant_name || rec.predicted_role || 'CV Document'}
                        </h4>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          {rec.predicted_role || 'Software Engineer'} • {new Date(rec.timestamp || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigate('my_cvs')}
                      className="px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all cursor-pointer"
                    >
                      View Report
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Privacy & Storage Control Box */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Privacy & AI Security</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your CV data is filtered through our PII sanitization layer before any AI processing occurs.
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero raw emails, phones, or addresses sent to AI</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Encrypted local database storage</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Full user data deletion rights anytime</span>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenPrivacySettings}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <Shield className="w-4 h-4" />
            <span>Manage Privacy Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}
