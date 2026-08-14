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
  X
} from 'lucide-react';

interface MyCVsTabProps {
  loggedInUser: any;
  onNavigate: (tab: string) => void;
}

export default function MyCVsTab({ loggedInUser, onNavigate }: MyCVsTabProps) {
  const [cvs, setCvs] = useState<any[]>([]);
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCv, setSelectedCv] = useState<any | null>(null);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [newVersionName, setNewVersionName] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchCvsAndVersions();
  }, [loggedInUser?.email]);

  const fetchCvsAndVersions = async () => {
    if (!loggedInUser?.email) return;
    setLoading(true);
    try {
      const email = encodeURIComponent(loggedInUser.email);
      const [cvRes, verRes] = await Promise.all([
        fetch(`/api/user/cvs?email=${email}`),
        fetch(`/api/user/versions?email=${email}`)
      ]);
      const cvData = await cvRes.json();
      const verData = await verRes.json();

      setCvs(cvData.cvs || []);
      setVersions(verData.versions || []);
    } catch (err) {
      console.error("Error fetching CVs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCv = async (recordId: number) => {
    if (!loggedInUser?.email) return;
    try {
      const email = encodeURIComponent(loggedInUser.email);
      const res = await fetch(`/api/records/${recordId}?email=${email}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setCvs(prev => prev.filter(c => c.id !== recordId));
        if (selectedCv?.id === recordId) setSelectedCv(null);
        setDeleteId(null);
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleCreateVersion = async () => {
    if (!loggedInUser?.email || !selectedCv || !newVersionName) return;
    try {
      const res = await fetch('/api/user/versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          owner_email: loggedInUser.email,
          name: newVersionName,
          version_number: `v${versions.length + 1}.0`,
          target_role: selectedCv.predicted_role || 'Custom Role',
          ats_score: parseInt(selectedCv.data_json?.scoring?.overallScore || '80', 10),
          cv_data: selectedCv.data_json || {}
        })
      });
      const data = await res.json();
      if (data.success) {
        setVersions(prev => [...prev, data.version]);
        setNewVersionName('');
        setShowVersionModal(false);
      }
    } catch (err) {
      console.error("Version create failed:", err);
    }
  };

  const filteredCvs = cvs.filter(c =>
    (c.applicant_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.predicted_role || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            My Resumes & Version History
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your uploaded CVs, ATS score reports, and role-specific versions.
          </p>
        </div>

        <button
          onClick={() => onNavigate('ats')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl shadow-lg transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload / Scan New CV</span>
        </button>
      </div>

      {/* Search Bar & Grid */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by candidate name or target role..."
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading CV records...</div>
        ) : filteredCvs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-800 space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">No CV records found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Upload your CV to run an ATS scan and create versions.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCvs.map((cv, idx) => {
              const score = parseInt(cv.data_json?.scoring?.overallScore || cv.ats_score || '75', 10);
              return (
                <div
                  key={cv.id ? `my-cv-${cv.id}` : `my-cv-${idx}`}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-500/30 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                        ID #{cv.id}
                      </span>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs">
                        <Gauge className="w-3.5 h-3.5" />
                        <span>{score}% ATS</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                        {cv.applicant_name || 'Resume Document'}
                      </h3>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                        {cv.predicted_role || 'Target Role Not Specified'}
                      </p>
                    </div>

                    <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div><span className="font-semibold text-slate-700 dark:text-slate-300">File:</span> {cv.resume_name || 'Uploaded Document'}</div>
                      <div><span className="font-semibold text-slate-700 dark:text-slate-300">Scanned:</span> {new Date(cv.timestamp || Date.now()).toLocaleDateString()}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => setSelectedCv(cv)}
                      className="flex-1 py-2 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-400 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Analysis</span>
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
        )}
      </div>

      {/* Selected CV Detail Modal */}
      {selectedCv && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {selectedCv.applicant_name || 'Resume Details'}
                </h2>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                  {selectedCv.predicted_role}
                </p>
              </div>

              <button
                onClick={() => setSelectedCv(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ATS Score Card */}
            <div className="bg-indigo-50 dark:bg-indigo-950/60 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-900 flex items-center justify-between">
              <div>
                <span className="text-xs text-indigo-600 dark:text-indigo-300 font-bold uppercase tracking-wider block">Overall ATS Score</span>
                <span className="text-3xl font-extrabold text-indigo-900 dark:text-indigo-100">
                  {selectedCv.data_json?.scoring?.overallScore || selectedCv.ats_score || '80'}%
                </span>
              </div>
              <button
                onClick={() => {
                  setShowVersionModal(true);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Layers className="w-4 h-4" />
                <span>Save as Version</span>
              </button>
            </div>

            {/* Raw Analysis Content Preview */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Executive Overview</h4>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
                {selectedCv.data_json?.summary || selectedCv.data_json?.overall_feedback || "No raw summary generated for this record."}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
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

      {/* Save Version Modal */}
      {showVersionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Save Custom Role Version</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Create a tailored version snapshot for specific job applications.
            </p>

            <input
              type="text"
              value={newVersionName}
              onChange={(e) => setNewVersionName(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer - Google"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowVersionModal(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateVersion}
                disabled={!newVersionName}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Save Version
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete Resume Record?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                This will permanently erase this CV scan record and associated reports.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCv(deleteId)}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
