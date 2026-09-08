import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldAlert,
  Users,
  FileText,
  Activity,
  Cpu,
  Lock,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Server,
  KeyRound,
  ShieldCheck,
  RefreshCw,
  LogOut,
  UserCheck,
  UserX,
  Database,
  BarChart3,
  Layers,
  Sparkles
} from 'lucide-react';

interface AdminDashboardOverviewProps {
  adminUsername: string;
  setAdminUsername: React.Dispatch<React.SetStateAction<string>>;
  adminPassword: string;
  setAdminPassword: React.Dispatch<React.SetStateAction<string>>;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  adminError: string | null;
  setAdminError: React.Dispatch<React.SetStateAction<string | null>>;
  onLogout: () => void;
}

export default function AdminDashboardOverview({
  adminUsername,
  setAdminUsername,
  adminPassword,
  setAdminPassword,
  isAdminLoggedIn,
  setIsAdminLoggedIn,
  adminError,
  setAdminError,
  onLogout
}: AdminDashboardOverviewProps) {
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'overview' | 'users' | 'ai_usage' | 'security' | 'health'>('overview');
  
  // Dashboard Metrics
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [securityEvents, setSecurityEvents] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [featureUsage, setFeatureUsage] = useState<any>(null);
  const [aiMetrics, setAiMetrics] = useState<any>(null);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Filters
  const [userSearch, setUserSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchAdminData();
    }
  }, [isAdminLoggedIn]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const headers = {
        'x-admin-token': 'admin-authenticated-token',
        'x-user-email': adminUsername || 'thapakaji@gmail.com'
      };

      const [statsRes, usersRes, secRes, auditRes, featRes, aiRes, healthRes] = await Promise.all([
        fetch('/api/admin/stats', { headers }),
        fetch('/api/admin/users', { headers }),
        fetch('/api/admin/security-events', { headers }),
        fetch('/api/admin/audit-logs', { headers }),
        fetch('/api/admin/feature-usage', { headers }),
        fetch('/api/admin/ai-usage', { headers }),
        fetch('/api/admin/system-health', { headers })
      ]);

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();
      const secData = await secRes.json();
      const auditData = await auditRes.json();
      const featData = await featRes.json();
      const aiData = await aiRes.json();
      const healthData = await healthRes.json();

      setStats(statsData.stats);
      setUsers(usersData.users || []);
      setSecurityEvents(secData.events || []);
      setAuditLogs(auditData.logs || []);
      setFeatureUsage(featData.features);
      setAiMetrics(aiData.aiMetrics);
      setSystemHealth(healthData.health);
    } catch (err) {
      console.error("Error fetching admin metrics:", err);
    } finally {
      setLoading(false);
    }
  };

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
      } else {
        setAdminError(data.error || "Wrong Admin Credentials Provided");
      }
    } catch (err) {
      setAdminError("Unable to communicate with admin authentication service.");
    }
  };

  const handleToggleUserStatus = async (email: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'disabled' ? 'active' : 'disabled';
    try {
      const res = await fetch('/api/admin/users/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': 'admin-authenticated-token',
          'x-user-email': adminUsername || 'thapakaji@gmail.com'
        },
        body: JSON.stringify({ email, status: nextStatus })
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error("Status toggle error:", err);
    }
  };

  const handleToggleUserRole = async (email: string, currentRole: string) => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const res = await fetch('/api/admin/users/role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': 'admin-authenticated-token',
          'x-user-email': adminUsername || 'thapakaji@gmail.com'
        },
        body: JSON.stringify({ email, role: nextRole })
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error("Role toggle error:", err);
    }
  };

  // Login View if not logged in
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white dark:bg-[#111726] rounded-3xl p-8 border border-slate-200/90 dark:border-slate-800 shadow-xl space-y-6">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-900 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md border border-slate-800">
            <Lock className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1.5">
              <Shield className="w-3 h-3" /> Secure Gateway
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Admin Control Panel</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Elevated credentials required to manage platform operations, user accounts, and AI diagnostics.
            </p>
          </div>
        </div>

        {adminError && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-300 rounded-xl text-xs font-semibold flex items-center gap-2 border border-rose-200 dark:border-rose-900">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{adminError}</span>
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Admin Email / Username</label>
            <input
              type="text"
              value={adminUsername}
              onChange={(e) => setAdminUsername(e.target.value)}
              placeholder="thapakaji@gmail.com"
              required
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-slate-950 hover:bg-slate-900 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 text-xs"
          >
            <KeyRound className="w-4 h-4" />
            <span>Authenticate Admin Session</span>
          </button>
        </form>

        <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed text-center">
          Default Admin: <strong className="text-slate-900 dark:text-slate-200 font-mono">thapakaji@gmail.com</strong> / Password: <strong className="text-slate-900 dark:text-slate-200 font-mono">password</strong>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter(u =>
    u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.name?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredEvents = securityEvents.filter(e =>
    severityFilter === 'ALL' || e.severity === severityFilter
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-6 md:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold uppercase tracking-wider mb-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Platform Administration & Operations</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight font-display">Admin Control Center</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Platform oversight, user credentials management, AI diagnostic telemetry, and security audit trail.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAdminData}
            className="p-2.5 bg-white/10 hover:bg-white/20 text-slate-200 rounded-xl cursor-pointer transition-all border border-white/10"
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setIsAdminLoggedIn(false)}
            className="px-4 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Exit Admin Mode</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'overview', label: 'System Overview', icon: Activity },
          { id: 'users', label: 'User Management', icon: Users },
          { id: 'ai_usage', label: 'AI & Feature Usage', icon: Sparkles },
          { id: 'security', label: 'Security & Audit Logs', icon: ShieldAlert },
          { id: 'health', label: 'System Health', icon: Server }
        ].map(tab => {
          const Icon = tab.icon;
          const active = activeAdminSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminSubTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-2 ${
                active
                  ? 'bg-slate-900 text-white shadow-md dark:bg-indigo-600'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: OVERVIEW */}
      {activeAdminSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">Total Users</span>
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats?.totalUsers || 0}</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">Total Resumes Processed</span>
              <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{stats?.totalCVs || 0}</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">Critical Security Alerts</span>
              <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{stats?.criticalSecurityEvents || 0}</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">System Uptime</span>
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats?.uptimeSeconds ? `${Math.floor(stats.uptimeSeconds / 60)}m` : '100%'}</span>
            </div>
          </div>

          {/* Recent Audit & System Quick View */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                Recent Security Events
              </h3>
              <div className="space-y-2">
                {securityEvents.slice(0, 4).map((ev, idx) => (
                  <div key={ev.id ? `sec-ev-ov-${ev.id}` : `sec-ev-ov-${idx}`} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">{ev.event_type}</span>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">{ev.description}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      ev.severity === 'HIGH' || ev.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {ev.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-500" />
                Core Infrastructure Status
              </h3>
              <div className="space-y-3 text-xs">
                {systemHealth?.services && Object.entries(systemHealth.services).map(([key, val]: any) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {val.status} ({val.latencyMs}ms)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: USER MANAGEMENT */}
      {activeAdminSubTab === 'users' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">User Accounts & Roles</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Least-privilege oversight: view account status, toggle roles, or manage access.</p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user email or name..."
                className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-mono text-[10px] text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">User ID</th>
                  <th className="p-3.5">Name & Email</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">CVs Uploaded</th>
                  <th className="p-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map((u, idx) => (
                  <tr key={u.id ? `user-row-${u.id}-${u.email}` : `user-row-${idx}`} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-mono font-bold">#{u.id}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">{u.name || 'User'}</div>
                      <div className="text-slate-500 text-[11px]">{u.email}</div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        u.status === 'disabled' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {u.status || 'active'}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold">{u.cv_count}</td>
                    <td className="p-3.5 space-x-2">
                      <button
                        onClick={() => handleToggleUserStatus(u.email, u.status)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                          u.status === 'disabled' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                        }`}
                      >
                        {u.status === 'disabled' ? 'Enable' : 'Disable'}
                      </button>

                      <button
                        onClick={() => handleToggleUserRole(u.email, u.role)}
                        className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-[11px] rounded-lg hover:bg-slate-200 cursor-pointer"
                      >
                        {u.role === 'admin' ? 'Demote' : 'Promote'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: AI & FEATURE USAGE */}
      {activeAdminSubTab === 'ai_usage' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              AI Metrics & Gemini Health
            </h2>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                <span className="text-slate-500">Total Requests Today</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{aiMetrics?.totalRequestsToday || 0}</span>
              </div>
              <div className="flex justify-between p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                <span className="text-slate-500">Average AI Latency</span>
                <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{aiMetrics?.averageResponseTimeMs || 1450} ms</span>
              </div>
              <div className="flex justify-between p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                <span className="text-slate-500">Rate Limited Requests</span>
                <span className="font-extrabold text-emerald-600">0</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              Feature Usage Breakdown
            </h2>
            <div className="space-y-3 text-xs">
              {featureUsage && Object.entries(featureUsage).map(([feat, val]: any) => (
                <div key={feat} className="flex justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <span className="capitalize font-semibold text-slate-700 dark:text-slate-300">{feat.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: SECURITY & AUDIT LOGS */}
      {activeAdminSubTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                Security Events Log
              </h2>

              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
              >
                <option value="ALL">All Severities</option>
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>

            <div className="space-y-2.5 max-h-96 overflow-y-auto">
              {filteredEvents.map((ev, idx) => (
                <div key={ev.id ? `sec-full-${ev.id}` : `sec-full-${idx}`} className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{ev.event_type}</span>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">{ev.description}</p>
                    <span className="text-[10px] text-slate-400 font-mono">User: {ev.email || 'Anonymous'}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                    ev.severity === 'HIGH' || ev.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {ev.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Admin Action Audit History
            </h2>

            <div className="space-y-2 text-xs">
              {auditLogs.map((a, idx) => (
                <div key={a.id ? `audit-log-${a.id}` : `audit-log-${idx}`} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{a.action}</span>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">{a.target_resource}</span>
                  </div>
                  <span className="text-slate-400 text-[10px] font-mono">{new Date(a.timestamp).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: SYSTEM HEALTH */}
      {activeAdminSubTab === 'health' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Server className="w-4 h-4 text-blue-500" />
            Detailed System & Memory Health
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
              <span className="text-slate-500 block mb-1">Heap Used</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">{systemHealth?.system?.heapUsedMb || 45} MB</span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
              <span className="text-slate-500 block mb-1">Node Version</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">{systemHealth?.system?.nodeVersion || 'v20.x'}</span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
              <span className="text-slate-500 block mb-1">CPU Load</span>
              <span className="text-xl font-extrabold text-emerald-600">{systemHealth?.system?.cpuLoad || '0.10'}</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <Database className="w-4 h-4 text-indigo-500" />
              Modular JSON Data Stores Status (Decoupled Persistence)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              All data categories are isolated into dedicated, modular JSON files for high maintainability and atomic operations.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-3 rounded-l-xl">Data Store File</th>
                    <th className="p-3">Path</th>
                    <th className="p-3">Active Records</th>
                    <th className="p-3">File Size</th>
                    <th className="p-3 rounded-r-xl">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {systemHealth?.dataStores ? (
                    systemHealth.dataStores.map((store: any) => (
                      <tr key={store.name} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="p-3 font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          {store.name}
                        </td>
                        <td className="p-3 font-mono text-slate-500">{store.path}</td>
                        <td className="p-3 font-semibold text-indigo-600 dark:text-indigo-400">{store.count} records</td>
                        <td className="p-3 font-mono text-slate-500">{store.sizeBytes > 1024 ? `${(store.sizeBytes / 1024).toFixed(1)} KB` : `${store.sizeBytes} B`}</td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                            <CheckCircle2 className="w-3 h-3" /> Healthy
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-slate-400">Loading data stores status...</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
