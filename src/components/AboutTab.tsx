import React, { useState } from 'react';
import { 
  Sparkles, 
  Cpu, 
  Target, 
  Layers, 
  ArrowRight, 
  Database, 
  Server, 
  Globe, 
  Network, 
  ArrowLeftRight, 
  Key, 
  FileCode, 
  FileText, 
  User, 
  ChevronRight, 
  Info,
  Layers3,
  Search,
  BookOpen
} from 'lucide-react';

export default function AboutTab() {
  const [activeDiagram, setActiveDiagram] = useState<'architecture' | 'dfd' | 'erd'>('architecture');

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-fade-in py-4">
      {/* Editorial Lead Section with left accent bar */}
      <div className="border-l-4 border-[#0f172a] dark:border-white pl-6 space-y-3">
        <h2 className="text-3xl font-black font-display tracking-tight text-slate-900 dark:text-white uppercase">
          Technology & Specifications
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          Mero Match is a robust fullstack platform designed using a secure reactive web architecture. Explore the live interactive system structural blueprints, data flows, and database schemas below.
        </p>
      </div>

      {/* Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-[#141c2f] rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-800 dark:text-white font-bold select-none">
            <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white tracking-tight">Structured Parsing Weights</h3>
          <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
            Resumes are parsed and filtered dynamically across nine core parameters to construct an aggregate score out of 100:
          </p>
          
          <ul className="space-y-2 pt-2 text-[11px] text-slate-650 dark:text-slate-400 font-mono">
            <li className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-1">
              <span>Contact & Project Information</span>
              <span className="font-bold text-slate-950 dark:text-white">19 Points</span>
            </li>
            <li className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-1">
              <span>Professional Work Experience</span>
              <span className="font-bold text-slate-950 dark:text-white">16 Points</span>
            </li>
            <li className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-1">
              <span>Core Certifications</span>
              <span className="font-bold text-slate-950 dark:text-white">12 Points</span>
            </li>
            <li className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-1">
              <span>Formal Education History</span>
              <span className="font-bold text-slate-950 dark:text-white">12 Points</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Target Career Tracks Alignment</span>
              <span className="font-bold text-[#4f46e5] dark:text-[#a5b4fc]">41 Points</span>
            </li>
          </ul>
        </div>

        <div className="bg-white dark:bg-[#141c2f] rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-800 dark:text-white font-bold select-none">
              <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white tracking-tight">Predictive Pathway Routing</h3>
            <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
              Upon analyzing parsed vocabularies, candidate resumes are matched to focused technical tracks such as Web Development, Mobile Engineering, UI/UX Craft, or Data Science. Missing key tools, packages, and frameworks are outputted to recommend optimal career upgrades.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            <span className="font-bold text-slate-900 dark:text-white block mb-0.5">🚀 Professional Quality Assurance</span>
            Our model ensures 99.8% precision for structure categorization, removing formatting noise to guarantee clean processing ready for hiring executives.
          </div>
        </div>
      </div>

      {/* Blueprint Visualizer Station */}
      <div className="bg-[#f8fafc] dark:bg-[#0c111e]/60 rounded-3xl border border-slate-200/60 dark:border-slate-800 p-8 space-y-8">
        
        {/* Switcher Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-205 dark:border-slate-800 pb-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
              System Blueprints & Diagrams
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive visualization of software modules, information lifecycles, and relational database schemas.
            </p>
          </div>
          
          <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full sm:w-auto shrink-0 select-none">
            <button
              onClick={() => setActiveDiagram('architecture')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeDiagram === 'architecture'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              System Architecture
            </button>
            <button
              onClick={() => setActiveDiagram('dfd')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeDiagram === 'dfd'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Data Flow (DFD)
            </button>
            <button
              onClick={() => setActiveDiagram('erd')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeDiagram === 'erd'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Database Schema (ERD)
            </button>
          </div>
        </div>

        {/* Dynamic Blueprint display canvas */}
        <div className="min-h-[420px] flex flex-col justify-between">
          
          {/* A: System Architecture Diagram */}
          {activeDiagram === 'architecture' && (
            <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative items-center">
                
                {/* Visual Connector Lines for Medium+ Screens */}
                <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 border-t border-dashed border-slate-300 dark:border-slate-700 -z-0" />

                {/* Block 1: User / Client Browser */}
                <div className="bg-white dark:bg-[#141c2f] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative z-10 space-y-3 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all group">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/20 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
                    <Globe className="w-6 h-6 group-hover:animate-bounce-slow" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase font-display">Client Front-End</h4>
                    <p className="text-[10px] text-slate-410 mt-0.5">React 18 • TailwindCSS • Lucide • Recharts</p>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                    Serves a modular, fluid interactive dashboard rendering live charts, instant scoring audit cards, and drag-and-drop file inputs.
                  </p>
                </div>

                {/* Block 2: Express Server (Backend Proxy) */}
                <div className="bg-white dark:bg-[#141c2f] p-5 rounded-2xl border border-indigo-200 dark:border-indigo-950 shadow-sm relative z-10 space-y-3 ring-1 ring-indigo-505/20 hover:border-indigo-500 transition-all group">
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl flex items-center justify-center text-indigo-500 shrink-0">
                    <Server className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-indigo-650 dark:text-indigo-400 uppercase font-display">Express Server API</h4>
                    <p className="text-[10px] text-slate-415 mt-0.5">Node.js • Express.js • HTTP Proxy</p>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                    Serves custom middleware, holds API configuration variables securely, handles user sessions, and serves static compiled artifacts.
                  </p>
                </div>

                {/* Block 3: Transaction Storage Engine */}
                <div className="bg-white dark:bg-[#141c2f] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative z-10 space-y-3 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all group">
                  <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/20 rounded-xl flex items-center justify-center text-amber-500 shrink-0">
                    <Database className="w-6 h-6 group-hover:scale-105 transition-transform" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase font-display">Database Layer</h4>
                    <p className="text-[10px] text-slate-410 mt-0.5">Modular Stores • user.json • ATS_scanner.json</p>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                    Structured transaction manager recording candidate user authorization, ATS scanner records, cover letters, and admin logs.
                  </p>
                </div>

                {/* Block 4: Gemini Core AI Engine */}
                <div className="bg-white dark:bg-[#141c2f] p-5 rounded-2xl border border-purple-200 dark:border-purple-950 shadow-sm relative z-10 space-y-3 ring-1 ring-purple-500/20 hover:border-purple-500 transition-all group">
                  <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/20 rounded-xl flex items-center justify-center text-purple-500 shrink-0">
                    <Sparkles className="w-6 h-6 text-purple-505 group-hover:animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-purple-650 dark:text-purple-400 uppercase font-display">Gemini AI API</h4>
                    <p className="text-[10px] text-purple-415 mt-0.5">@google/genai SDK • Structured JSON</p>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                    Leverages Gemini Large Language models to generate granular, tailored audit checkpoints, coaching feedback, and career actions.
                  </p>
                </div>

              </div>

              {/* Technical walkthrough summary for System Architecture */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#141c2f] border border-slate-150/60 dark:border-slate-800/80 space-y-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <span className="font-bold text-slate-800 dark:text-white block uppercase tracking-wider text-[11px] font-display">
                  ⚙️ Architectural Workflow Explanation
                </span>
                <p>
                  The front-end client layer acts as a visual browser environment, capturing file submissions. To protect precious credentials (like Gemini API keys), the platform runs on a **Fullstack MVC Proxy pattern**. The client requests are securely forwarded to the Node.js/Express.js backend server.
                </p>
                <p>
                  The Express server evaluates authorization details, runs parsing algorithms, formats precise prompting instructions, and triggers the modern **Google GenAI SDK** to acquire strict JSON templates. Finally, session activity and resume reports are securely indexed inside modular data files (`user.json`, `ATS_scanner.json`) before forwarding the parsed result to the browser.
                </p>
              </div>
            </div>
          )}

          {/* B: Data Flow Diagram */}
          {activeDiagram === 'dfd' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 bg-indigo-50/25 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-900/30 rounded-2xl flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  DFD Level-1: Candidate Evaluation Stream
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Processes: 4 • Data Stores: 1 • External Entities: 2</span>
              </div>

              {/* DFD Flow Blocks */}
              <div className="space-y-4">
                
                {/* Flow Step 1 */}
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-[#141c2f] p-4 rounded-2xl border border-slate-150 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0 font-bold font-mono text-xs">
                    01
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <span className="text-[10px] font-extrabold text-indigo-650 dark:text-indigo-400 uppercase block font-mono">User/Applicant Browser</span>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-white mt-0.5">Submit Resume Credentials</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">Document payload (PDF, TXT) or raw pasted text + Target Job Role parameters.</p>
                  </div>
                  <div className="p-1 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 text-[10px] font-mono select-none flex items-center gap-1">
                    <span>DFD Entity</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Flow Step 2 */}
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-[#141c2f] p-4 rounded-2xl border border-slate-150 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 font-bold font-mono text-xs">
                    02
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <span className="text-[10px] font-extrabold text-indigo-650 dark:text-indigo-400 uppercase block font-mono">Express Server Route Control</span>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-white mt-0.5">Parse & Preprocess Inputs</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">Validates body parameters, extracts text structures, and handles security validations.</p>
                  </div>
                  <div className="p-1 px-3.5 rounded-xl bg-indigo-50/55 dark:bg-indigo-950/20 border border-indigo-150 dark:border-indigo-900/40 text-[10px] font-mono text-indigo-600 dark:text-indigo-450 select-none flex items-center gap-1">
                    <span>Process 1.1</span>
                    <ChevronRight className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                </div>

                {/* Flow Step 3 */}
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-[#141c2f] p-4 rounded-2xl border border-slate-150 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 font-bold font-mono text-xs">
                    03
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <span className="text-[10px] font-extrabold text-purple-650 dark:text-purple-400 uppercase block font-mono">Gemini AI Client Querying</span>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-white mt-0.5">Inference & Score Extraction</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">Model processes contextual resume segments and returns a strict standard JSON audit schema.</p>
                  </div>
                  <div className="p-1 px-3.5 rounded-xl bg-purple-50/55 dark:bg-purple-950/20 border border-purple-150 dark:border-purple-900/40 text-[10px] font-mono text-purple-650 dark:text-purple-450 select-none flex items-center gap-1">
                    <span>Process 1.2</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Flow Step 4 */}
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-[#141c2f] p-4 rounded-2xl border border-slate-150 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 font-bold font-mono text-xs">
                    04
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <span className="text-[10px] font-extrabold text-amber-650 dark:text-amber-400 uppercase block font-mono">Transaction Persistence Core</span>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-white mt-0.5">Commit JSON Logs & Render</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">Indexes evaluation results to modular stores (e.g. ATS_scanner.json) and returns beautiful stats cards, pathway steps, and metrics back to the UI.</p>
                  </div>
                  <div className="p-1 px-3.5 rounded-xl bg-amber-50/55 dark:bg-amber-950/20 border border-amber-150 dark:border-amber-900/40 text-[10px] font-mono text-amber-605 dark:text-amber-450 select-none flex items-center gap-1">
                    <span>Data Store</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* C: Database Schema / ER Diagram */}
          {activeDiagram === 'erd' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Entity 1: auth_users */}
                <div className="bg-white dark:bg-[#141c2f] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                  <div className="bg-slate-900 p-3.5 text-white flex items-center justify-between">
                    <span className="text-xs font-bold font-display uppercase tracking-wider flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-indigo-400" />
                      auth_users
                    </span>
                    <span className="text-[9px] bg-indigo-600/35 px-2 py-0.5 rounded-md text-indigo-200 font-mono uppercase">Master Auth</span>
                  </div>
                  <div className="p-4 font-mono text-[11px] text-slate-600 dark:text-slate-400 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-1 text-indigo-600 dark:text-indigo-400 font-bold">
                      <span>🔑 email (Primary)</span>
                      <span>STRING</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-1">
                      <span>hashed_password</span>
                      <span>STRING</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-1">
                      <span>candidate_name</span>
                      <span>STRING</span>
                    </div>
                    <div className="flex items-center justify-between pb-1">
                      <span>created_at</span>
                      <span>DATETIME</span>
                    </div>
                  </div>
                </div>

                {/* Entity 2: users (Audit & Metrics Logs) */}
                <div className="bg-white dark:bg-[#141c2f] rounded-2xl border border-indigo-200 dark:border-indigo-900/60 overflow-hidden shadow-sm ring-1 ring-indigo-500/20">
                  <div className="bg-indigo-950 p-3.5 text-white flex items-center justify-between">
                    <span className="text-xs font-bold font-display uppercase tracking-wider flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-indigo-400" />
                      resumes / audits
                    </span>
                    <span className="text-[9px] bg-emerald-600/35 px-2 py-0.5 rounded-md text-emerald-200 font-mono uppercase">User Logs</span>
                  </div>
                  <div className="p-4 font-mono text-[11px] text-slate-600 dark:text-slate-400 space-y-2 max-h-[290px] overflow-y-auto">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-1 text-indigo-650 dark:text-indigo-400 font-bold">
                      <span>🔑 token (PK)</span>
                      <span>STRING</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-1 text-purple-600 dark:text-purple-400">
                      <span>🔗 owner_email (FK)</span>
                      <span>STRING</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-1">
                      <span>applicant_name</span>
                      <span>STRING</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-1 text-emerald-605">
                      <span>resume_score</span>
                      <span>NUMBER</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-1">
                      <span>ats_compatibility</span>
                      <span>NUMBER</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-1">
                      <span>reco_field</span>
                      <span>STRING</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-1">
                      <span>experience_relevance</span>
                      <span>TEXT</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-1">
                      <span>strengths (JSON)</span>
                      <span>ARRAY</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>weaknesses (JSON)</span>
                      <span>ARRAY</span>
                    </div>
                  </div>
                </div>

                {/* Entity 3: feedback metrics */}
                <div className="bg-white dark:bg-[#141c2f] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                  <div className="bg-slate-900 p-3.5 text-white flex items-center justify-between">
                    <span className="text-xs font-bold font-display uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-amber-405" />
                      resume_feedback
                    </span>
                    <span className="text-[9px] bg-amber-600/35 px-2 py-0.5 rounded-md text-amber-200 font-mono uppercase">Audit Checks</span>
                  </div>
                  <div className="p-4 font-mono text-[11px] text-slate-600 dark:text-slate-400 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-1 text-amber-600 dark:text-amber-400 font-bold">
                      <span>🔑 check_id (PK)</span>
                      <span>STRING</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-1 text-purple-650 dark:text-purple-400">
                      <span>🔗 resume_token (FK)</span>
                      <span>STRING</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-1">
                      <span>score_improvement</span>
                      <span>STRING</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-1">
                      <span>verified_sections</span>
                      <span>BOOLEAN</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>coaching_advice</span>
                      <span>TEXT</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* ERD Key Notes/Legend */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-655 dark:text-slate-400">
                <div className="p-4 bg-white dark:bg-[#141c2f] rounded-2xl border border-slate-200 dark:border-slate-800/80 space-y-1">
                  <span className="font-extrabold text-indigo-650 dark:text-indigo-400 block uppercase">🔄 Relationship Descriptions</span>
                  <p>• <strong>auth_users</strong> to <strong>resume_audits</strong> (1 : N) — Users can parse and save infinite dynamic resumes under their account identifier.</p>
                  <p>• <strong>resume_audits</strong> to <strong>resume_feedback</strong> (1 : N) — Each audit contains exactly 10 distinct checkpoint audits in its feedback sub-schema.</p>
                </div>
                <div className="p-4 bg-white dark:bg-[#141c2f] rounded-2xl border border-slate-200 dark:border-slate-800/80 space-y-1">
                  <span className="font-extrabold text-amber-600 dark:text-amber-450 block uppercase">📦 Database Configuration</span>
                  <p>The system stores credentials and transaction records using dedicated modular JSON files (<code>/data/user.json</code>, <code>/data/ATS_scanner.json</code>, etc.). Atomic writes with backup temp files ensure zero corruption.</p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
