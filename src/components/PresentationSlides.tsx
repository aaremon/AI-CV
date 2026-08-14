import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Maximize2, 
  Minimize2, 
  BookOpen, 
  Users, 
  Sparkles, 
  TrendingUp, 
  Cpu, 
  FileText, 
  AlertCircle, 
  RefreshCw, 
  CheckCircle2, 
  Zap, 
  HelpCircle, 
  Award, 
  Code, 
  Check, 
  Database, 
  ArrowRight,
  Server,
  Network
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function PresentationSlides() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showPresenterNotes, setShowPresenterNotes] = useState<boolean>(true);
  
  // Slide Content Array
  const slides = [
    {
      id: 1,
      tag: "Title Slide",
      title: "Mero Match / E-Style",
      subtitle: "Intelligent Resume Analytics & Path Routing Engine",
      category: "COM_444 PROGRESS PRESENTATION",
      date: "June 24, 2026",
      notes: "Welcome everyone to our COM_444 project progress presentation. Our brand name is E-Style / Mero Match, and we are building a state-of-the-art intelligent resume parser and matching utility tailored for modern developers and Nepalese academic contexts.",
      element: (
        <div className="flex flex-col justify-between h-full py-6 text-slate-900 dark:text-white" id="slide-title-content">
          <div className="space-y-4">
            <span className="text-[10px] font-black tracking-widest text-[#4f46e5] dark:text-indigo-400 uppercase font-mono bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1.5 rounded-full inline-block">
              Kathmandu University • School of Management
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tight text-slate-900 dark:text-white uppercase leading-none mt-2">
              Mero Match
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl font-light">
              An intelligent, schema-validated NLP parser mapping local skills, dynamic curriculum checkmarks, and career upgrades.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-slate-200/60 dark:border-slate-800/80 pt-6">
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono font-bold block">
                Project Developers
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-slate-400" /> Abishi Bhattarai (228006)</span>
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-slate-400" /> Shreeya Paudyal (228022)</span>
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-slate-400" /> Bitrina Shakya (228026)</span>
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-slate-400" /> Sathin Shakya (228027)</span>
              </div>
            </div>

            <div className="space-y-3 sm:pl-6 sm:border-l border-slate-200/60 dark:border-slate-800/80">
              <div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono font-bold block">
                  Project Supervisor
                </span>
                <span className="text-xs font-black text-slate-800 dark:text-white block mt-0.5">
                  Deni Shahi
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-450 block">
                  Associate Professor, School of Management
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
                <span>Course Code: COM_444</span>
                <span>June 24, 2026</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      tag: "Introduction",
      title: "The Problem & Our Objectives",
      subtitle: "Why Mero Match?",
      category: "PROJECT BRIEFING",
      date: "June 24, 2026",
      notes: "Traditional recruitment screening in Nepal takes too long. HR managers scan hundreds of papers without localized benchmarks. Candidates have no feedback loop. Mero Match aims to fix this with dynamic diagnostics.",
      element: (
        <div className="space-y-6 text-slate-900 dark:text-white" id="slide-intro-content">
          <div className="border-l-4 border-indigo-650 pl-4">
            <h3 className="text-lg font-bold tracking-tight text-slate-800 dark:text-white font-display">Background Statement</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Traditional resume processing remains a bottleneck across local tech industries. Recruiter bias, non-standardized formats, and complex PDF structures prevent deserving Nepalese talents from matching optimal technical tracks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Box 1: Problem */}
            <div className="p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/30 space-y-2.5">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-450 font-bold text-xs uppercase font-mono tracking-wider">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Problem Statement</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-655 dark:text-slate-400 list-disc pl-4 leading-relaxed">
                <li>Hours wasted manually reviewing dry resumes.</li>
                <li>Generic international ATS engines ignore regional Nepalese curriculum contexts (e.g., Kathmandu University standards).</li>
                <li>Job applicants are left in the dark with no developmental upgrade metrics or pathway guidelines.</li>
              </ul>
            </div>

            {/* Box 2: Objectives */}
            <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase font-mono tracking-wider">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Our Objectives</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-655 dark:text-slate-400 list-disc pl-4 leading-relaxed">
                <li>Create an in-memory, zero-retention safe parser parsing PDF or copy text in under 3 seconds.</li>
                <li>Design intuitive dynamic rating charts across contact details, projects, experience, and academic alignments.</li>
                <li>Deliver active tech stack roadmap recommendations to bridge missing toolsets immediately.</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      tag: "Project Overview",
      title: "System Architecture Overview",
      subtitle: "The Technical Engine of Mero Match",
      category: "SYSTEM PROPOSAL",
      date: "June 24, 2026",
      notes: "Our architectural blueprint is built using clean separation of concerns. We employ a React Frontend, Express Backend Proxy to keep API keys hidden, and SQLite-like local files.",
      element: (
        <div className="space-y-6 text-slate-900 dark:text-white" id="slide-overview-content">
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl">
            Mero Match is structured using a robust **Fullstack MVC Proxy Pattern**. The browser acts as an interactive node sending payloads securely to the server, which coordinates with Google Gemini to resolve precise, schema-validated JSON structures.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-white dark:bg-[#141c2f] border border-slate-200 dark:border-slate-800 space-y-2 hover:border-indigo-500 transition-all">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-blue-500">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase font-mono tracking-wide">Reactive Client</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                React 18 components rendering real-time Recharts matrices, skill path visualizations, and instant diagnostics cards.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#141c2f] border border-slate-200 dark:border-slate-800 space-y-2 hover:border-indigo-500 transition-all">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 flex items-center justify-center text-indigo-500">
                <Server className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase font-mono tracking-wide">Proxy API Gate</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                An Express middleware securing credentials, running pre-validation, handling session cookies, and saving historic evaluations.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#141c2f] border border-slate-200 dark:border-slate-800 space-y-2 hover:border-indigo-500 transition-all">
              <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/20 flex items-center justify-center text-purple-505">
                <Cpu className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-purple-650 dark:text-purple-400 uppercase font-mono tracking-wide">Structured LLM Core</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                Uses Google GenAI SDK with strict TypeScript schemas to output JSON matching standard schemas perfectly every single time.
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-mono text-slate-450 dark:text-slate-500 text-center">
            🔒 Fully compliant with secure key encapsulation. Gemini keys never reach the client!
          </div>
        </div>
      )
    },
    {
      id: 4,
      tag: "Completed Work",
      title: "Completed Project Milestones",
      subtitle: "What is fully working right now?",
      category: "PROJECT STATUS",
      date: "June 24, 2026",
      notes: "We have fully engineered the parser core, built the dynamic scorecard visualizations, designed career routing tracks, and committed a persistent storage layer.",
      element: (
        <div className="space-y-5 text-slate-900 dark:text-white" id="slide-milestones-content">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Our team has completed the structural foundation and critical features of Mero Match, producing a fully deployed and usable web application:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3.5 bg-white dark:bg-[#141c2f] border border-slate-200 dark:border-slate-800 rounded-xl">
              <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/25 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Structured AI Parsing Core</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Engineered the backend API proxy leveraging Gemini model to extract clean data into structured resume metrics.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 bg-white dark:bg-[#141c2f] border border-slate-200 dark:border-slate-800 rounded-xl">
              <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/25 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Dynamic Analytical Charts</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Configured dynamic, interactive scorecard evaluations with Recharts supporting dark-mode state triggers cleanly.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 bg-white dark:bg-[#141c2f] border border-slate-200 dark:border-slate-800 rounded-xl">
              <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/25 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Pathway Mapping System</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Developed automated classification heuristic routing candidate qualifications to Frontend, Backend, Data, or Mobile tracks.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 bg-white dark:bg-[#141c2f] border border-slate-200 dark:border-slate-800 rounded-xl">
              <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/25 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">JSON Logging & Admin Terminals</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Implemented disk-persisted data logs (`db.json`) allowing administrators to audit historical evaluations and review analytics securely.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      tag: "Progress Demonstration",
      title: "Interactive Progress Demonstration",
      subtitle: "Simulating Mero Match Evaluation Metrics",
      category: "LIVE PROTOTYPE",
      date: "June 24, 2026",
      notes: "This interactive demo simulates the output generated by our parser core. Click 'Run Mock Diagnostic' to experience how we map raw resume details into charts.",
      element: <InteractiveDemoSlide />
    },
    {
      id: 6,
      tag: "SRS & Use Case",
      title: "Software Requirements & Use Cases",
      subtitle: "The Structural Boundary of Mero Match",
      category: "SYSTEM SPECIFICATIONS",
      date: "June 24, 2026",
      notes: "Our Software Requirements Specification defines functional and non-functional bounds. Here is our high-fidelity Use Case Diagram mapping Applicants, Admin, and Gemini.",
      element: <UseCaseSlide />
    },
    {
      id: 7,
      tag: "Remaining Work",
      title: "Future Backlog & Remaining Work",
      subtitle: "Upcoming Development Sprint Goals",
      category: "NEXT SPRINT PLANNING",
      date: "June 24, 2026",
      notes: "Our remaining work involves native PDF buffer streams, direct curriculum matching with Kathmandu University modules, and queue batching.",
      element: (
        <div className="space-y-5 text-slate-900 dark:text-white" id="slide-backlog-content">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            To reach absolute production readiness before COM_444 final submission, our sprint backlog contains the following targeted upgrades:
          </p>

          <div className="space-y-3.5 pt-1">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Direct Stream PDF Binary Parsing</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Avoid copy-paste step by reading raw PDF text segments on upload.</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold bg-indigo-100/60 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 px-2.5 py-1 rounded-md shrink-0 uppercase">High Priority</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Kathmandu University Syllabus Alignment</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Directly suggest COM/CS college classes corresponding to candidate weaknesses.</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold bg-amber-100/60 dark:bg-amber-950 text-amber-700 dark:text-amber-400 px-2.5 py-1 rounded-md shrink-0 uppercase">In Progress</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Multi-file Batch Screening Tables</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Allow recruiters to upload multiple resumes simultaneously and compare results in a master grid.</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-md shrink-0 uppercase">Sprint 3</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 8,
      tag: "Difficulties",
      title: "Difficulties & Challenges Encountered",
      subtitle: "Navigating technical hurdles in COM_444 development",
      category: "RETROSPECTIVE",
      date: "June 24, 2026",
      notes: "We faced issues with LLM JSON formatting compliance, securing API keys within the sandboxed environment, and managing responsive charts. Here is how we solved them.",
      element: (
        <div className="space-y-4 text-slate-900 dark:text-white" id="slide-challenges-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            
            <div className="p-4 rounded-xl bg-white dark:bg-[#141c2f] border border-slate-200 dark:border-slate-850 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450 flex items-center justify-center font-bold text-xs font-mono">
                01
              </div>
              <h4 className="text-xs font-black uppercase tracking-tight text-slate-905 dark:text-white">Compliant JSON Output</h4>
              <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">
                <strong>Challenge:</strong> Generating inconsistent schema formats breaking Recharts rendering structures.
              </p>
              <div className="p-2 rounded bg-emerald-50/55 dark:bg-emerald-950/15 border border-emerald-100/50 dark:border-emerald-900/20 text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                💡 <strong>Solution:</strong> Enforced strict TypeScript schema types using Google's modern GenAI SDK.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#141c2f] border border-slate-200 dark:border-slate-850 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450 flex items-center justify-center font-bold text-xs font-mono">
                02
              </div>
              <h4 className="text-xs font-black uppercase tracking-tight text-slate-905 dark:text-white">API Key Encapsulation</h4>
              <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">
                <strong>Challenge:</strong> Safeguarding keys from client-side inspectors in shared web previews.
              </p>
              <div className="p-2 rounded bg-emerald-50/55 dark:bg-emerald-950/15 border border-emerald-100/50 dark:border-emerald-900/20 text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                💡 <strong>Solution:</strong> Refactored codebase to fullstack model utilizing server proxy gateways.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#141c2f] border border-slate-200 dark:border-slate-850 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450 flex items-center justify-center font-bold text-xs font-mono">
                03
              </div>
              <h4 className="text-xs font-black uppercase tracking-tight text-slate-905 dark:text-white">Dynamic Theme Refresh</h4>
              <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">
                <strong>Challenge:</strong> Retrying layout transitions and keeping custom SVGs synced during theme shifts.
              </p>
              <div className="p-2 rounded bg-emerald-50/55 dark:bg-emerald-950/15 border border-emerald-100/50 dark:border-emerald-900/20 text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                💡 <strong>Solution:</strong> Leveraged Tailwind theme class variables synced directly with local-storage tags.
              </div>
            </div>

          </div>
        </div>
      )
    },
    {
      id: 9,
      tag: "Changes from Briefing",
      title: "Scope Evolution & Mid-Term Changes",
      subtitle: "How the design has improved since the initial proposal",
      category: "PROJECT EVOLUTION",
      date: "June 24, 2026",
      notes: "Compared to our first proposal, we have added deep path classifications, established a robust JSON storage database, and created reviews registries.",
      element: (
        <div className="space-y-4 text-slate-900 dark:text-white" id="slide-changes-briefing-content">
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Our project has evolved from a basic single-page static parser into an interactive, fullstack evaluation portal:
          </p>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-mono uppercase text-slate-450 tracking-wider">
                <th className="py-2.5 pr-4">Feature Segment</th>
                <th className="py-2.5 px-4">Initial Proposal</th>
                <th className="py-2.5 pl-4 text-indigo-600 dark:text-indigo-400">Current Evolution (Mero Match)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-[11px] leading-relaxed">
              <tr>
                <td className="py-3 pr-4 font-bold">Scope Metrics</td>
                <td className="py-3 px-4 text-slate-500">Standard numeric percentage ATS check.</td>
                <td className="py-3 pl-4 font-semibold text-slate-800 dark:text-slate-205">
                  Granular 10-tier metrics + localized Kathmandu University standards evaluation.
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-bold">Persistence Layer</td>
                <td className="py-3 px-4 text-slate-500">None (volatile state variable storage).</td>
                <td className="py-3 pl-4 font-semibold text-slate-800 dark:text-slate-205">
                  Permanent SQLite-like disk persistence in <code>db.json</code>, enabling guest session recovery.
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-bold">Interface Style</td>
                <td className="py-3 px-4 text-slate-500">Standard Bootstrap grid templates.</td>
                <td className="py-3 pl-4 font-semibold text-[#4f46e5] dark:text-indigo-450">
                  Polished <strong>Cosmic Slate UI Theme</strong> with dynamic framer-motion transitions and dark-mode state memory.
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-bold">Verification Flow</td>
                <td className="py-3 px-4 text-slate-500">Simple client-side text box parser.</td>
                <td className="py-3 pl-4 font-semibold text-slate-800 dark:text-slate-205">
                  Secure proxy route with full checklist auditing, skill update path maps, and community feedback reviews tab.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    },
    {
      id: 10,
      tag: "Conclusion",
      title: "Conclusion & Future Horizon",
      subtitle: "Bridging the gap between student talent and jobs",
      category: "VISION & SUMMARY",
      date: "June 24, 2026",
      notes: "In conclusion, Mero Match represents a highly functional progress proof. In the future, we plan local integration with Nepal portals and custom open source modeling.",
      element: (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-slate-900 dark:text-white" id="slide-conclusion-content">
          <div className="md:col-span-7 space-y-4">
            <h3 className="text-base font-black font-display tracking-tight text-slate-900 dark:text-white uppercase">
              Project Summary
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Our progress demonstrates that combining high-precision generative AI schemas with localized Nepalese curriculum contexts (Kathmandu University benchmarks) produces a highly reliable, instant, and secure career diagnostic platform. Mero Match fulfills all core milestone expectations with robust client dashboards, safe proxy routing, and real database persistence.
            </p>
            <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-xs text-slate-655 dark:text-indigo-350 leading-relaxed">
              🎓 <strong> Kathmandu University Context:</strong> Perfecting this framework opens direct pathways for students to test their project portfolios against global standard job metrics seamlessly.
            </div>
          </div>

          <div className="md:col-span-5 bg-slate-50 dark:bg-slate-900/55 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wide">
              Future Plan Objectives
            </h4>
            <ul className="space-y-3 text-[11px] text-slate-550 dark:text-slate-400 font-mono">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-black">•</span>
                <span>Integration with Nepalese employment portals (MeroJob, Kumari Job).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-black">•</span>
                <span>Custom fine-tuning of Llama-3 parameter models for secure local deployment.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-black">•</span>
                <span>Automated mock interview simulator tailored to candidate's missing tech skills.</span>
              </li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  // Auto Play Loop Effect
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`max-w-6xl mx-auto space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-6 flex flex-col justify-between w-screen h-screen' : ''}`} id="slides-root-container">
      
      {/* Title Header with branding */}
      {!isFullscreen && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-l-4 border-slate-900 dark:border-white pl-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-black font-display tracking-tight text-slate-900 dark:text-white uppercase">
              Mero Match Presentation
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Interactive 10-slide progress presentation deck for COM_444 coursework.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span>{isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}</span>
            </button>
            <button
              onClick={() => setShowPresenterNotes(!showPresenterNotes)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold cursor-pointer transition-colors ${
                showPresenterNotes 
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 text-indigo-650 dark:text-indigo-400' 
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Notes {showPresenterNotes ? "On" : "Off"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Slide Canvas Frame */}
      <div className={`relative bg-white dark:bg-[#101726] rounded-3xl border border-slate-250 dark:border-slate-850 shadow-lg overflow-hidden flex flex-col justify-between ${isFullscreen ? 'flex-1 my-4' : 'min-h-[500px]'}`} id="slide-canvas-frame">
        
        {/* Slide Header tag */}
        <div className="px-6 py-4 border-b border-slate-150 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span className="font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
            {slides[currentSlide].category}
          </span>
          <span className="font-bold">
            Slide {currentSlide + 1} of {slides.length} • {slides[currentSlide].tag}
          </span>
        </div>

        {/* Slide Main Interactive Body */}
        <div className="flex-1 p-6 sm:p-10 flex flex-col justify-center relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <div className="mb-4">
                <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white uppercase tracking-tight">
                  {slides[currentSlide].title}
                </h2>
                <p className="text-[11px] text-slate-450 dark:text-slate-400 italic">
                  {slides[currentSlide].subtitle}
                </p>
              </div>
              <div className="flex-1">
                {slides[currentSlide].element}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide navigation deck controls */}
        <div className="px-6 py-4 border-t border-slate-150 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Progress bar ticker */}
          <div className="w-full sm:w-1/3 space-y-1">
            <div className="flex justify-between text-[9px] font-mono text-slate-450">
              <span>Overall Progress</span>
              <span>{Math.round(((currentSlide + 1) / slides.length) * 100)}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 dark:bg-indigo-400 transition-all duration-300"
                style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Player controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1))}
              className="p-2 rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-150 dark:hover:bg-slate-850 cursor-pointer transition-colors"
              title="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isPlaying 
                  ? 'bg-rose-500 hover:bg-rose-600 text-white' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>AutoPlay</span>
                </>
              )}
            </button>

            <button
              onClick={() => setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1))}
              className="p-2 rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-150 dark:hover:bg-slate-850 cursor-pointer transition-colors"
              title="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Dots indicators */}
          <div className="hidden md:flex gap-1">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentSlide 
                    ? 'bg-indigo-650 dark:bg-indigo-405 w-4' 
                    : 'bg-slate-250 dark:bg-slate-800 hover:bg-slate-400'
                }`}
                title={`Go to Slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>

      </div>

      {/* Presenter Notes Panel */}
      {showPresenterNotes && (
        <div className="p-5 rounded-2xl bg-indigo-50/30 dark:bg-indigo-950/15 border border-indigo-100/60 dark:border-indigo-900/40 space-y-2 animate-fade-in" id="presenter-notes-container">
          <span className="text-[10px] font-extrabold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            Presenter Notes / Oral Script Reference:
          </span>
          <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-sans italic">
            "{slides[currentSlide].notes}"
          </p>
          <div className="text-[9px] text-slate-400 dark:text-slate-500 font-mono">
            💡 Quick Tip: Use the <strong>Left</strong> & <strong>Right</strong> arrow keys on your keyboard to advance slides quickly during the classroom presentation.
          </div>
        </div>
      )}

      {/* Quick Access Carousel */}
      {!isFullscreen && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
            Slide Deck Quick Index
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlide(idx)}
                className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer ${
                  idx === currentSlide
                    ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-950 dark:border-white shadow-xs'
                    : 'bg-white dark:bg-[#141c2f] border-slate-200 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                }`}
              >
                <div className="text-[10px] font-mono leading-none font-bold">Slide {slide.id}</div>
                <div className="text-[8px] truncate mt-1 text-slate-400">{slide.tag}</div>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

// Subcomponent: Live simulator mock prototype for Slide 5
function InteractiveDemoSlide() {
  const [step, setStep] = useState<'idle' | 'uploading' | 'finished'>('idle');
  const [atsScore, setAtsScore] = useState<number>(0);
  const [kuMatch, setKuMatch] = useState<number>(0);
  const [eduScore, setEduScore] = useState<number>(0);

  const startMockEvaluation = () => {
    setStep('uploading');
    setAtsScore(0);
    setKuMatch(0);
    setEduScore(0);

    setTimeout(() => {
      setStep('finished');
      setAtsScore(86);
      setKuMatch(92);
      setEduScore(88);
    }, 1500);
  };

  const chartData = [
    { name: 'ATS compatibility', value: atsScore, color: '#4f46e5' },
    { name: 'Kathmandu Univ Match', value: kuMatch, color: '#10b981' },
    { name: 'Education Alignment', value: eduScore, color: '#f59e0b' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full items-center" id="demo-slide-container">
      <div className="md:col-span-5 space-y-4">
        <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
          Our resume parser converts unorganized text input payloads into schema-compliant telemetry data logs instantly. Press the test trigger below to view real-time calculations.
        </p>

        {step === 'idle' && (
          <button
            onClick={startMockEvaluation}
            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run Mock Diagnostic</span>
          </button>
        )}

        {step === 'uploading' && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-805 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 text-indigo-500 animate-spin" />
            <span className="text-[10px] font-mono text-slate-500">Querying secure Gemini parser model...</span>
          </div>
        )}

        {step === 'finished' && (
          <div className="space-y-2.5">
            <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl space-y-1">
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase block font-mono">Parsing Done!</span>
              <p className="text-[11px] text-slate-655 dark:text-slate-400 leading-normal">
                Google GenAI extracted candidate parameters dynamically. No permanent files saved.
              </p>
            </div>
            <button
              onClick={() => setStep('idle')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350 rounded-xl text-[10px] font-bold uppercase transition-colors cursor-pointer"
            >
              Reset Evaluation Simulator
            </button>
          </div>
        )}
      </div>

      <div className="md:col-span-7 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 min-h-[220px] flex items-center justify-center">
        {step === 'idle' && (
          <span className="text-xs text-slate-450 dark:text-slate-500 italic">
            Waiting for simulation trigger...
          </span>
        )}

        {step === 'uploading' && (
          <div className="w-full space-y-4">
            <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full w-3/4 animate-pulse" />
            <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full w-5/6 animate-pulse" />
            <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full w-2/3 animate-pulse" />
          </div>
        )}

        {step === 'finished' && (
          <div className="w-full h-[180px] animate-fade-in">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', fontSize: '10px', color: '#fff' }} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={14}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

// Subcomponent: SRS & System Use Case Diagram SVG rendering for Slide 6
function UseCaseSlide() {
  const [activeSegment, setActiveSegment] = useState<'all' | 'applicant' | 'gemini' | 'admin'>('all');

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full items-center" id="usecase-slide-root">
      
      {/* Description list column */}
      <div className="md:col-span-5 space-y-3">
        <div className="space-y-1">
          <h4 className="text-xs font-black font-mono uppercase tracking-wider text-slate-450">
            SRS Boundaries
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            The **Mero Match System Boundary** dictates precise privileges. Use cases are divided into Actor sectors:
          </p>
        </div>

        <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-[9px] font-bold uppercase select-none">
          <button 
            onClick={() => setActiveSegment('all')}
            className={`flex-1 py-1 rounded-lg text-center transition-all cursor-pointer ${activeSegment === 'all' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'}`}
          >
            All
          </button>
          <button 
            onClick={() => setActiveSegment('applicant')}
            className={`flex-1 py-1 rounded-lg text-center transition-all cursor-pointer ${activeSegment === 'applicant' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500'}`}
          >
            Applicant
          </button>
          <button 
            onClick={() => setActiveSegment('admin')}
            className={`flex-1 py-1 rounded-lg text-center transition-all cursor-pointer ${activeSegment === 'admin' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500'}`}
          >
            Admin
          </button>
        </div>

        <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
          {activeSegment === 'applicant' && (
            <div className="p-3 bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-xl space-y-1 animate-fade-in text-xs">
              <span className="font-bold text-indigo-700 dark:text-indigo-400">Applicant Privileges:</span>
              <p className="text-[11px] text-slate-500 leading-normal">
                Upload resume text, execute Gemini-powered parsing checks, explore classified pathways, read coach hacks, and trigger auth state locks.
              </p>
            </div>
          )}

          {activeSegment === 'admin' && (
            <div className="p-3 bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl space-y-1 animate-fade-in text-xs">
              <span className="font-bold text-emerald-700 dark:text-emerald-400">System Admin Privileges:</span>
              <p className="text-[11px] text-slate-500 leading-normal">
                Access system diagnostics blueprint reports, purge registered candidates records, and query total database analytics metrics.
              </p>
            </div>
          )}

          {activeSegment === 'all' && (
            <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 animate-fade-in text-[11px] text-slate-550 dark:text-slate-400">
              <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Non-Functional Target Metrics:</span>
              <p>• <strong>Latency:</strong> Resumes processed in under 3.0s.</p>
              <p>• <strong>Consistency:</strong> Valid TypeScript schemas mapped perfectly.</p>
              <p>• <strong>Accessibility:</strong> Full compliance with light/dark contrast specifications.</p>
            </div>
          )}
        </div>
      </div>

      {/* SVG Use Case Visual diagram */}
      <div className="md:col-span-7 bg-slate-50 dark:bg-[#0c111e]/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800/80 overflow-hidden flex items-center justify-center">
        <svg viewBox="0 0 420 230" className="w-full h-auto max-h-[200px]" id="usecase-svg-element">
          
          {/* System Boundary Box */}
          <rect x="100" y="5" width="220" height="220" rx="10" fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x="210" y="16" fill="#475569" className="dark:fill-slate-400 text-[8px] font-bold font-mono uppercase tracking-widest text-center" textAnchor="middle">
            Mero Match Boundary
          </text>

          {/* Actor Left: Applicant */}
          <g opacity={activeSegment === 'all' || activeSegment === 'applicant' ? 1 : 0.25} className="transition-opacity">
            <circle cx="40" cy="90" r="12" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="1.5" />
            <line x1="40" y1="102" x2="40" y2="135" stroke="#4f46e5" strokeWidth="1.5" />
            <line x1="25" y1="115" x2="55" y2="115" stroke="#4f46e5" strokeWidth="1.5" />
            <line x1="40" y1="135" x2="28" y2="155" stroke="#4f46e5" strokeWidth="1.5" />
            <line x1="40" y1="135" x2="52" y2="155" stroke="#4f46e5" strokeWidth="1.5" />
            <text x="40" y="172" fill="#312e81" className="dark:fill-indigo-305 text-[8px] font-black uppercase text-center" textAnchor="middle">
              Applicant
            </text>
          </g>

          {/* Actor Right: Gemini AI */}
          <g opacity={activeSegment === 'all' ? 1 : 0.25} className="transition-opacity">
            <rect x="345" y="60" width="55" height="40" rx="6" fill="#f3e8ff" stroke="#a855f7" strokeWidth="1.5" />
            <text x="372.5" y="78" fill="#581c87" className="dark:fill-purple-300 text-[8px] font-black uppercase text-center" textAnchor="middle">
              Gemini AI
            </text>
            <text x="372.5" y="88" fill="#701a75" className="dark:fill-purple-400 text-[6px] font-mono uppercase text-center" textAnchor="middle">
              Service
            </text>
          </g>

          {/* Actor Right 2: System Admin */}
          <g opacity={activeSegment === 'all' || activeSegment === 'admin' ? 1 : 0.25} className="transition-opacity">
            <circle cx="372.5" cy="148" r="10" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
            <line x1="372.5" y1="158" x2="372.5" y2="182" stroke="#10b981" strokeWidth="1.5" />
            <line x1="360" y1="168" x2="385" y2="168" stroke="#10b981" strokeWidth="1.5" />
            <line x1="372.5" y1="182" x2="362" y2="198" stroke="#10b981" strokeWidth="1.5" />
            <line x1="372.5" y1="182" x2="383" y2="198" stroke="#10b981" strokeWidth="1.5" />
            <text x="372.5" y="210" fill="#064e3b" className="dark:fill-emerald-305 text-[8px] font-black uppercase text-center" textAnchor="middle">
              Sys Admin
            </text>
          </g>

          {/* Use Case Ovals inside boundary */}
          {/* UC 1: Analyze Resume */}
          <g opacity={activeSegment === 'all' || activeSegment === 'applicant' ? 1 : 0.25} className="transition-opacity">
            <ellipse cx="210" cy="40" rx="42" ry="14" fill="#ffffff" stroke="#4f46e5" strokeWidth="1.2" />
            <text x="210" y="42" fill="#0f172a" className="text-[7px] font-bold text-center" textAnchor="middle">Analyze Resume</text>
            {/* Lines to Applicant & Gemini */}
            <line x1="52" y1="90" x2="168" y2="44" stroke="#4f46e5" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="252" y1="40" x2="345" y2="70" stroke="#a855f7" strokeWidth="1" strokeDasharray="2 2" />
          </g>

          {/* UC 2: View Evaluation Charts */}
          <g opacity={activeSegment === 'all' || activeSegment === 'applicant' ? 1 : 0.25} className="transition-opacity">
            <ellipse cx="210" cy="85" rx="44" ry="14" fill="#ffffff" stroke="#4f46e5" strokeWidth="1.2" />
            <text x="210" y="87" fill="#0f172a" className="text-[7px] font-bold text-center" textAnchor="middle">View Dynamic Charts</text>
            <line x1="52" y1="102" x2="166" y2="85" stroke="#4f46e5" strokeWidth="1" strokeDasharray="2 2" />
          </g>

          {/* UC 3: Explore Upgrades */}
          <g opacity={activeSegment === 'all' || activeSegment === 'applicant' ? 1 : 0.25} className="transition-opacity">
            <ellipse cx="210" cy="130" rx="44" ry="14" fill="#ffffff" stroke="#4f46e5" strokeWidth="1.2" />
            <text x="210" y="132" fill="#0f172a" className="text-[6.5px] font-bold text-center" textAnchor="middle">Explore Skill Pathways</text>
            <line x1="52" y1="115" x2="166" y2="130" stroke="#4f46e5" strokeWidth="1" strokeDasharray="2 2" />
          </g>

          {/* UC 4: Manage System Records */}
          <g opacity={activeSegment === 'all' || activeSegment === 'admin' ? 1 : 0.25} className="transition-opacity">
            <ellipse cx="210" cy="180" rx="44" ry="14" fill="#ffffff" stroke="#10b981" strokeWidth="1.2" />
            <text x="210" y="182" fill="#0f172a" className="text-[7px] font-bold text-center" textAnchor="middle">Manage Records</text>
            <line x1="254" y1="180" x2="362" y2="162" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
          </g>

        </svg>
      </div>

    </div>
  );
}
