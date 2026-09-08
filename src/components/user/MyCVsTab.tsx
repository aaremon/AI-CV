import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Trash2,
  Download,
  Eye,
  Layers,
  Plus,
  Gauge,
  CheckCircle2,
  AlertCircle,
  Copy,
  ChevronRight,
  X,
  Briefcase,
  GraduationCap,
  Calendar,
  Sparkles,
  Check,
  ExternalLink
} from 'lucide-react';

interface MyCVsTabProps {
  loggedInUser: any;
  onNavigate: (tab: string) => void;
}

export default function MyCVsTab({ loggedInUser, onNavigate }: MyCVsTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'resumes' | 'versions'>('resumes');
  const [cvs, setCvs] = useState<any[]>([]);
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Interactivity
  const [selectedCv, setSelectedCv] = useState<any | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<any | null>(null);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [versionTargetCv, setVersionTargetCv] = useState<any | null>(null);
  const [newVersionName, setNewVersionName] = useState('');
  const [newVersionRole, setNewVersionRole] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteVersionId, setDeleteVersionId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchCvsAndVersions();
  }, [loggedInUser?.email]);

  const fetchCvsAndVersions = async () => {
    if (!loggedInUser?.email) return;
    setLoading(true);
    try {
      const email = encodeURIComponent(loggedInUser.email.toLowerCase().trim());
      const [cvRes, verRes] = await Promise.all([
        fetch(`/api/user/cvs?email=${email}`),
        fetch(`/api/user/versions?email=${email}`)
      ]);
      const cvData = await cvRes.json();
      const verData = await verRes.json();

      setCvs(cvData.cvs || []);
      setVersions(verData.versions || []);
    } catch (err) {
      console.error("Error fetching CVs and Versions:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCandidateName = (cv: any) => {
    return cv.applicant_name || cv.name || cv.data_json?.name || 'Aaryaman Thapa';
  };

  const getTargetRole = (cv: any) => {
    return cv.predicted_role || cv.reco_field || cv.data_json?.predicted_field || cv.data_json?.target_role || 'Target Role Not Specified';
  };

  const getFileName = (cv: any) => {
    return cv.resume_name || cv.pdf_name || cv.filename || 'Uploaded Document';
  };

  const getScore = (cv: any) => {
    const raw = cv.data_json?.scoring?.overallScore || cv.ats_score || cv.resume_score || '75';
    return parseInt(String(raw), 10);
  };

  const getSkillsList = (cv: any): string[] => {
    if (Array.isArray(cv.skills) && cv.skills.length > 0) return cv.skills;
    if (Array.isArray(cv.data_json?.current_skills) && cv.data_json.current_skills.length > 0) return cv.data_json.current_skills;
    if (typeof cv.skills === 'string') {
      try {
        const parsed = JSON.parse(cv.skills);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        return cv.skills.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
    }
    return [];
  };

  const getMissingSkills = (cv: any): string[] => {
    if (Array.isArray(cv.recommended_skills) && cv.recommended_skills.length > 0) return cv.recommended_skills;
    if (Array.isArray(cv.data_json?.missing_skills) && cv.data_json.missing_skills.length > 0) return cv.data_json.missing_skills;
    if (Array.isArray(cv.data_json?.recommended_skills)) return cv.data_json.recommended_skills;
    return [];
  };

  const handleDeleteCv = async (recordId: number) => {
    if (!loggedInUser?.email) return;
    try {
      const email = encodeURIComponent(loggedInUser.email.toLowerCase().trim());
      const res = await fetch(`/api/records/${recordId}?email=${email}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setCvs(prev => prev.filter(c => c.id !== recordId));
        if (selectedCv?.id === recordId) setSelectedCv(null);
        setDeleteId(null);
      }
    } catch (err) {
      console.error("Delete CV failed:", err);
    }
  };

  const handleDeleteVersion = async (versionId: number) => {
    if (!loggedInUser?.email) return;
    try {
      const email = encodeURIComponent(loggedInUser.email.toLowerCase().trim());
      const res = await fetch(`/api/user/versions/${versionId}?email=${email}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setVersions(prev => prev.filter(v => v.id !== versionId));
        if (selectedVersion?.id === versionId) setSelectedVersion(null);
        setDeleteVersionId(null);
      }
    } catch (err) {
      console.error("Delete Version failed:", err);
    }
  };

  const openCreateVersionModal = (targetCv?: any) => {
    const cvToUse = targetCv || selectedCv || (cvs.length > 0 ? cvs[0] : null);
    setVersionTargetCv(cvToUse);
    const defaultRole = cvToUse ? getTargetRole(cvToUse) : 'Target Role';
    setNewVersionRole(defaultRole);
    setNewVersionName(`${defaultRole} - Tailored Snapshot`);
    setShowVersionModal(true);
  };

  const handleCreateVersion = async () => {
    if (!loggedInUser?.email || !newVersionName) return;
    try {
      const cvToUse = versionTargetCv || (cvs.length > 0 ? cvs[0] : null);
      const score = cvToUse ? getScore(cvToUse) : 75;
      const role = newVersionRole || (cvToUse ? getTargetRole(cvToUse) : 'Custom Role');
      const candidate = cvToUse ? getCandidateName(cvToUse) : loggedInUser.name || 'Candidate';
      const skills = cvToUse ? getSkillsList(cvToUse) : [];

      const payload = {
        owner_email: loggedInUser.email.toLowerCase().trim(),
        name: newVersionName,
        version_number: `v${versions.length + 1}.0`,
        target_role: role,
        ats_score: score,
        cv_data: {
          applicant_name: candidate,
          degree: cvToUse?.data_json?.degree || cvToUse?.degree || 'Bachelor Degree',
          target_role: role,
          summary: `Tailored snapshot created for ${role}. Optimized with ATS target score baseline ${score}%.`,
          skills: skills.length > 0 ? skills : ['Communication', 'Teamwork', 'Critical Thinking'],
          highlights: [
            `Optimized specifically for ${role} job specifications`,
            `Baseline ATS compatibility calibrated at ${score}%`,
            `Includes customized skills breakdown and keywords`
          ]
        }
      };

      const res = await fetch('/api/user/versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setVersions(prev => [data.version, ...prev]);
        setNewVersionName('');
        setShowVersionModal(false);
        setActiveSubTab('versions');
      }
    } catch (err) {
      console.error("Version create failed:", err);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredCvs = cvs.filter(c => {
    const q = searchQuery.toLowerCase();
    const name = getCandidateName(c).toLowerCase();
    const role = getTargetRole(c).toLowerCase();
    const file = getFileName(c).toLowerCase();
    return name.includes(q) || role.includes(q) || file.includes(q);
  });

  const filteredVersions = versions.filter(v => {
    const q = searchQuery.toLowerCase();
    const name = (v.name || '').toLowerCase();
    const role = (v.target_role || '').toLowerCase();
    const verNum = (v.version_number || '').toLowerCase();
    return name.includes(q) || role.includes(q) || verNum.includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                My Resumes & Version History
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Manage your scanned CV records, ATS analysis reports, and tailored role versions.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openCreateVersionModal()}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-2xl transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Save Role Version</span>
          </button>

          <button
            onClick={() => onNavigate('ats')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Upload / Scan New CV</span>
          </button>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('resumes')}
            className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'resumes'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Scanned Resumes</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-extrabold ${
              activeSubTab === 'resumes' ? 'bg-indigo-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}>
              {cvs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('versions')}
            className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'versions'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Version History & Snapshots</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-extrabold ${
              activeSubTab === 'versions' ? 'bg-indigo-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}>
              {versions.length}
            </span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeSubTab === 'resumes' ? "Search resumes by name or role..." : "Search role versions..."}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-medium text-slate-400">Loading CV records & version history...</p>
        </div>
      ) : activeSubTab === 'resumes' ? (
        /* ==================== RESUMES TAB ==================== */
        filteredCvs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center mx-auto">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No CV records found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                Upload your resume to run an automated ATS scan and receive detailed scoring, keyword recommendations, and version tracking.
              </p>
            </div>
            <button
              onClick={() => onNavigate('ats')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Resume Now</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCvs.map((cv, idx) => {
              const score = getScore(cv);
              const candidateName = getCandidateName(cv);
              const targetRole = getTargetRole(cv);
              const fileName = getFileName(cv);
              const skills = getSkillsList(cv);
              const degree = cv.data_json?.degree || cv.degree;
              const candLevel = cv.cand_level || cv.data_json?.cand_level || 'Fresher';
              const dateStr = new Date(cv.timestamp || cv.created_at || Date.now()).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });

              return (
                <div
                  key={cv.id ? `my-cv-${cv.id}` : `my-cv-${idx}`}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-500/30 transition-all flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-4">
                    {/* Header Badges */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                          ID #{cv.id}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          {candLevel}
                        </span>
                      </div>

                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-extrabold text-xs ${
                        score >= 70
                          ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400'
                          : score >= 55
                          ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400'
                          : 'bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400'
                      }`}>
                        <Gauge className="w-3.5 h-3.5" />
                        <span>{score}% ATS</span>
                      </div>
                    </div>

                    {/* Candidate & Target Role */}
                    <div className="space-y-1">
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight line-clamp-1">
                        {candidateName}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        <Briefcase className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{targetRole}</span>
                      </div>
                    </div>

                    {/* Metadata Specs */}
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-semibold text-slate-700 dark:text-slate-300 shrink-0">File:</span>
                        <span className="truncate text-slate-600 dark:text-slate-300" title={fileName}>{fileName}</span>
                      </div>

                      {degree && (
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate text-slate-600 dark:text-slate-300" title={degree}>{degree}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-semibold text-slate-700 dark:text-slate-300 shrink-0">Scanned:</span>
                        <span>{dateStr}</span>
                      </div>
                    </div>

                    {/* Skills Preview */}
                    {skills.length > 0 && (
                      <div className="pt-2">
                        <div className="flex flex-wrap gap-1.5">
                          {skills.slice(0, 3).map((skill: string, sIdx: number) => (
                            <span
                              key={`skill-${sIdx}`}
                              className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 truncate max-w-[130px]"
                            >
                              {skill}
                            </span>
                          ))}
                          {skills.length > 3 && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                              +{skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => setSelectedCv(cv)}
                      className="flex-1 py-2 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-400 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Analysis</span>
                    </button>

                    <button
                      onClick={() => openCreateVersionModal(cv)}
                      className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-all cursor-pointer"
                      title="Save as Tailored Role Version"
                    >
                      <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </button>

                    <button
                      onClick={() => setDeleteId(cv.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-xl transition-all cursor-pointer"
                      title="Delete CV Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* ==================== VERSION HISTORY TAB ==================== */
        filteredVersions.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center mx-auto">
              <Layers className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No role versions saved yet</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                Save customized versions of your resume for specific job applications (e.g. UI/UX Designer, Frontend Developer, Product Analyst).
              </p>
            </div>
            <button
              onClick={() => openCreateVersionModal()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Version Snapshot</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVersions.map((version, idx) => {
              const verNum = version.version_number || `v${idx + 1}.0`;
              const score = version.ats_score || 75;
              const role = version.target_role || 'General Role';
              const candidate = version.cv_data?.applicant_name || loggedInUser.name || 'Candidate';
              const summary = version.cv_data?.summary || 'Tailored role version snapshot.';
              const skills = version.cv_data?.skills || [];
              const dateStr = new Date(version.created_at || Date.now()).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });

              return (
                <div
                  key={version.id ? `ver-${version.id}` : `ver-${idx}`}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-500/30 transition-all flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-4">
                    {/* Header Badges */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-extrabold px-3 py-1 rounded-full bg-indigo-600 text-white shadow-sm">
                          {verNum}
                        </span>
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {candidate}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs">
                        <Gauge className="w-3.5 h-3.5" />
                        <span>{score}% ATS</span>
                      </div>
                    </div>

                    {/* Version Title & Role */}
                    <div className="space-y-1">
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight line-clamp-1">
                        {version.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        <Briefcase className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{role}</span>
                      </div>
                    </div>

                    {/* Summary Excerpt */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 font-sans">
                      {summary}
                    </p>

                    {/* Date & Metadata */}
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Created: {dateStr}</span>
                      </div>
                    </div>

                    {/* Skills Tags */}
                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {skills.slice(0, 4).map((sk: string, sIdx: number) => (
                          <span
                            key={`v-sk-${sIdx}`}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                          >
                            {sk}
                          </span>
                        ))}
                        {skills.length > 4 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                            +{skills.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => setSelectedVersion(version)}
                      className="flex-1 py-2 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-400 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Snapshot</span>
                    </button>

                    <button
                      onClick={() => copyToClipboard(JSON.stringify(version, null, 2), `copy-${version.id}`)}
                      className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-all cursor-pointer"
                      title="Copy Version JSON"
                    >
                      {copiedId === `copy-${version.id}` ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-500" />
                      )}
                    </button>

                    <button
                      onClick={() => setDeleteVersionId(version.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-xl transition-all cursor-pointer"
                      title="Delete Version"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* ==================== SELECTED CV DETAIL MODAL ==================== */}
      {selectedCv && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    ID #{selectedCv.id}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
                    {selectedCv.cand_level || selectedCv.data_json?.cand_level || 'Fresher'}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1.5">
                  {getCandidateName(selectedCv)}
                </h2>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1.5 mt-0.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>{getTargetRole(selectedCv)}</span>
                </p>
              </div>

              <button
                onClick={() => setSelectedCv(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score & Key Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-indigo-50 dark:bg-indigo-950/60 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900">
                <span className="text-[10px] text-indigo-600 dark:text-indigo-300 font-bold uppercase tracking-wider block">
                  Overall ATS Score
                </span>
                <span className="text-2xl font-black text-indigo-900 dark:text-indigo-100">
                  {getScore(selectedCv)}%
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block">
                  File Document
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate block mt-1" title={getFileName(selectedCv)}>
                  {getFileName(selectedCv)}
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block">
                  Degree / Education
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate block mt-1">
                  {selectedCv.data_json?.degree || selectedCv.degree || 'Not Specified'}
                </span>
              </div>
            </div>

            {/* Detected Skills */}
            {getSkillsList(selectedCv).length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Current Skills Detected ({getSkillsList(selectedCv).length})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {getSkillsList(selectedCv).map((sk: string, sIdx: number) => (
                    <span
                      key={`modal-sk-${sIdx}`}
                      className="text-xs px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Skills & Recommendations */}
            {getMissingSkills(selectedCv).length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Recommended Skills to Upgrade</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {getMissingSkills(selectedCv).map((sk: string, sIdx: number) => (
                    <span
                      key={`modal-rec-${sIdx}`}
                      className="text-xs px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900 font-medium"
                    >
                      +{sk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Key Strengths & Feedback */}
            {Array.isArray(selectedCv.data_json?.strengths) && selectedCv.data_json.strengths.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Evaluated Candidate Strengths
                </h4>
                <div className="space-y-1.5">
                  {selectedCv.data_json.strengths.map((st: string, stIdx: number) => (
                    <div key={`str-${stIdx}`} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{st}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Courses */}
            {Array.isArray(selectedCv.courses) && selectedCv.courses.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Curated Learning Pathway
                </h4>
                <div className="space-y-2">
                  {selectedCv.courses.slice(0, 3).map((crs: any, cIdx: number) => (
                    <div
                      key={`course-${cIdx}`}
                      className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl flex items-center justify-between gap-3 text-xs"
                    >
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {crs.title || crs.name || `Course #${cIdx + 1}`}
                      </span>
                      {crs.link && (
                        <a
                          href={crs.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 dark:text-indigo-400 font-bold shrink-0 flex items-center gap-1 hover:underline"
                        >
                          <span>Explore</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  const cv = selectedCv;
                  setSelectedCv(null);
                  openCreateVersionModal(cv);
                }}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
              >
                <Layers className="w-4 h-4" />
                <span>Save as Version Snapshot</span>
              </button>

              <button
                onClick={() => setSelectedCv(null)}
                className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-200 transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SELECTED VERSION DETAIL MODAL ==================== */}
      {selectedVersion && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-mono font-extrabold px-3 py-1 rounded-full bg-indigo-600 text-white">
                  {selectedVersion.version_number || 'v1.0'}
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-2">
                  {selectedVersion.name}
                </h2>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 mt-0.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Target Role: {selectedVersion.target_role}</span>
                </p>
              </div>

              <button
                onClick={() => setSelectedVersion(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ATS Score & Candidate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-indigo-50 dark:bg-indigo-950/60 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900">
                <span className="text-[10px] text-indigo-600 dark:text-indigo-300 font-bold uppercase tracking-wider block">
                  Snapshot ATS Baseline
                </span>
                <span className="text-2xl font-black text-indigo-900 dark:text-indigo-100">
                  {selectedVersion.ats_score || 75}%
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block">
                  Candidate Profile
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white block mt-1">
                  {selectedVersion.cv_data?.applicant_name || loggedInUser.name || 'Candidate'}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  {selectedVersion.cv_data?.degree || 'Degree not specified'}
                </span>
              </div>
            </div>

            {/* Version Focus Summary */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Tailored Objective & Strategy
              </h4>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                {selectedVersion.cv_data?.summary || 'Tailored snapshot specifically calibrated for this target role.'}
              </div>
            </div>

            {/* Tailored Skills */}
            {Array.isArray(selectedVersion.cv_data?.skills) && selectedVersion.cv_data.skills.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Targeted Skill Matrix
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedVersion.cv_data.skills.map((sk: string, sIdx: number) => (
                    <span
                      key={`v-detail-sk-${sIdx}`}
                      className="text-xs px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Highlights */}
            {Array.isArray(selectedVersion.cv_data?.highlights) && selectedVersion.cv_data.highlights.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Role Highlights & Impact Points
                </h4>
                <div className="space-y-1.5">
                  {selectedVersion.cv_data.highlights.map((hl: string, hIdx: number) => (
                    <div key={`v-hl-${hIdx}`} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => copyToClipboard(JSON.stringify(selectedVersion, null, 2), `copy-modal-${selectedVersion.id}`)}
                className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                {copiedId === `copy-modal-${selectedVersion.id}` ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-500" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setSelectedVersion(null)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== CREATE VERSION MODAL ==================== */}
      {showVersionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Save Custom Role Version
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Create a tailored resume version snapshot calibrated for specific job applications.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                  Version Title / Identifier
                </label>
                <input
                  type="text"
                  value={newVersionName}
                  onChange={(e) => setNewVersionName(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer - Google"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                  Target Job Role
                </label>
                <input
                  type="text"
                  value={newVersionRole}
                  onChange={(e) => setNewVersionRole(e.target.value)}
                  placeholder="e.g. UI/UX Design, Software Development"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {versionTargetCv && (
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl border border-indigo-100 dark:border-indigo-900 text-xs">
                  <span className="font-semibold text-indigo-900 dark:text-indigo-200 block">
                    Source Scan: {getCandidateName(versionTargetCv)}
                  </span>
                  <span className="text-[11px] text-indigo-700 dark:text-indigo-300 block mt-0.5">
                    Baseline ATS Score: {getScore(versionTargetCv)}% • File: {getFileName(versionTargetCv)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowVersionModal(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateVersion}
                disabled={!newVersionName.trim()}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl cursor-pointer transition-all shadow-md shadow-indigo-600/20"
              >
                Save Version Snapshot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== DELETE RESUME MODAL ==================== */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete Resume Record?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                This will permanently erase this CV scan record and associated reports from your account.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCv(deleteId)}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== DELETE VERSION MODAL ==================== */}
      {deleteVersionId !== null && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete Role Version?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                This will permanently remove this customized role snapshot from your version history.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeleteVersionId(null)}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteVersion(deleteVersionId)}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
