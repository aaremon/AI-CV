import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Copy,
  Trash2,
  Download,
  Mail,
  UserCheck,
  Linkedin,
  Sparkles,
  Check,
  Plus
} from 'lucide-react';

interface GeneratedDocsTabProps {
  loggedInUser: any;
  onNavigate: (tab: string) => void;
}

export default function GeneratedDocsTab({ loggedInUser, onNavigate }: GeneratedDocsTabProps) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, [loggedInUser?.email]);

  const fetchDocuments = async () => {
    if (!loggedInUser?.email) return;
    setLoading(true);
    try {
      const email = encodeURIComponent(loggedInUser.email);
      const res = await fetch(`/api/user/documents?email=${email}`);
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (err) {
      console.error("Error fetching documents:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (docId: number) => {
    if (!loggedInUser?.email) return;
    try {
      const email = encodeURIComponent(loggedInUser.email);
      const res = await fetch(`/api/user/documents/${docId}?email=${email}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setDocuments(prev => prev.filter(d => d.id !== docId));
        if (selectedDoc?.id === docId) setSelectedDoc(null);
      }
    } catch (err) {
      console.error("Failed to delete document:", err);
    }
  };

  const handleCopy = (docId: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(docId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredDocs = documents.filter(d => {
    const matchesType = filterType === 'ALL' || d.type === filterType;
    const matchesSearch = (d.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (d.content || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            Generated Career Documents
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Access, copy, or export your AI-generated cover letters, bios, summaries, and outreach messages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('cover_letter')}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-2xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Cover Letter</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {['ALL', 'cover_letter', 'bio', 'email', 'linkedin'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                filterType === type
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              {type === 'ALL' ? 'All Documents' : type.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>

        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search generated documents..."
            className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Document Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading documents...</div>
      ) : filteredDocs.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-800 space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">No documents saved yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Generate cover letters or recruiter outreach emails to see them saved here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocs.map((doc, idx) => (
            <div
              key={doc.id ? `doc-${doc.id}` : `doc-${idx}`}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-300">
                    {doc.type?.replace('_', ' ') || 'Document'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(doc.created_at || Date.now()).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                  {doc.title || 'Untitled Document'}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed font-mono bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  {doc.content}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => handleCopy(doc.id, doc.content)}
                  className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedId === doc.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-xl cursor-pointer"
                  title="Delete Document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
