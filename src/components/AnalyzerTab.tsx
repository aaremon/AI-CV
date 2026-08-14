import React, { useState, useEffect } from 'react';
import PrivacyIndicator from './PrivacyIndicator';
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
  Layers,
  Code2,
  Database,
  BarChart3,
  Megaphone,
  Users,
  Coins,
  ClipboardList,
  Palette,
  Percent,
  Headset,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Target,
  Bookmark,
  Flame
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
import ResumeCharts from './ResumeCharts';
import ChecklistAudit from './ChecklistAudit';
import ClusteringMap from './ClusteringMap';
import SkillUpgradePathway from './SkillUpgradePathway';
import CareerHacks from './CareerHacks';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AnalyzerTabProps {
  loggedInUser: any;
  currentTime: string;
}

export default function AnalyzerTab({ loggedInUser, currentTime }: AnalyzerTabProps) {
  // Step navigation states
  const [activeStep, setActiveStep] = useState<'field' | 'upload'>('field');
  const [selectedField, setSelectedField] = useState<string>('');
  const [customField, setCustomField] = useState<string>('');

  const TARGET_FIELDS = [
    { name: "Software Development", icon: "Code2" },
    { name: "Data Science", icon: "Database" },
    { name: "Business Analyst", icon: "BarChart3" },
    { name: "Digital Marketing", icon: "Megaphone" },
    { name: "Human Resources", icon: "Users2" },
    { name: "Finance & Accounting", icon: "Coins" },
    { name: "Project Management", icon: "ClipboardList" },
    { name: "UI/UX Design", icon: "Palette" },
    { name: "Sales", icon: "BadgePercent" },
    { name: "Customer Service", icon: "Headset" },
    { name: "Other", icon: "HelpCircle" }
  ];

  const getFieldIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2': return <Code2 className="w-5 h-5 text-blue-500" />;
      case 'Database': return <Database className="w-5 h-5 text-indigo-500" />;
      case 'BarChart3': return <BarChart3 className="w-5 h-5 text-purple-500" />;
      case 'Megaphone': return <Megaphone className="w-5 h-5 text-amber-500" />;
      case 'Users2': return <Users className="w-5 h-5 text-rose-500" />;
      case 'Coins': return <Coins className="w-5 h-5 text-emerald-500" />;
      case 'ClipboardList': return <ClipboardList className="w-5 h-5 text-teal-500" />;
      case 'Palette': return <Palette className="w-5 h-5 text-pink-500" />;
      case 'BadgePercent': return <Percent className="w-5 h-5 text-orange-500" />;
      case 'Headset': return <Headset className="w-5 h-5 text-cyan-500" />;
      default: return <HelpCircle className="w-5 h-5 text-slate-500" />;
    }
  };

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
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase
          .from('records')
          .select('*')
          .order('id', { ascending: false });
        if (error) throw error;
        setPersonalHistory(data || []);
      } else {
        const res = await fetch(`/api/records?email=${encodeURIComponent(emailStr)}`);
        if (res.ok) {
          const list = await res.json();
          setPersonalHistory(list);
        }
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

    const finalField = selectedField === 'Other' ? customField.trim() : selectedField;
    if (!finalField) {
      setAnalysisError("A target interest field or role must be selected.");
      return;
    }

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
      // Direct File Upload to Supabase Storage resumes bucket if active
      let uploadedPdfUrl = '';
      if (selectedFile && isSupabaseConfigured() && supabase) {
        try {
          const fileExt = selectedFile.name.split('.').pop();
          const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 12)}.${fileExt}`;
          const filePath = `${loggedInUser?.id || 'anonymous'}/${uniqueFileName}`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('resumes')
            .upload(filePath, selectedFile, {
              cacheControl: '3600',
              upsert: false
            });
            
          if (uploadError) {
            console.warn("Could not upload resume to Supabase Storage resumes bucket:", uploadError.message);
          } else if (uploadData) {
            const { data: urlData } = supabase.storage
              .from('resumes')
              .getPublicUrl(filePath);
            uploadedPdfUrl = urlData.publicUrl;
            console.log("File successfully uploaded to Supabase Storage resumes bucket:", uploadedPdfUrl);
          }
        } catch (stErr) {
          console.warn("Supabase storage upload failure, proceeding with standard analysis:", stErr);
        }
      }

      const payload = {
        act_name: applicantName.trim(),
        act_mail: applicantMail.trim(),
        act_mob: applicantPhone.trim(),
        fileBase64,
        fileType,
        rawText: inputMode === 'text' ? rawText : '',
        fileName: selectedFile ? selectedFile.name : (inputMode === 'text' ? 'Pasted_Text_Resume.txt' : ''),
        owner_email: loggedInUser ? loggedInUser.email : undefined,
        selected_field: finalField
      };

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      let result: any;
      const textResponse = await response.text();
      try {
        result = JSON.parse(textResponse);
      } catch (parseErr) {
        throw new Error(response.ok
          ? "Malformed response received from the analytics server."
          : `Server Error ${response.status}: Please ensure the backend server is running and accessible.`
        );
      }

      if (!response.ok) {
        throw new Error(result.error || "Analyzing transaction failed.");
      }

      if (result.success) {
        // Direct insertion of parsed evaluation record to Supabase records table if configured
        if (isSupabaseConfigured() && supabase) {
          try {
            const recordPayload = {
              owner_id: loggedInUser?.id || null,
              owner_email: loggedInUser?.email || null,
              name: result.data.name || applicantName,
              email: result.data.email || applicantMail,
              resume_score: String(result.data.resume_score || 0),
              timestamp: new Date().toISOString(),
              reco_field: finalField,
              cand_level: result.data.cand_level || "Fresher",
              skills: result.data.current_skills || [],
              recommended_skills: result.data.recommended_skills || [],
              courses: result.data.recommended_courses || [],
              pdf_name: selectedFile ? selectedFile.name : (inputMode === 'text' ? 'Pasted_Text_Resume.txt' : 'Text_Resume.txt'),
              pdf_url: uploadedPdfUrl || null
            };

            const { data: insertedData, error: dbError } = await supabase
              .from('records')
              .insert([recordPayload])
              .select();

            if (dbError) throw dbError;
            if (insertedData && insertedData[0]) {
              result.record = insertedData[0];
            }
          } catch (dbErr: any) {
            console.warn("Supabase records table insert failure, using standard server response:", dbErr);
          }
        }

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
      if (isSupabaseConfigured() && supabase) {
        const { error } = await supabase
          .from('records')
          .delete()
          .eq('id', id);
        if (error) throw error;
        if (loggedInUser) {
          fetchPersonalHistory(loggedInUser.email);
        }
        if (analysisRecord && analysisRecord.id === id) {
          setAnalysisResult(null);
          setAnalysisRecord(null);
        }
      } else {
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
    <div className="space-y-8 max-w-6xl mx-auto py-2">
      
      {/* Executive Key Metrics Row (from Agenco website mockup) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border border-slate-200/80 dark:border-slate-800/85 rounded-3xl bg-white dark:bg-[#141c2f] divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-800/80 overflow-hidden shadow-xs transition-colors">
        <div className="p-6 text-center">
          <div className="text-3xl font-black font-display text-slate-900 dark:text-white">85+</div>
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider mt-1.5 uppercase select-none">Hiring Benchmark</div>
        </div>
        <div className="p-6 text-center">
          <div className="text-3xl font-black font-display text-slate-900 dark:text-white">&lt; 3.0s</div>
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider mt-1.5 uppercase select-none">Average Latency</div>
        </div>
        <div className="p-6 text-center">
          <div className="text-3xl font-black font-display text-indigo-600 dark:text-indigo-400">A+</div>
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider mt-1.5 uppercase select-none">Format Verifier</div>
        </div>
        <div className="p-6 text-center">
          <div className="text-3xl font-black font-display text-emerald-500">100%</div>
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider mt-1.5 uppercase select-none">Data Privacy</div>
        </div>
      </div>

      {/* Privacy Indicator Banner */}
      <PrivacyIndicator featureName="ATS CV Scanner & Analysis" />

      {/* Upper Grid Layout: Form vs History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Details Component */}
        <div className="lg:col-span-7 bg-white dark:bg-[#141c2f] rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6">
          {activeStep === 'field' ? (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/25">
                    <Target className="w-4.5 h-4.5 text-indigo-500 dark:text-indigo-400" />
                  </span>
                  <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white tracking-tight">Select Target Field or Role</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Tell us what role or industry field you are aiming for. Gemini AI will customize all ATS screening filters and recommendations for success in your selected industry.
                </p>
              </div>

              {/* Grid of Common Categories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {TARGET_FIELDS.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      setSelectedField(item.name);
                      if (item.name !== 'Other') setCustomField('');
                    }}
                    className={`flex items-center gap-3 p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                      selectedField === item.name
                        ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20 ring-1 ring-indigo-500/50'
                        : 'border-slate-100 dark:border-slate-800/60 dark:bg-[#141c2f]/40 hover:border-slate-300 dark:hover:border-slate-700/80 hover:bg-slate-50/50 dark:hover:bg-slate-800/10'
                    }`}
                  >
                    <div className={`p-2 rounded-xl transition-colors shrink-0 ${
                      selectedField === item.name
                        ? "bg-indigo-100 text-indigo-650 dark:bg-indigo-900/40 dark:text-indigo-400"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    }`}>
                      {getFieldIcon(item.name)}
                    </div>
                    <span className={`text-xs font-bold ${
                      selectedField === item.name ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-355'
                    }`}>
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Custom Target Field Input */}
              {selectedField === 'Other' && (
                <div className="space-y-2 animate-slide-down">
                  <label className="text-[10px] font-extrabold text-slate-450 dark:text-slate-500 block uppercase tracking-wider">Custom Field or Target Role Interest</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cybersecurity Engineer, Product Manager, Devops"
                    value={customField}
                    onChange={(e) => setCustomField(e.target.value)}
                    className="block w-full px-4 py-2.5 border border-slate-200 dark:border-[#243049] rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-550 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              )}

              {/* Error boundary */}
              {analysisError && (
                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl flex items-start gap-2 animate-fade-in">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{analysisError}</span>
                </div>
              )}

              {/* Action Button */}
              <button
                type="button"
                disabled={!selectedField || (selectedField === 'Other' && !customField.trim())}
                onClick={() => {
                  setAnalysisError(null);
                  setActiveStep('upload');
                }}
                className="w-full h-11 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 dark:bg-white dark:hover:bg-slate-50 dark:text-slate-950 text-white font-bold text-xs uppercase tracking-widest rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:cursor-not-allowed"
              >
                <span>Proceed to Resume Upload</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveStep('field')}
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-all font-bold cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Change Target Field</span>
                </button>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 border border-indigo-150 dark:border-indigo-900/30 text-[10px] font-mono tracking-wider font-extrabold uppercase rounded-lg">
                  <Target className="w-3.5 h-3.5" />
                  <span>{selectedField === 'Other' ? customField : selectedField}</span>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white tracking-tight">Resume Document Upload</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Provide candidate credentials and upload PDF copy to commence deep structured parsing analyses.</p>
              </div>

              <form onSubmit={handleAnalyze} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-450 dark:text-slate-500 block mb-1.5 uppercase tracking-wider">Candidate Name</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <User className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="Candidate name"
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        className="block w-full pl-9 pr-3.5 py-2.5 border border-slate-200 dark:border-[#243049] rounded-xl text-xs focus:ring-2 focus:ring-indigo-505/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-450"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold text-slate-455 dark:text-slate-500 block mb-1.5 uppercase tracking-wider">Contact Email</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <Mail className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type="email"
                        required
                        placeholder="you@company.com"
                        value={applicantMail}
                        onChange={(e) => setApplicantMail(e.target.value)}
                        className="block w-full pl-9 pr-3.5 py-2.5 border border-slate-200 dark:border-[#243049] rounded-xl text-xs focus:ring-2 focus:ring-indigo-505/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-455"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold text-slate-455 dark:text-slate-500 block mb-1.5 uppercase tracking-wider">Contact Mobile</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <Phone className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type="tel"
                        required
                        placeholder="(555) 000-0000"
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        className="block w-full pl-9 pr-3.5 py-2.5 border border-slate-200 dark:border-[#243049] rounded-xl text-xs focus:ring-2 focus:ring-indigo-505/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-455"
                      />
                    </div>
                  </div>
                </div>

                {/* Input Selection Tabs */}
                <div className="space-y-3">
                  <div className="flex gap-1.5 p-1 bg-slate-50 dark:bg-slate-900 rounded-xl w-fit border border-slate-150 dark:border-[#243049]">
                    <button
                      type="button"
                      onClick={() => setInputMode('upload')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        inputMode === 'upload' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                      }`}
                    >
                      Document Attach Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputMode('text')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        inputMode === 'text' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
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
                          : selectedFile ? 'border-emerald-400 bg-emerald-500/5' : 'border-slate-200 dark:border-[#243049] bg-slate-50/50 dark:bg-slate-900/10 hover:bg-slate-50 dark:hover:bg-slate-900/30'
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
                        <div className="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-white flex items-center justify-center mx-auto shadow-sm">
                          <Upload className="w-5 h-5 text-indigo-650 dark:text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
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
                      className="block w-full px-4 py-3 border border-slate-200 dark:border-[#243049] rounded-2xl text-xs focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none"
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
                  className="w-full h-11 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-250 dark:bg-white dark:hover:bg-slate-50 dark:text-slate-950 text-white font-bold text-xs uppercase tracking-widest rounded-full transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                  <span>{isAnalyzing ? "Analyzing Resume..." : "Analyze ATS & Core Competencies"}</span>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Dynamic Personal History component */}
        <div className="lg:col-span-5 bg-white dark:bg-[#141c2f] rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
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
                  {personalHistory.map((item, idx) => (
                    <div key={item.id ? `hist-${item.id}` : `hist-${idx}`} className="p-3 bg-slate-50 rounded-xl border border-slate-150 flex items-center justify-between group">
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
            <h4 className="font-extrabold text-sm text-slate-800">Analyzing Resume...</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Just a moment while we parse and evaluate your resume details.</p>
          </div>
        </div>
      )}

      {analysisResult && (
        <div className="space-y-8 animate-fade-in" id="analysis-outputs">
          
          {/* Main profile details header */}
          <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center transition-colors">
            <div className="md:col-span-12 space-y-4 text-sm">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black font-display text-slate-800 dark:text-slate-100 tracking-tight">
                    {analysisResult.name}
                  </h3>
                  <p className="text-xs text-slate-450 dark:text-slate-500 font-mono mt-1">
                    Verified Contact: {analysisResult.email} • {analysisResult.phone}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/20 text-rose-850 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 text-[10px] font-mono tracking-wider uppercase font-extrabold rounded-xl select-none leading-none flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-rose-500 dark:text-rose-450" />
                    Target: {analysisRecord?.reco_field || selectedField || 'General'}
                  </span>
                  <span className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-450 border border-emerald-250 dark:border-emerald-900/40 text-[10px] font-mono tracking-wider uppercase font-extrabold rounded-xl select-none leading-none flex items-center">
                    {analysisResult.cand_level} Level
                  </span>
                  <span className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-800 dark:text-indigo-400 border border-indigo-250 dark:border-indigo-900/40 text-[10px] font-mono tracking-wider uppercase font-extrabold rounded-xl select-none leading-none flex items-center">
                    {analysisResult.predicted_field} Match Track
                  </span>
                </div>
              </div>

              <div className="w-full h-px bg-slate-110 dark:bg-slate-800"></div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">
                    Education Level Identified
                  </p>
                  <p className="text-xs text-slate-700 dark:text-slate-355 font-semibold">
                    {analysisResult.degree || 'Degree not identified'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">
                    Document Pages Evaluated
                  </p>
                  <p className="text-xs text-slate-700 dark:text-slate-355 font-semibold">
                    {analysisResult.no_of_pages || '1'} Page(s)
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">
                    Evaluation Method
                  </p>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-mono font-bold">
                    Fast-Track NLP Pipeline
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 1. Dynamic Charts and Diagrams comparing score & industry margins */}
          <ResumeCharts data={analysisResult} />

          {/* Field-Specific Recruiter & Coaching Insights Panel */}
          <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl text-indigo-600 dark:text-indigo-400 shrink-0">
                  <Target className="w-5 h-5 animate-pulse-slow" />
                </div>
                <div>
                  <h4 className="text-base font-black font-display text-slate-800 dark:text-slate-100 tracking-tight">
                    Specific Career Coaching & ATS Optimization Report
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Tailored specifically for success in the <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{analysisRecord?.reco_field || selectedField || 'General'}</span> industry.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                <span className="text-[10px] font-extrabold text-slate-450 dark:text-slate-500 uppercase font-mono mr-1">ATS Compatibility:</span>
                <div className="flex items-center justify-center w-11 h-11 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 font-display font-black text-xs text-emerald-600 dark:text-emerald-400 shadow-sm animate-pulse">
                  {analysisResult.ats_compatibility_score || 72}%
                </div>
              </div>
            </div>

            {/* Relevance commentaries */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-slate-50 dark:bg-[#141c2f] rounded-2xl border border-slate-150/40 dark:border-slate-800/80 space-y-2">
                <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">💼 Experience Relevance Analysis</span>
                <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-semibold">
                  {analysisResult.experience_relevance}
                </p>
              </div>

              <div className="p-5 bg-slate-50 dark:bg-[#141c2f] rounded-2xl border border-slate-150/40 dark:border-slate-800/80 space-y-2">
                <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">🎓 Academic & Credentials Fit</span>
                <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-semibold">
                  {analysisResult.education_relevance}
                </p>
              </div>
            </div>

            {/* Strengths & Weaknesses (Side-by-side Checklist) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 border border-slate-100 dark:border-slate-800/80 rounded-2xl space-y-3 bg-[#fbfcfd] dark:bg-slate-900/50">
                <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <h5 className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Candidate Strengths</h5>
                </div>
                <ul className="space-y-2.5">
                  {(analysisResult.strengths || []).map((str, idx) => (
                    <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2 select-none">
                      <span className="text-emerald-500 font-bold shrink-0 mt-0.5">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                  {(!analysisResult.strengths || analysisResult.strengths.length === 0) && (
                    <li className="text-xs text-slate-400">Not analyzed</li>
                  )}
                </ul>
              </div>

              <div className="p-5 border border-slate-100 dark:border-slate-800/80 rounded-2xl space-y-3 bg-[#fcfbfa] dark:bg-slate-900/55">
                <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <h5 className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Improvement Opportunities</h5>
                </div>
                <ul className="space-y-2.5">
                  {(analysisResult.weaknesses || []).map((wk, idx) => (
                    <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2 select-none">
                      <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                      <span>{wk}</span>
                    </li>
                  ))}
                  {(!analysisResult.weaknesses || analysisResult.weaknesses.length === 0) && (
                    <li className="text-xs text-slate-400">Not analyzed</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Missing Skills & ATS Keywords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3.5 p-5 bg-indigo-50/20 dark:bg-indigo-950/5 border border-indigo-100/50 dark:border-indigo-900/20 rounded-2xl">
                <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest block font-display leading-none">
                  ⚠️ KEY TECHNICAL GAPS FOR THIS INDUSTRY
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(analysisResult.missing_skills || []).map((sk, idx) => (
                    <span key={idx} className="px-2.5 py-1 text-[11px] bg-rose-50/80 dark:bg-rose-950/20 text-rose-700 dark:text-rose-450 border border-rose-100/40 dark:border-rose-900/20 rounded-lg flex items-center gap-1 font-semibold select-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      {sk}
                    </span>
                  ))}
                  {(!analysisResult.missing_skills || analysisResult.missing_skills.length === 0) && (
                    <span className="text-xs text-slate-400">No major gaps identified</span>
                  )}
                </div>
              </div>

              <div className="space-y-3.5 p-5 bg-emerald-50/20 dark:bg-emerald-950/5 border border-emerald-100/50 dark:border-emerald-900/20 rounded-2xl">
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-450 uppercase tracking-widest block font-display leading-none">
                  🚀 RECOMMENDED ATS OPTIMIZATION KEYWORDS
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(analysisResult.suggested_keywords || []).map((kw, idx) => (
                    <span key={idx} className="px-2.5 py-1 text-[11px] bg-emerald-50/80 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-450 border border-emerald-100/40 dark:border-emerald-900/20 rounded-lg flex items-center gap-1 font-semibold select-none">
                      <Bookmark className="w-3 h-3 text-emerald-600" />
                      {kw}
                    </span>
                  ))}
                  {(!analysisResult.suggested_keywords || analysisResult.suggested_keywords.length === 0) && (
                    <span className="text-xs text-slate-400">No optimized keywords analyzed</span>
                  )}
                </div>
              </div>
            </div>

            {/* Certifications & Actionable Portfolio Projects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-slate-50 dark:bg-[#141c2f] border border-slate-100 dark:border-slate-800/80 rounded-2xl space-y-3">
                <span className="text-[10px] font-extrabold text-slate-450 dark:text-slate-500 uppercase tracking-wider block">🎓 Top Suggested Certifications</span>
                <ul className="space-y-3">
                  {(analysisResult.suggested_certifications || []).map((cert, idx) => (
                    <li key={idx} className="bg-white dark:bg-[#1e293b]/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-2.5 shadow-2xs">
                      <div className="p-1.5 bg-amber-50 dark:bg-amber-950/20 rounded-lg text-amber-500 shrink-0">
                        <Award className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">{cert}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 bg-slate-50 dark:bg-[#141c2f] border border-slate-100 dark:border-slate-800/80 rounded-2xl space-y-3">
                <span className="text-[10px] font-extrabold text-slate-450 dark:text-slate-500 uppercase tracking-wider block">🛠️ Recommended Resume Projects</span>
                <ul className="space-y-3">
                  {(analysisResult.suggested_projects || []).map((proj, idx) => (
                    <li key={idx} className="bg-white dark:bg-[#1e293b]/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-2.5 shadow-2xs">
                      <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg text-indigo-505 shrink-0">
                        <Code2 className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">{proj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Interview Readiness & Roadmap Action List */}
            <div className="space-y-4 p-6 bg-slate-50/50 dark:bg-[#141c2f]/40 border border-slate-150/40 dark:border-slate-800 rounded-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-md bg-rose-50 dark:bg-rose-950/20 text-rose-550">
                      <Flame className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-extrabold text-slate-750 dark:text-slate-300 uppercase tracking-wider">Interview Readiness Assessment</span>
                  </div>
                  <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed font-semibold">
                    {analysisResult.interview_readiness}
                  </p>
                </div>

                <div className="lg:col-span-7 space-y-2 lg:border-l lg:border-slate-200/80 dark:lg:border-slate-800 lg:pl-6">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-md bg-emerald-50 dark:bg-emerald-950/20 text-emerald-555">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-extrabold text-slate-750 dark:text-slate-300 uppercase tracking-wider">Primary Career Growth Recommendations</span>
                  </div>
                  <ul className="space-y-2">
                    {(analysisResult.career_growth_suggestions || []).map((item, idx) => (
                      <li key={idx} className="text-xs text-slate-650 dark:text-slate-400 flex items-start gap-2 font-semibold">
                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20 w-5 h-5 rounded-md flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="mt-0.5">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </div>

          {/* 2. Structured checklist metrics audit */}
          <ChecklistAudit feedback={analysisResult.feedback} />

          {/* 3. Sectors clustering chart & extracted keywords */}
          <ClusteringMap analysisResult={analysisResult} />

          {/* 4. Skills lists and upgrade pathways */}
          <SkillUpgradePathway analysisResult={analysisResult} />

          {/* 5. Career placement advice checklist, actionable tips, curated videos */}
          <CareerHacks />

        </div>
      )}

    </div>
  );
}

