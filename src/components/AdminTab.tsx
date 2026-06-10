import React, { useState } from 'react';
import {
  Lock,
  Search,
  AlertTriangle,
  FileText,
  Download,
  User,
  CheckCircle,
  Info,
  Trash2,
  FolderClosed,
  Eye,
  Star,
  MapPin,
  BarChart3,
  Database,
  MessageSquare,
  Sparkles,
  XCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';
import { UserDbRecord, FeedbackDbRecord } from '../types';

interface AdminTabProps {
  adminUsername: string;
  setAdminUsername: React.Dispatch<React.SetStateAction<string>>;
  adminPassword: string;
  setAdminPassword: React.Dispatch<React.SetStateAction<string>>;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  adminError: string | null;
  setAdminError: React.Dispatch<React.SetStateAction<string | null>>;
  adminRecords: UserDbRecord[];
  loadingAdminRecords: boolean;
  onRefreshRecords: () => void;
  onDeleteRecord: (id: number) => void;
  allFeedback: FeedbackDbRecord[];
}

const PALETTE = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#22C55E', '#14B8A6'];

export default function AdminTab({
  adminUsername,
  setAdminUsername,
  adminPassword,
  setAdminPassword,
  isAdminLoggedIn,
  setIsAdminLoggedIn,
  adminError,
  setAdminError,
  adminRecords,
  loadingAdminRecords,
  onRefreshRecords,
  onDeleteRecord,
  allFeedback
}: AdminTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInspectRecord, setSelectedInspectRecord] = useState<UserDbRecord | null>(null);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: adminUsername, password: adminPassword })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAdminLoggedIn(true);
        onRefreshRecords();
      } else {
        setAdminError(data.error || "Wrong ID & Password Provided");
      }
    } catch (err: any) {
      setAdminError("Unable to communicate with authentication services.");
    }
  };

  // CSV Generator Downloader
  const handleDownloadCSV = () => {
    if (adminRecords.length === 0) return;
    const headers = [
      "Record ID", "Applicant Name", "Contact Email", "Contact Phone", 
      "IP Address", "Host Environment", "Dev OS", "LatLong Coordinates", "City", "State", "Country", 
      "Resume Name", "Predicted Role / Field", "Experience Level", "ATS score achieved", "Pages Evaluated", "Timestamp", "Connected Account Owner"
    ];

    const rows = adminRecords.map(r => [
      r.id,
      `"${(r.name || "").replace(/"/g, '""')}"`,
      `"${(r.email || "").replace(/"/g, '""')}"`,
      `"${(r.act_mob || "").replace(/"/g, '""')}"`,
      `"${(r.ip_add || "").replace(/"/g, '""')}"`,
      `"${(r.host_name || "").replace(/"/g, '""')}"`,
      `"${(r.os_name_ver || "").replace(/"/g, '""')}"`,
      `"${(r.latlong || "").replace(/"/g, '""')}"`,
      `"${(r.city || "").replace(/"/g, '""')}"`,
      `"${(r.state || "").replace(/"/g, '""')}"`,
      `"${(r.country || "").replace(/"/g, '""')}"`,
      `"${(r.pdf_name || "").replace(/"/g, '""')}"`,
      `"${(r.reco_field || "").replace(/"/g, '""')}"`,
      `"${(r.cand_level || "").replace(/"/g, '""')}"`,
      r.resume_score,
      r.page_no || "1",
      `"${r.timestamp || ""}"`,
      `"${r.owner_email || "Guest"}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `resume_analyzer_applicants_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Stats computation helpers for our 8 distinct Pie Charts
  const getGroupedCounts = (key: keyof UserDbRecord) => {
    const counts: Record<string, number> = {};
    adminRecords.forEach(r => {
      const val = r[key] ? String(r[key]) : "Unspecified";
      counts[val] = (counts[val] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const getScoreRangeData = () => {
    const ranges = {
      "Needs Work (0-50)": 0,
      "Adequate (51-70)": 0,
      "Strong (71-85)": 0,
      "Elite (86-100)": 0
    };
    adminRecords.forEach(r => {
      const s = Number(r.resume_score) || 0;
      if (s <= 50) ranges["Needs Work (0-50)"]++;
      else if (s <= 70) ranges["Adequate (51-70)"]++;
      else if (s <= 85) ranges["Strong (71-85)"]++;
      else ranges["Elite (86-100)"]++;
    });
    return Object.entries(ranges).map(([name, value]) => ({ name, value })).filter(x => x.value > 0);
  };

  const getUserAccountData = () => {
    let registered = 0;
    let guest = 0;
    adminRecords.forEach(r => {
      if (r.owner_email) registered++;
      else guest++;
    });
    return [
      { name: "Registered Members", value: registered },
      { name: "Guest / Temporary", value: guest }
    ].filter(x => x.value > 0);
  };

  const getRatingsPieData = () => {
    const stars = {
      "5 Stars": 0,
      "4 Stars": 0,
      "3 Stars": 0,
      "2 Stars": 0,
      "1 Star": 0
    };
    allFeedback.forEach(f => {
      const rating = Number(f.feed_score);
      if (rating === 5) stars["5 Stars"]++;
      else if (rating === 4) stars["4 Stars"]++;
      else if (rating === 3) stars["3 Stars"]++;
      else if (rating === 2) stars["2 Stars"]++;
      else if (rating === 1) stars["1 Star"]++;
    });
    return Object.entries(stars).map(([name, value]) => ({ name, value })).filter(x => x.value > 0);
  };

  const filteredRecords = adminRecords.filter(r => {
    const term = searchQuery.toLowerCase();
    return (
      (r.name && r.name.toLowerCase().includes(term)) ||
      (r.email && r.email.toLowerCase().includes(term)) ||
      (r.reco_field && r.reco_field.toLowerCase().includes(term)) ||
      (r.pdf_name && r.pdf_name.toLowerCase().includes(term)) ||
      (r.city && r.city.toLowerCase().includes(term)) ||
      (r.country && r.country.toLowerCase().includes(term))
    );
  });

  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6 animate-fade-in relative overflow-hidden">
        
        {/* Lock Head design */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold font-display leading-none text-slate-800 text-lg">Admin Login</h3>
            <p className="text-xs text-slate-500 leading-normal mt-1">
              Authorized personnel only. Fill in primary identity credentials below.
            </p>
          </div>
        </div>

        {adminError && (
          <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{adminError}</span>
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="text-[10px] font-extrabold text-slate-500 block mb-1 uppercase tracking-wide">
              ADMIN USERNAME
            </label>
            <input
              type="text"
              required
              placeholder="admin"
              value={adminUsername}
              onChange={(e) => setAdminUsername(e.target.value)}
              className="block w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-[10px] font-extrabold text-slate-500 block mb-1 uppercase tracking-wide">
              ADMIN SECRET PASSWORD
            </label>
            <input
              type="password"
              required
              placeholder="admin@resume-analyzer"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="block w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl transition-all h-10 tracking-widest uppercase cursor-pointer"
          >
            Access Terminal
          </button>
        </form>

        <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50 text-[11px] text-indigo-700 leading-relaxed text-center font-medium">
          💡 <b>Demands info</b>: Use <b>admin</b> & <b>admin@resume-analyzer</b> to login.
        </div>
      </div>
    );
  }

  // Loaded analytics data variables
  const ratingsChartData = getRatingsPieData();
  const fieldChartData = getGroupedCounts("reco_field");
  const expChartData = getGroupedCounts("cand_level");
  const scoreChartData = getScoreRangeData();
  const userCountChartData = getUserAccountData();
  const cityChartData = getGroupedCounts("city");
  const stateChartData = getGroupedCounts("state");
  const countryChartData = getGroupedCounts("country");

  return (
    <div className="space-y-10 animate-fade-in max-w-6xl mx-auto">
      
      {/* Header controls */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="text-xl font-extrabold font-display text-slate-800 tracking-tight">Parser Transaction Telemetries</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">Live corporate placement metrics tracker containing geographic details IP, experience metrics, other student trends.</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleDownloadCSV}
            disabled={adminRecords.length === 0}
            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-extrabold rounded-xl transition-all border border-indigo-150 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV Database</span>
          </button>
          
          <button
            onClick={onRefreshRecords}
            disabled={loadingAdminRecords}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            {loadingAdminRecords ? "Syncing Workspace..." : "Sync Logs Now"}
          </button>

          <button
            onClick={() => setIsAdminLoggedIn(false)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Terminal Logout
          </button>
        </div>
      </div>

      {/* Grid of 8 Distinct Pie Chart Analyses */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200/50 pb-2">
          <BarChart3 className="w-4.5 h-4.5 text-indigo-500" />
          <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">Demographic & ATS Analytics Matrix</h4>
        </div>

        {adminRecords.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500">
            <Database className="w-8 h-8 text-slate-350 mx-auto mb-2" />
            <p className="text-xs font-medium">Please submit at least one resume analysis to enable physical chart tracking.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* 1. Rating Scores pie */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-slate-400">1. SYSTEM RATINGS REVIEW</span>
              <h5 className="font-bold text-xs text-slate-700 truncate">Feedback Stars Allocation</h5>
              <div className="h-44 w-full relative flex items-center justify-center">
                {ratingsChartData.length === 0 ? (
                  <p className="text-[10px] text-slate-400 italic">No feedbacks registered</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={ratingsChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={35} outerRadius={50} paddingAngle={2}>
                        {ratingsChartData.map((entry, idx) => <Cell key={`cell-${idx}`} fill={PALETTE[idx % PALETTE.length]} />)}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="flex flex-wrap gap-x-2 gap-y-1 justify-center text-[9px] text-slate-500 font-mono">
                {ratingsChartData.map((item, idx) => (
                  <span key={idx} className="flex items-center gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: PALETTE[idx % PALETTE.length] }}></span>
                    {item.name}: {item.value}
                  </span>
                ))}
              </div>
            </div>

            {/* 2. Predicted Road Roles */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-slate-400">2. ROLE PREDICTIONS</span>
              <h5 className="font-bold text-xs text-slate-700 truncate">Sectors / Careers Targeted</h5>
              <div className="h-44 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={fieldChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={35} outerRadius={50} paddingAngle={2}>
                      {fieldChartData.map((entry, idx) => <Cell key={`cell-${idx}`} fill={PALETTE[idx % PALETTE.length]} />)}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-x-2 gap-y-1 justify-center text-[9px] text-slate-500 font-mono">
                {fieldChartData.map((item, idx) => (
                  <span key={idx} className="flex items-center gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: PALETTE[idx % PALETTE.length] }}></span>
                    {(item.name || "").substring(0, 15)}: {item.value}
                  </span>
                ))}
              </div>
            </div>

            {/* 3. Experiences */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-slate-400">3. EXPERIENCE LEVEL</span>
              <h5 className="font-bold text-xs text-slate-700 truncate">Student seniority metrics</h5>
              <div className="h-44 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={expChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={35} outerRadius={50} paddingAngle={2}>
                      {expChartData.map((entry, idx) => <Cell key={`cell-${idx}`} fill={PALETTE[idx % PALETTE.length]} />)}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-x-2 gap-y-1 justify-center text-[9px] text-slate-500 font-mono">
                {expChartData.map((item, idx) => (
                  <span key={idx} className="flex items-center gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: PALETTE[idx % PALETTE.length] }}></span>
                    {item.name}: {item.value}
                  </span>
                ))}
              </div>
            </div>

            {/* 4. Score Breakdown */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-slate-400">4. RESUME SCORE RANGE</span>
              <h5 className="font-bold text-xs text-slate-700 truncate">Overall ATS achievements</h5>
              <div className="h-44 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={scoreChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={35} outerRadius={50} paddingAngle={2}>
                      {scoreChartData.map((entry, idx) => <Cell key={`cell-${idx}`} fill={PALETTE[idx % PALETTE.length]} />)}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-x-2 gap-y-1 justify-center text-[9px] text-slate-500 font-mono font-mono">
                {scoreChartData.map((item, idx) => (
                  <span key={idx} className="flex items-center gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: PALETTE[idx % PALETTE.length] }}></span>
                    {item.name}: {item.value}
                  </span>
                ))}
              </div>
            </div>

            {/* 5. User Count link */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-slate-400">5. REGISTRATION TRAFFIC</span>
              <h5 className="font-bold text-xs text-slate-700 truncate">User account breakdown</h5>
              <div className="h-44 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={userCountChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={35} outerRadius={50} paddingAngle={2}>
                      {userCountChartData.map((entry, idx) => <Cell key={`cell-${idx}`} fill={PALETTE[idx % PALETTE.length]} />)}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-x-2 gap-y-1 justify-center text-[9px] text-slate-500 font-mono">
                {userCountChartData.map((item, idx) => (
                  <span key={idx} className="flex items-center gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: PALETTE[idx % PALETTE.length] }}></span>
                    {item.name}: {item.value}
                  </span>
                ))}
              </div>
            </div>

            {/* 6. City */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-slate-400">6. TOP USER CITIES</span>
              <h5 className="font-bold text-xs text-slate-700 truncate">City Origin Distribution</h5>
              <div className="h-44 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={cityChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={35} outerRadius={50} paddingAngle={2}>
                      {cityChartData.map((entry, idx) => <Cell key={`cell-${idx}`} fill={PALETTE[idx % PALETTE.length]} />)}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-x-2 gap-y-1 justify-center text-[9px] text-slate-500 font-mono">
                {cityChartData.slice(0, 4).map((item, idx) => (
                  <span key={idx} className="flex items-center gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: PALETTE[idx % PALETTE.length] }}></span>
                    {item.name}: {item.value}
                  </span>
                ))}
              </div>
            </div>

            {/* 7. State */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-slate-400">7. STATE REGIONS</span>
              <h5 className="font-bold text-xs text-slate-700 truncate">State / Province Traffic</h5>
              <div className="h-44 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={stateChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={35} outerRadius={50} paddingAngle={2}>
                      {stateChartData.map((entry, idx) => <Cell key={`cell-${idx}`} fill={PALETTE[idx % PALETTE.length]} />)}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-x-2 gap-y-1 justify-center text-[9px] text-slate-500 font-mono">
                {stateChartData.slice(0, 4).map((item, idx) => (
                  <span key={idx} className="flex items-center gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: PALETTE[idx % PALETTE.length] }}></span>
                    {item.name}: {item.value}
                  </span>
                ))}
              </div>
            </div>

            {/* 8. Country */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-slate-400">8. COUNTRY OF OPERATION</span>
              <h5 className="font-bold text-xs text-slate-700 truncate">Inbound Nations Evaluated</h5>
              <div className="h-44 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={countryChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={35} outerRadius={50} paddingAngle={2}>
                      {countryChartData.map((entry, idx) => <Cell key={`cell-${idx}`} fill={PALETTE[idx % PALETTE.length]} />)}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-x-2 gap-y-1 justify-center text-[9px] text-slate-500 font-mono">
                {countryChartData.slice(0, 4).map((item, idx) => (
                  <span key={idx} className="flex items-center gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: PALETTE[idx % PALETTE.length] }}></span>
                    {item.name}: {item.value}
                  </span>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* PDF Upload File Catalog repository view */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200/50 pb-2">
          <FolderClosed className="w-4.5 h-4.5 text-indigo-500" />
          <h4 className="font-extrabold text-sm text-slate-850 uppercase tracking-wider">Uploaded Resume Repository File System ("Uploaded Resume")</h4>
        </div>

        {adminRecords.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-550 italic text-xs">
            No resumé files currently recorded in virtual storage.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {adminRecords.map((r, itemIdx) => (
              <div key={itemIdx} className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-indigo-400/80 transition-all flex flex-col justify-between space-y-3 shadow-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <FileText className="w-4.5 h-4.5 text-indigo-500 shrink-0" />
                    <span className="font-extrabold text-xs text-slate-800 break-all select-all leading-tight truncate block max-w-[200px]" title={r.pdf_name || "untitled_resume.pdf"}>
                      {r.pdf_name || "untitled_resume.pdf"}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono leading-none">Record: #{r.id} • Vol: ~{r.page_no || 1} pg(s)</p>
                  <p className="text-[10px] text-slate-400">Owner: <span className="font-semibold text-slate-700">{r.owner_email || "Guest Token Log"}</span></p>
                </div>
                <div className="w-full h-px bg-slate-100"></div>
                <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl text-[10px] text-slate-500">
                  <span>Track Score: <b>{r.resume_score}</b></span>
                  <span>{r.cand_level}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedInspectRecord(r)}
                  className="w-full text-center py-1.5 border border-indigo-200 hover:bg-indigo-600 hover:text-white transition-all text-indigo-700 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer bg-white"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Extracted Details</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Database Search & Tabular Listing */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
          <div className="flex items-center gap-2">
            <Database className="w-4.5 h-4.5 text-indigo-500" />
            <h4 className="font-extrabold text-sm text-slate-850 uppercase tracking-wider">Applicant Database Records ({filteredRecords.length})</h4>
          </div>
          
          <div className="relative max-w-xs w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              placeholder="Search logs by name, email, roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-8 pr-4 py-1.5 bg-white border border-slate-300 rounded-xl text-[11px] focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-450"
            />
          </div>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold">No telemetry transactions match your query criteria.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase font-extrabold border-b border-slate-250 select-none">
                    <th className="px-6 py-3.5">ID / User Record</th>
                    <th className="px-6 py-3.5">File Details</th>
                    <th className="px-6 py-3.5">Predict Fields</th>
                    <th className="px-6 py-3.5">Telemetry Env</th>
                    <th className="px-6 py-3.5">Bound Owner</th>
                    <th className="px-6 py-3.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-650">
                  {filteredRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">{r.name}</p>
                        <p className="text-[10px] text-slate-500">{r.email}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{r.act_mob}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-700 max-w-[180px] truncate">{r.pdf_name}</p>
                        <p className="text-[10px] text-slate-500 font-mono">Pages: {r.page_no || '1'} • Token: {r.sec_token || 'N/A'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-bold">
                          {r.reco_field || 'Other'}
                        </span>
                        <p className="text-[10px] font-bold text-slate-600 mt-1">Score: {r.resume_score}/100 ({r.cand_level || 'Fresher'})</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-mono text-[9px] text-slate-500">{r.ip_add} ({r.city})</p>
                        <p className="text-[9px] text-slate-400 mt-0.5 font-mono truncate max-w-[170px]">{r.os_name_ver}</p>
                        <p className="text-[9px] text-slate-400 font-mono">{r.timestamp ? new Date(r.timestamp).toLocaleString() : 'N/A'}</p>
                      </td>
                      <td className="px-6 py-4 font-mono text-[10px] text-indigo-600 font-semibold">
                        {r.owner_email ? r.owner_email : <span className="text-slate-400 italic font-normal">Guest User</span>}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to permanently delete record ID ${r.id}?`)) {
                              onDeleteRecord(r.id);
                            }
                          }}
                          className="p-1 px-2.5 bg-rose-50 hover:bg-rose-100/80 text-rose-650 hover:text-rose-700 rounded-lg transition-all border border-rose-100 font-semibold flex items-center justify-center gap-1 cursor-pointer mx-auto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="text-[10px]">Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* User Comments and Feedback Audit Log Stream */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200/50 pb-2">
          <MessageSquare className="w-4.5 h-4.5 text-indigo-500" />
          <h4 className="font-extrabold text-sm text-slate-850 uppercase tracking-wider">User Feedbacks & Star audit Log</h4>
        </div>

        {allFeedback.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 italic text-xs">
            No active user ratings submitted yet on our review form.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allFeedback.map((feed) => (
              <div key={feed.id} className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-slate-350 transition-all space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-extrabold text-xs text-slate-800">{feed.feed_name}</h5>
                    <p className="text-[9px] text-slate-400 font-mono">{feed.feed_email} • {new Date(feed.timestamp).toDateString()}</p>
                  </div>
                  <div className="flex gap-0.5 select-none text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500 mt-0.5 shrink-0" />
                    <span className="text-[10px] font-bold font-mono">{feed.feed_score}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">"{feed.comments || 'No comment text provided.'}"</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* INSPECT DETAIL MODAL */}
      {selectedInspectRecord && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono uppercase bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-bold">NLP Extraction Log</span>
                <h4 className="font-extrabold text-lg text-slate-800">Inspection sheet for {selectedInspectRecord.name}</h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInspectRecord(null)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1 bg-slate-50 p-3 rounded-2xl">
                <p className="text-[10px] uppercase text-slate-400 font-mono font-bold leading-none">Core Personal Identifiers</p>
                <p className="text-slate-800 font-bold mt-1">Name: <span className="font-normal">{selectedInspectRecord.name}</span></p>
                <p className="text-slate-800 font-bold">Email: <span className="font-normal">{selectedInspectRecord.email}</span></p>
                <p className="text-slate-800 font-bold">Mobile: <span className="font-normal">{selectedInspectRecord.act_mob}</span></p>
              </div>

              <div className="space-y-1 bg-slate-50 p-3 rounded-2xl">
                <p className="text-[10px] uppercase text-slate-400 font-mono font-bold leading-none">Carrier Predictions & Level</p>
                <p className="text-slate-800 font-bold mt-1">Target Cluster: <span className="font-normal text-indigo-600 font-semibold">{selectedInspectRecord.reco_field}</span></p>
                <p className="text-slate-800 font-bold">Experience Range: <span className="font-normal">{selectedInspectRecord.cand_level}</span></p>
                <p className="text-slate-800 font-bold">Overall ATS score: <span className="text-indigo-700 font-extrabold">{selectedInspectRecord.resume_score}/100</span></p>
              </div>

              <div className="space-y-1 bg-slate-50 p-3 rounded-2xl md:col-span-2">
                <p className="text-[10px] uppercase text-slate-400 font-mono font-bold leading-none mb-1.5">Parsed Key Skills Matrix</p>
                {(() => {
                  try {
                    const parsed = JSON.parse(selectedInspectRecord.skills);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                      return (
                        <div className="flex flex-wrap gap-1">
                          {parsed.map((item: string, idx: number) => (
                            <span key={idx} className="px-2 py-0.5 bg-indigo-50 border border-indigo-150 text-[10px] text-indigo-700 rounded-lg">
                              {item}
                            </span>
                          ))}
                        </div>
                      );
                    }
                  } catch (e) {}
                  return <p className="text-slate-400 italic">No explicit parsed tech skills cataloged.</p>
                })()}
              </div>

              <div className="space-y-1 bg-slate-50 p-3 rounded-2xl md:col-span-2">
                <p className="text-[10px] uppercase text-slate-400 font-mono font-bold leading-none mb-1.5 font-bold">Recommended enhancements to study</p>
                {(() => {
                  try {
                    const parsed = JSON.parse(selectedInspectRecord.recommended_skills);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                      return (
                        <div className="flex flex-wrap gap-1">
                          {parsed.map((item: string, idx: number) => (
                            <span key={idx} className="px-2 py-0.5 bg-emerald-50 border border-emerald-150 text-[10px] text-emerald-700 rounded-lg font-semibold">
                              + {item}
                            </span>
                          ))}
                        </div>
                      );
                    }
                  } catch (e) {}
                  return <p className="text-slate-400 italic">No recommendations mapped.</p>
                })()}
              </div>

              <div className="space-y-1 bg-slate-50 p-3 rounded-2xl md:col-span-2">
                <p className="text-[10px] uppercase text-slate-400 font-mono font-bold leading-none mb-1 text-bold">Location & Network Environment Logs</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-mono text-slate-650">
                  <p>IP: <b>{selectedInspectRecord.ip_add}</b></p>
                  <p>City: <b>{selectedInspectRecord.city}</b></p>
                  <p>State: <b>{selectedInspectRecord.state}</b></p>
                  <p>Country: <b>{selectedInspectRecord.country}</b></p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedInspectRecord(null)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl cursor-pointer"
              >
                Close Inspect Window
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
