import React, { useState } from 'react';
import { Lock, Search, AlertTriangle, FileText, Download, User, CheckCircle, Info, Trash2 } from 'lucide-react';
import { UserDbRecord } from '../types';

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
}

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
  onDeleteRecord
}: AdminTabProps) {
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredRecords = adminRecords.filter(r => {
    const term = searchQuery.toLowerCase();
    return (
      (r.name && r.name.toLowerCase().includes(term)) ||
      (r.email && r.email.toLowerCase().includes(term)) ||
      (r.reco_field && r.reco_field.toLowerCase().includes(term)) ||
      (r.pdf_name && r.pdf_name.toLowerCase().includes(term))
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

        <div className="bg-slate-55 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50 text-[11px] text-indigo-700 leading-relaxed text-center font-medium">
          💡 <b>Demands info</b>: Use <b>admin</b> & <b>admin@resume-analyzer</b> to login.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h3 className="text-xl font-extrabold font-display text-slate-800 tracking-tight">Parser Transaction Telemetries</h3>
          <p className="text-xs text-slate-500">Live tracker audit logs containing geographic IP details, browser environment payloads, and user links.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsAdminLoggedIn(false)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Terminal Lockout
          </button>
          <button
            onClick={onRefreshRecords}
            disabled={loadingAdminRecords}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            {loadingAdminRecords ? "Syncing..." : "Sync Logs Now"}
          </button>
        </div>
      </div>

      {/* Database Search Filter */}
      <div className="relative max-w-md">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          placeholder="Search logs by applicant name, email format, track fields, or files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-450"
        />
      </div>

      {/* Grid listing */}
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
              <tbody className="divide-y divide-slate-100 text-xs">
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
  );
}
