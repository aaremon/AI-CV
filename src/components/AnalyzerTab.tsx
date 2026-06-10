import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  FileText,
  Upload,
  User,
  Mail,
  Phone,
  GraduationCap,
  Award,
  CheckCircle,
  XCircle,
  HelpCircle,
  BookOpen,
  ArrowRight,
  Download,
  AlertTriangle,
  Info,
  Youtube,
  Trash2,
  Trophy,
  History,
  Activity,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import { AnalysisData, UserDbRecord } from '../types';

interface AnalyzerTabProps {
  loggedInUser: any;
  currentTime: string;
}

export default function AnalyzerTab({ loggedInUser, currentTime }: AnalyzerTabProps) {
  // Candidate Form Inputs
  const [applicantName, setApplicantName] = useState('');
  const [applicantMail, setApplicantMail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>('');
  const [fileType, setFileType] = useState('');
  const [rawText, setRawText] = useState('');
  const [inputMode, setInputMode] = useState<'upload' | 'text'>('upload');
  const [isDragOver, setIsDragOver] = useState(false);

  // States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisData | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisRecord, setAnalysisRecord] = useState<any | null>(null);

  // History tracking
  const [personalHistory, setPersonalHistory] = useState<UserDbRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Auto-populate when user is updated
  useEffect(() => {
    if (loggedInUser) {
      setApplicantName(loggedInUser.name || '');
      setApplicantMail(loggedInUser.email || '');
      setApplicantPhone(loggedInUser.phone || '');
      fetchPersonalHistory(loggedInUser.email);
    } else {
      setApplicantName('');
      setApplicantMail('');
      setApplicantPhone('');
      setPersonalHistory([]);
    }
  }, [loggedInUser]);

  const fetchPersonalHistory = async (emailStr: string) => {
    setLoadingHistory(true);
    try {
      const res = await fetch(`/api/records?email=${encodeURIComponent(emailStr)}`);
      if (res.ok) {
        const list = await res.json();
        setPersonalHistory(list);
      }
    } catch (err) {
      console.error("Error retrieving historical logs:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleFileChange = (file: File) => {
    if (!file) return;
    setSelectedFile(file);
    setFileType(file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'text/plain'));
    
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFileBase64(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnalysisError(null);
    setAnalysisResult(null);
    setAnalysisRecord(null);

    if (!applicantName.trim()) {
      setAnalysisError("Applicant Name credentials are required.");
      return;
    }
    if (!applicantMail.trim()) {
      setAnalysisError("Applicant Email address is required.");
      return;
    }
    if (!applicantPhone.trim()) {
      setAnalysisError("Applicant phone contact is required.");
      return;
    }

    setIsAnalyzing(true);

    try {
      const payload = {
        act_name: applicantName.trim(),
        act_mail: applicantMail.trim(),
        act_mob: applicantPhone.trim(),
        fileBase64,
        fileType,
        rawText: inputMode === 'text' ? rawText : '',
        fileName: selectedFile ? selectedFile.name : (inputMode === 'text' ? 'Pasted_Text_Resume.txt' : ''),
        owner_email: loggedInUser ? loggedInUser.email : undefined
      };

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Analyzing transaction failed.");
      }

      if (result.success) {
        setAnalysisResult(result.data);
        setAnalysisRecord(result.record);
        if (loggedInUser) {
          fetchPersonalHistory(loggedInUser.email);
        }
      }
    } catch (err: any) {
      setAnalysisError(err.message || "An unexpected error occurred during parsing.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDeleteRecord = async (id: number) => {
    if (!confirm("Are you sure you want to permanently delete this resume tracking log?")) return;
    try {
      const res = await fetch(`/api/records/${id}?email=${encodeURIComponent(loggedInUser?.email || '')}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        if (loggedInUser) {
          fetchPersonalHistory(loggedInUser.email);
        }
        if (analysisRecord && analysisRecord.id === id) {
          setAnalysisResult(null);
          setAnalysisRecord(null);
        }
      }
    } catch (err) {
      console.error("Error deleting historical item:", err);
    }
  };

  // Recharts scoring calculations
  const chartColors = ['#10B981', '#E11D48']; // Added (emerald) vs Missing (rose)
  const scoreData = analysisResult ? [
    { name: 'ATS Score Achieved', value: analysisResult.resume_score },
    { name: 'Improvement Gap', value: 100 - analysisResult.resume_score }
  ] : [];

  // Bar chart scores comparison over time
  const historyChartData = personalHistory.map((item, idx) => ({
    label: `Rev ${idx + 1}`,
    score: Number(item.resume_score),
    date: new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }));

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Upper Grid Layout: Form vs History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Details Component */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-850">ATS Score Evaluator</h3>
            <p className="text-xs text-slate-500">Provide candidate credentials and upload PDF copy to commence deep structured parsing analyses.</p>
          </div>

          <form onSubmit={handleAnalyze} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-extrabold text-slate-500 block mb-1 uppercase tracking-wider">Candidate Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <User className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-450"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-slate-500 block mb-1 uppercase tracking-wider">Contact Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Mail className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={applicantMail}
                    onChange={(e) => setApplicantMail(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-450"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-slate-500 block mb-1 uppercase tracking-wider">Contact Mobile</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Phone className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="0402 121 212"
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-450"
                  />
                </div>
              </div>
            </div>

            {/* Input Selection Tabs */}
            <div className="space-y-2">
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
                <button
                  type="button"
                  onClick={() => setInputMode('upload')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    inputMode === 'upload' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Document Attach Upload
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('text')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    inputMode === 'text' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Raw Text Paste
                </button>
              </div>

              {inputMode === 'upload' ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                    isDragOver 
                      ? 'border-indigo-500 bg-indigo-50/40' 
                      : selectedFile ? 'border-indigo-400 bg-indigo-50/10' : 'border-slate-300 bg-slate-50 hover:bg-slate-100/50'
                  }`}
                >
                  <input
                    type="file"
                    id="resume-file-input"
                    className="hidden"
                    accept=".pdf,.txt"
                    onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
                  />
                  <label htmlFor="resume-file-input" className="cursor-pointer space-y-3 block">
                    <div className="w-11 h-11 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto shadow-sm">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">
                        {selectedFile ? `Selected: ${selectedFile.name}` : "Drag and drop resume here, or browse local search"}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">Supports PDF or raw .txt document formatting (Max 15MB)</p>
                    </div>
                  </label>
                </div>
              ) : (
                <textarea
                  rows={6}
                  placeholder="Paste raw resumé textual contents or cover summary details here..."
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  className="block w-full px-3.5 py-2.5 border border-slate-300 rounded-2xl text-xs focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none"
                />
              )}
            </div>

            {analysisError && (
              <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl flex items-start gap-2 animate-fade-in">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{analysisError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-450/80 text-white font-bold text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-indigo-600/10 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAnalyzing ? "Processing AI Analysis Matrix..." : "Analyze ATS & Core Competencies"}</span>
            </button>
          </form>
        </div>

        {/* Dynamic Personal History component */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4.5 h-4.5 text-indigo-500" />
                <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wide">Historical Progression</h4>
              </div>
              <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400">DATABASE INTEGRATED</span>
            </div>

            {!loggedInUser ? (
              <div className="p-8 text-center border border-slate-150 rounded-2xl bg-slate-50/50 space-y-3 my-auto">
                <History className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-600 leading-normal">
                  History Tracking Deactivated
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Sign in or create an account to view previous scores, delete redundant logs, and display dynamic resume progress charts!
                </p>
              </div>
            ) : loadingHistory ? (
              <div className="py-12 text-center text-xs text-slate-400 font-mono">Syncing account database logs...</div>
            ) : personalHistory.length === 0 ? (
              <div className="p-8 text-center border border-slate-150 rounded-2xl bg-slate-50/50 space-y-2">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-600">No previous analyses synced with this account.</p>
                <p className="text-[10px] text-slate-400">Your parsed records will be cataloged instantly once evaluated.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Score progress graph using Recharts area chart */}
                {personalHistory.length >= 2 && (
                  <div className="h-28 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={historyChartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="label" stroke="#94A3B8" fontSize={9} tickLine={false} />
                        <YAxis stroke="#94A3B8" fontSize={9} tickLine={false} domain={[0, 100]} />
                        <RechartsTooltip />
                        <Area type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={2} fillOpacity={1} fill="url(#scoreColor)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* History list */}
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {personalHistory.map((item) => (
                    <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-slate-150 flex items-center justify-between group">
                      <div className="overflow-hidden">
                        <p className="font-bold text-xs text-slate-800 truncate">{item.pdf_name}</p>
                        <p className="text-[9px] text-indigo-500 font-mono uppercase tracking-tight">{item.reco_field || 'Other Track'}</p>
                        <p className="text-[9px] text-slate-400 font-mono mt-0.5">{new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString()}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-bold text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-lg">
                          Score: {item.resume_score}
                        </span>
                        <button
                          onClick={() => handleDeleteRecord(item.id)}
                          className="p-1 px-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50 text-slate-600 space-y-1">
              <span className="text-[10px] uppercase font-bold text-indigo-700 leading-none block">💡 AI Recruiter Note:</span>
              <p className="text-[11px] leading-relaxed">
                Improving your structural checklist elements (e.g., adding project details, structured achievement lists) will immediately push scores past 85+ benchmarks.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Structured Results Display */}
      {isAnalyzing && (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4 animate-pulse">
          <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mx-auto">
            <Activity className="w-7 h-7 animate-spin" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-800">Recruiter Evaluation In Progress</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Gemini is looking under the hood of your certifications, degrees, and past experience benchmarks.</p>
          </div>
        </div>
      )}

      {analysisResult && (
        <div className="space-y-8 animate-fade-in" id="analysis-outputs">
          
          {/* Main profile details block */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left side: radial progress visual metric (Recharts PieChart) */}
            <div className="md:col-span-4 flex flex-col items-center justify-center py-4 bg-slate-50 rounded-2xl border border-slate-150">
              <div className="w-40 h-40 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={scoreData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={65}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                    >
                      <Cell fill="#4F46E5" />
                      <Cell fill="#EEF2F6" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute text-center">
                  <p className="text-4xl font-extrabold font-display leading-none text-slate-800">{analysisResult.resume_score}</p>
                  <p className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 mt-1">out of 100</p>
                </div>
              </div>
              <p className="text-xs font-bold text-slate-700 mt-3">Aggregate ATS Relevance Score</p>
            </div>

            {/* Right side: Information block */}
            <div className="md:col-span-8 space-y-4 text-sm">
              <div className="flex flex-wrap gap-2 items-center justify-between">
                <div>
                  <h3 className="text-2xl font-extrabold font-display text-slate-800 tracking-tight">{analysisResult.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">Verified Contact: {analysisResult.email} • {analysisResult.phone}</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl select-none leading-none flex items-center">
                    {analysisResult.cand_level}
                  </span>
                  <span className="px-3 py-1.5 bg-indigo-50 text-indigo-800 border border-indigo-200 text-xs font-bold rounded-xl select-none leading-none flex items-center">
                    {analysisResult.predicted_field}
                  </span>
                </div>
              </div>

              <div className="w-full h-px bg-slate-150"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">Education Level Identified</p>
                  <p className="text-xs text-slate-700 font-semibold">{analysisResult.degree || 'Degree not identified'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">Document Pages Evaluated</p>
                  <p className="text-xs text-slate-700 font-semibold">{analysisResult.no_of_pages || '1'} Page(s)</p>
                </div>
              </div>
            </div>

          </div>

          {/* Checklist Feedback list details */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="font-extrabold text-slate-850 text-base flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-500" />
                <span>Parser Checklist Audit Score</span>
              </h4>
              <span className="text-xs font-mono font-bold text-slate-400">CRITICAL METRICS CHECK</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysisResult.feedback.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-start gap-3.5">
                  {item.status === 'added' ? (
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <XCircle className="w-4 h-4" />
                    </div>
                  )}
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-xs text-slate-800">{item.factor} Section</h5>
                      <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-lg leading-none ${
                        item.status === 'added' ? 'bg-emerald-100/70 text-emerald-850' : 'bg-rose-100/70 text-rose-850'
                      }`}>
                        {item.status === 'added' ? 'Present' : 'Missing'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-sans">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skill lists & Keyword-to-Sector Clustering section */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h4 className="font-extrabold text-slate-850 text-base flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-500" />
                    <span>Keyword & Sector Clustering Map</span>
                  </h4>
                  <p className="text-xs text-slate-500">We crawl parsed keyword markers and cluster them dynamically onto physical sectors based on semantic affinities.</p>
                </div>
                <span className="text-[10px] w-fit font-mono font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg">NLP CATEGORY ENGINE</span>
              </div>

              {/* Clustering logic results helper */}
              {(() => {
                const skillsList = analysisResult.current_skills.map(s => s.toLowerCase());
                
                const sectors = [
                  {
                    name: "Web Engineering",
                    keywords: ["react", "vue", "angular", "html", "css", "javascript", "typescript", "node", "express", "tailwind", "bootstrap", "web", "nextjs", "django", "laravel", "php"],
                    color: "bg-amber-500",
                    textCol: "text-amber-800",
                    bgCol: "bg-amber-50"
                  },
                  {
                    name: "Data Science, Analytics & AI",
                    keywords: ["python", "r", "pandas", "numpy", "scikit", "ml", "machine learning", "deep learning", "tensorflow", "pytorch", "sql", "data", "analytics", "tableau", "bi"],
                    color: "bg-emerald-500",
                    textCol: "text-emerald-800",
                    bgCol: "bg-emerald-50"
                  },
                  {
                    name: "Cloud & Systems DevOps",
                    keywords: ["docker", "kubernetes", "aws", "gcp", "azure", "jenkins", "ci/cd", "linux", "git", "terraform", "cloud", "security", "yaml", "ansible"],
                    color: "bg-blue-500",
                    textCol: "text-blue-800",
                    bgCol: "bg-blue-50"
                  },
                  {
                    name: "Mobile App Innovation",
                    keywords: ["kotlin", "swift", "ios", "android", "flutter", "react native", "java", "mobile", "xcode", "mobile development"],
                    color: "bg-indigo-500",
                    textCol: "text-indigo-800",
                    bgCol: "bg-indigo-50"
                  },
                  {
                    name: "Product Design & Strategy",
                    keywords: ["figma", "sketch", "adobe", "ui", "ux", "wireframe", "prototype", "design", "user experience", "product", "agile", "scrum", "pmp"],
                    color: "bg-rose-500",
                    textCol: "text-rose-800",
                    bgCol: "bg-rose-50"
                  }
                ];

                const matches = sectors.map(sec => {
                  const matchedKeywords = skillsList.filter(sk => 
                    sec.keywords.some(kw => sk.includes(kw) || kw.includes(sk))
                  );
                  // Calculate match percentage
                  const percent = skillsList.length > 0 
                    ? Math.round((matchedKeywords.length / skillsList.length) * 100) 
                    : 0;
                  return {
                    ...sec,
                    matchedKeywords,
                    percent: percent > 0 ? percent : (matchedKeywords.length > 0 ? 10 : 0) // minimum small score if matching exists
                  };
                });

                // Sort matches by percentage
                const sortedMatches = [...matches].sort((a,b) => b.percent - a.percent);
                const supremeSector = sortedMatches[0]?.percent > 0 ? sortedMatches[0].name : "General Sector Category";

                return (
                  <div className="space-y-6">
                    <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex flex-col md:flex-row gap-3 md:items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase font-bold text-indigo-700 tracking-wider">Primary Affinity Predictor</span>
                        <h5 className="font-extrabold text-sm text-slate-800">
                          Resume primary clustering points to: <span className="text-indigo-600">{supremeSector}</span>
                        </h5>
                      </div>
                      <span className="px-3 py-1 bg-white border border-indigo-200 text-indigo-800 text-[11px] font-bold rounded-xl shadow-xs">
                        {analysisResult.predicted_field} Match Track
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h5 className="text-xs font-extrabold text-slate-700 uppercase tracking-widest block">Sector Proximities</h5>
                        <div className="space-y-3">
                          {matches.map((item, idx) => (
                            <div key={idx} className="space-y-1">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-slate-700">{item.name}</span>
                                <span className="font-mono text-slate-500 font-bold">{item.percent}%</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-2">
                                <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${Math.max(item.percent, 2)}%` }}></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h5 className="text-xs font-extrabold text-slate-700 uppercase tracking-widest block">Keywords Extracted within Sectors</h5>
                        <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                          {matches.filter(m => m.matchedKeywords.length > 0).length === 0 ? (
                            <p className="text-xs text-slate-400 italic">No direct matching sector keywords identified. Try adding more tech labels.</p>
                          ) : (
                            matches.filter(m => m.matchedKeywords.length > 0).map((item, idx) => (
                              <div key={idx} className={`p-3 rounded-xl border border-slate-100 ${item.bgCol} space-y-1.5`}>
                                <div className="flex justify-between items-center">
                                  <span className={`text-[10px] font-extrabold uppercase tracking-wide ${item.textCol}`}>{item.name}</span>
                                  <span className="text-[9px] bg-white px-1.5 py-0.5 rounded-md font-mono text-slate-400 font-bold">{item.matchedKeywords.length} item(s)</span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {item.matchedKeywords.map((kw, kIdx) => (
                                    <span key={kIdx} className="px-2 py-0.5 bg-white border border-slate-200/80 text-[10px] text-slate-650 rounded-lg">
                                      {kw}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Existing Recognized Skills */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <h4 className="font-extrabold text-slate-850 text-sm flex items-center gap-2">
                  <CheckCircle className="w-4.5 h-4.5 text-emerald-500" />
                  <span>Existing Recognized Skills</span>
                </h4>
                {analysisResult.current_skills.length === 0 ? (
                  <p className="text-xs text-slate-450 italic">No explicit developer skills parsed from your selection.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.current_skills.map((skill, sIdx) => (
                      <span key={sIdx} className="px-2.5 py-1 bg-slate-100 text-slate-650 hover:bg-slate-200/60 rounded-lg text-[10px] font-semibold transition-colors">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Recommended Skill Enhancements */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <h4 className="font-extrabold text-slate-850 text-sm flex items-center gap-2">
                  <Sparkles className="w-4.5 h-4.5 text-indigo-500" />
                  <span>Recommended Skill Enhancements</span>
                </h4>
                <p className="text-[11px] text-slate-500 leading-normal mb-2">Integrating these requested tech tools on your profile is highly vital for the {analysisResult.predicted_field} track.</p>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.recommended_skills.map((skill, sIdx) => (
                    <span key={sIdx} className="px-2.5 py-1 bg-indigo-50/70 text-indigo-700 hover:bg-indigo-100/60 rounded-lg text-[10px] font-bold transition-colors">
                      + {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Certification / Courses recommendation list */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-850 text-base flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-500" />
                  <span>Custom Certification Curriculum</span>
                </h4>
                <p className="text-xs text-slate-500 mt-1">Recommended custom-tailored certification pathways matching credentials gap analyses.</p>
              </div>
              <span className="text-[10px] bg-slate-100 font-mono px-2 py-1 rounded-md text-slate-400 uppercase font-bold tracking-wider leading-none">External Resources</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysisResult.recommended_courses.map((course, cIdx) => (
                <div key={cIdx} className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex items-center justify-between hover:border-indigo-400 group transition-all">
                  <div className="overflow-hidden">
                    <p className="font-bold text-xs text-slate-800 pr-2 truncate">{course.title}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">Syllabus Tailored</p>
                  </div>
                  <a
                    href={course.link || 'https://www.coursera.org'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 px-3 bg-white hover:bg-indigo-600 hover:text-white border border-slate-200 text-indigo-600 text-[10px] font-bold rounded-xl transition-all cursor-pointer inline-flex items-center gap-1 shrink-0"
                  >
                    <span>Learn Course</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* New Section: Resume Writing Tips & Placement Checklist */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <div className="space-y-1 border-b border-slate-100 pb-4">
              <h4 className="font-extrabold text-slate-850 text-base flex items-center gap-2">
                <Trophy className="w-5 h-5 text-indigo-500" />
                <span>Resume Performance Hacks & Placement Placement Checklist</span>
              </h4>
              <p className="text-xs text-slate-500">Actionable advice for colleges, recruiters and candidates to push resumes past recruiters and computerized scanners.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100/60 space-y-3">
                <h5 className="font-bold text-xs text-indigo-900 uppercase tracking-wide">1. Strong Action Verbs</h5>
                <p className="text-[11px] text-slate-650 leading-relaxed">
                  Avoid starting project/role description bullets with passive words like "responsible for" or "carried out". Use powerful verbs instead: <b>Engineered, Optimized, Executed, Supervised, Standardized.</b>
                </p>
                <div className="flex gap-1 flex-wrap">
                  <span className="text-[9px] bg-white px-2 py-0.5 border rounded border-slate-200 font-mono">Engineered</span>
                  <span className="text-[9px] bg-white px-2 py-0.5 border rounded border-slate-200 font-mono">Pioneered</span>
                  <span className="text-[9px] bg-white px-2 py-0.5 border rounded border-slate-200 font-mono">Revamped</span>
                </div>
              </div>

              <div className="p-4 bg-emerald-50/30 rounded-2xl border border-emerald-100/60 space-y-3">
                <h5 className="font-bold text-xs text-emerald-950 uppercase tracking-wide">2. Quantum Metric Metrics</h5>
                <p className="text-[11px] text-slate-650 leading-relaxed">
                  Recruiters look for numeric verification of achievements. Always provide quantifiable scores. E.g., change "designed system to speed up search" to "<b>optimized caching layers resulting in a 42% latency reduction</b>".
                </p>
                <div className="flex gap-1 flex-wrap">
                  <span className="text-[9px] bg-white px-2 py-0.5 border rounded border-slate-200 font-mono">Reduced by X%</span>
                  <span className="text-[9px] bg-white px-2 py-0.5 border rounded border-slate-200 font-mono">Managed $Xk</span>
                  <span className="text-[9px] bg-white px-2 py-0.5 border rounded border-slate-200 font-mono">Led X engineers</span>
                </div>
              </div>

              <div className="p-4 bg-rose-50/30 rounded-2xl border border-rose-100/60 space-y-3">
                <h5 className="font-bold text-xs text-rose-950 uppercase tracking-wide">3. ATS Layout Cleanliness</h5>
                <p className="text-[11px] text-slate-650 leading-relaxed">
                  Scanners fail when analyzing multi-column boxes, heavy graphical banners, or headers. Stick to <b>single-column layouts</b> with standard font structures (Arial, Georgia, Inter, Calibri) and clean sections.
                </p>
                <div className="flex gap-1 flex-wrap">
                  <span className="text-[9px] bg-white px-2 py-0.5 border rounded border-slate-200 font-mono">Single-Column</span>
                  <span className="text-[9px] bg-white px-2 py-0.5 border rounded border-slate-200 font-mono">Standard PDF</span>
                  <span className="text-[9px] bg-white px-2 py-0.5 border rounded border-slate-200 font-mono">No Image Blocks</span>
                </div>
              </div>
            </div>
          </div>

          {/* New Section: Curated Video Resources for Careers & Interviews */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <div className="space-y-1">
              <h4 className="font-extrabold text-slate-850 text-base flex items-center gap-2">
                <Youtube className="w-5 h-5 text-rose-600" />
                <span>Interview Prep & Resume tip videos</span>
              </h4>
              <p className="text-xs text-slate-500">Expert video masterclasses to perfect your interview posture and placement outcomes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-rose-300 transition-all space-y-3 flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono uppercase bg-rose-100 text-rose-700 px-2 py-0.5 rounded font-bold">RECRUITER PERSPECTIVE</span>
                  <h5 className="font-extrabold text-xs text-slate-800">Perfect Resume Layout (How To Pass the 6-Second Screen Test)</h5>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
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

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-rose-300 transition-all space-y-3 flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono uppercase bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-bold">SOFTWARE PLACEMENT PREP</span>
                  <h5 className="font-extrabold text-xs text-slate-800">Cracking the Technical Behavioral Interview (STAR Method)</h5>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
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
      )}

    </div>
  );
}

