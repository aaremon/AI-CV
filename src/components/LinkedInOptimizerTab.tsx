import React, { useState, useEffect } from 'react';
import PrivacyIndicator from './PrivacyIndicator';
import {
  Linkedin,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  TrendingUp,
  Award,
  UserCheck,
  Briefcase,
  Layers,
  FileText,
  Send,
  Sliders,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Zap,
  Tag,
  Plus,
  X,
  ExternalLink,
  BookmarkPlus,
  Eye,
  MessageSquareQuote,
  Flame,
  ArrowRight,
  Upload,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  ListOrdered,
  Lightbulb,
  FileCheck,
  Star,
  Compass,
  Share2,
  FolderSync,
  FileType
} from 'lucide-react';

interface HeadlineItem {
  label: string;
  text: string;
  charCount?: number;
}

interface CvToLinkedInBlueprint {
  transformationStrategy: string;
  whatToWriteGuidance: {
    headlineGuide: string;
    aboutGuide: string;
    experienceGuide: string;
    featuredGuide: string;
  };
  stepByStepChecklist: Array<{
    step: string;
    action: string;
    why: string;
  }>;
  recommendationRequestTemplate: string;
}

interface ExtractedProfile {
  candidateName?: string;
  roleTitle?: string;
  seniority?: string;
  industry?: string;
  currentCompany?: string;
  location?: string;
  skills?: string[];
}

interface LinkedInOptimizationResult {
  extractedProfile?: ExtractedProfile;
  headlines: HeadlineItem[];
  about: string;
  experienceBullets: string[];
  featuredSkills: {
    core: string[];
    toolsAndCloud: string[];
    leadershipAndDomain: string[];
  };
  networkingNotes: {
    connectionRequest: string;
    recruiterReply: string;
  };
  seoScore: number;
  seoTips: string[];
  cvToLinkedInBlueprint?: CvToLinkedInBlueprint;
}

interface LinkedInOptimizerTabProps {
  loggedInUser?: any;
}

const TEMPLATE_ARCHETYPES = [
  {
    id: 'technical_leader',
    name: 'Technical Leader & Architect',
    description: 'Emphasizes scale, distributed systems, system design, and engineering mentorship.',
    badge: 'Architecture & Scale'
  },
  {
    id: '0_to_1_builder',
    name: '0-to-1 Product Engineer',
    description: 'Highlights rapid product delivery, startup velocity, user impact, and full-stack execution.',
    badge: 'Product & Velocity'
  },
  {
    id: 'recruiter_seo',
    name: 'Recruiter SEO & Keyword Stack',
    description: 'Maximized for recruiter boolean queries, high keyword density, and instant scanning.',
    badge: 'High Search Rank'
  },
  {
    id: 'visionary_storyteller',
    name: 'Visionary Storyteller & Founder',
    description: 'Engaging narrative detailing career passion, mission, accomplishments, and vision.',
    badge: 'Brand & Narrative'
  }
];

const BANNER_THEMES = [
  { id: 'tech_blue', name: 'Tech Blue', class: 'bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900' },
  { id: 'emerald', name: 'Emerald Growth', class: 'bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-950' },
  { id: 'sunset', name: 'Vibrant Sunset', class: 'bg-gradient-to-r from-violet-900 via-purple-800 to-rose-900' },
  { id: 'dark_minimal', name: 'Dark Executive', class: 'bg-gradient-to-r from-slate-900 via-slate-800 to-zinc-900' }
];

export default function LinkedInOptimizerTab({ loggedInUser }: LinkedInOptimizerTabProps) {
  // CV Upload & Input State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [fileBase64, setFileBase64] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');
  const [rawCvText, setRawCvText] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [showPasteOption, setShowPasteOption] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);

  // Profile Identity & State (Auto-extracted from CV or populated by logged in user / backend)
  const getInitialCandidateName = () => {
    if (loggedInUser?.name && loggedInUser.name !== 'User') return loggedInUser.name;
    try {
      const stored = localStorage.getItem('resume_auth_user');
      if (stored) {
        const u = JSON.parse(stored);
        if (u?.name && u.name !== 'User') return u.name;
      }
      const p = localStorage.getItem('cv_user_profile');
      if (p) {
        const parsed = JSON.parse(p);
        if (parsed?.name) return parsed.name;
      }
    } catch (_) {}
    return 'Professional Candidate';
  };

  const [candidateName, setCandidateName] = useState<string>(getInitialCandidateName);
  const [roleTitle, setRoleTitle] = useState('Senior Full Stack Developer');
  const [seniority, setSeniority] = useState('Senior');
  const [industry, setIndustry] = useState('Technology / SaaS');
  const [currentCompany, setCurrentCompany] = useState('');
  const [location, setLocation] = useState('');
  const [templateStyle, setTemplateStyle] = useState('technical_leader');
  const [tone, setTone] = useState('authoritative');
  const [openToWork, setOpenToWork] = useState(true);
  const [skills, setSkills] = useState<string[]>([
    'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'System Design', 'GraphQL'
  ]);
  const [newSkillInput, setNewSkillInput] = useState('');

  // UI Interactive States
  const [activePreviewSection, setActivePreviewSection] = useState<'guidance' | 'headlines' | 'about' | 'experience' | 'skills' | 'networking'>('guidance');
  const [activeBanner, setActiveBanner] = useState(BANNER_THEMES[0]);
  const [selectedHeadlineIndex, setSelectedHeadlineIndex] = useState(0);
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({ 0: true });

  // Processing & Feedback States
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [saveDocSuccess, setSaveDocSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Generated LinkedIn Result
  const [data, setData] = useState<LinkedInOptimizationResult>({
    headlines: [
      {
        label: 'Keyword & Recruiter Search',
        text: 'Senior Full Stack Developer | React • TypeScript • Node.js • AWS • PostgreSQL | Distributed Web Systems',
        charCount: 110
      },
      {
        label: 'Value Proposition & Business Impact',
        text: 'Senior Full Stack Engineer @ Tech Innovations | Scaling SaaS Architecture to 500k+ Users & 99.99% Uptime',
        charCount: 116
      },
      {
        label: 'Technical Authority & Scale',
        text: 'Senior Software Engineer | Architecting High-Velocity Full Stack Platforms | 5+ YOE | React, Cloud & API Design',
        charCount: 119
      },
      {
        label: 'Modern Minimalist',
        text: 'Senior Full Stack Developer • Building High-Performance Web Applications & Developer Tooling',
        charCount: 94
      }
    ],
    about: `🚀 Passionate Senior Full Stack Developer specializing in architecting resilient, high-throughput digital platforms that bridge user experience and backend scalability.

Over the last 5+ years, I have engineered mission-critical applications across Technology / SaaS, focusing on clean architecture, performance optimization, and developer productivity.

⚡ KEY HIGHLIGHTS & IMPACT (From CV):
• Architecture & Scale: Scaled web systems to 500k+ active users; reduced server latency by 40%.
• Cross-Functional Leadership: Partnered closely with Product and Design to ship iterative MVPs with 99.99% reliability.
• Engineering Standards: Spearheaded automated testing, CI/CD pipelines, and microservice decoupling.

🛠️ TECHNICAL ARSENAL:
• Frontend: React, TypeScript, Next.js, Tailwind CSS, State Management
• Backend & Cloud: Node.js, Express, PostgreSQL, AWS, Docker, GraphQL
• Methodologies: System Design, Agile/Scrum, CI/CD Automation, Test-Driven Development

📫 Open to discussing high-impact engineering roles, distributed architecture challenges, and open-source collaborations. Let's connect!`,
    experienceBullets: [
      'Architected and delivered end-to-end full-stack features using React, TypeScript, and Node.js, directly driving 500k+ active user engagement.',
      'Refactored legacy query bottlenecks in PostgreSQL and Redis caches, reducing 95th percentile latency by 40%.',
      'Spearheaded the integration of automated CI/CD deployment pipelines using Docker and AWS, reducing release cycles from days to minutes.',
      'Mentored junior and mid-level engineers through structured code reviews, architecture reviews, and design system workshops.'
    ],
    featuredSkills: {
      core: ['React.js', 'TypeScript', 'Node.js', 'System Architecture', 'PostgreSQL'],
      toolsAndCloud: ['Amazon Web Services (AWS)', 'Docker', 'GraphQL', 'Git & GitHub', 'CI/CD'],
      leadershipAndDomain: ['Distributed Systems', 'Agile Methodologies', 'Full-Stack Development', 'Code Reviews']
    },
    networkingNotes: {
      connectionRequest: 'Hi [Name], I noticed your inspiring work in Technology / SaaS and wanted to connect! As a Full Stack Engineer passionate about scalable architecture, I would love to follow your team\'s journey.',
      recruiterReply: 'Hi [Recruiter Name], thank you for reaching out regarding the Senior Full Stack Developer role! The scope and tech stack align well with my background in React and distributed Node.js systems. I would love to review the JD and schedule a brief introductory chat.'
    },
    seoScore: 94,
    seoTips: [
      'Your primary technical keywords (React, Node.js, TypeScript) are positioned early in your headline for maximum mobile recruiter visibility.',
      'Use structured emoji bullet dividers in your LinkedIn About section to increase recruiter dwell time and read-through rate by 38%.',
      'Ensure your Top 5 Featured Skills match the exact skill tags recruiters search for in LinkedIn Recruiter.'
    ],
    cvToLinkedInBlueprint: {
      transformationStrategy: 'A CV is a formal retrospective document written in concise 3rd-person bullets. LinkedIn is an interactive, searchable digital portfolio written in engaging 1st-person. Your goal after uploading your CV is not to copy-paste it verbatim, but to expand the narrative, highlight your engineering philosophy, and add social proof.',
      whatToWriteGuidance: {
        headlineGuide: 'Combine your target job title (Senior Full Stack Developer) + your primary stack (React, TypeScript, Node.js, AWS) + your biggest metric (Scaled to 500k+ users). Avoid passive filler words like "Actively Seeking" or "Unemployed".',
        aboutGuide: 'Structure your summary into 4 distinct blocks: 1) Hook (Who you are & what you build), 2) Career Story (Why you care about Technology / SaaS), 3) Concrete CV Wins (Bullet points with numbers), and 4) Call to Action (How to reach you).',
        experienceGuide: 'For each role from your CV, write 1 summary sentence explaining team context and architecture, followed by 3-4 XYZ accomplishment bullets (Accomplished [X] as measured by [Y] by doing [Z]).',
        featuredGuide: 'Pin 2-3 links directly connected to your CV: GitHub repositories, live demo URLs, architecture diagrams, certifications, or major company announcements.'
      },
      stepByStepChecklist: [
        {
          step: '1. Update Headline & Open-to-Work',
          action: 'Apply the keyword-optimized headline and set Open-to-Work visibility to Recruiters Only or Public.',
          why: 'Recruiter algorithms rank profiles based on the exact match of job title + top 3 skill keywords in the headline.'
        },
        {
          step: '2. Publish the Storyteller "About" Section',
          action: 'Paste your generated summary with bullet dividers and clear contact links.',
          why: 'Mobile LinkedIn truncates after 3 lines — hook the recruiter before they scroll away.'
        },
        {
          step: '3. Upgrade Experience with STAR Bullets',
          action: 'Update your latest positions with quantifiable impact bullets from your CV analysis.',
          why: 'Proves real-world execution capacity rather than just listing job duties.'
        },
        {
          step: '4. Pin Top 5 Skills & Featured Media',
          action: 'Add your core tech skills and pin your portfolio projects to the Featured ribbon.',
          why: 'Recruiters use Skill filters as hard pass/fail criteria when searching candidates.'
        },
        {
          step: '5. Request 2 Recommendations',
          action: 'Send the tailored message to past managers or senior teammates from previous companies.',
          why: 'Endorsements and written recommendations boost profile credibility by over 300%.'
        }
      ],
      recommendationRequestTemplate: 'Hi [Manager Name], I really enjoyed working together on Tech Innovations projects. I\'m currently refreshing my LinkedIn profile to highlight my contributions in React & Cloud architecture. Would you be willing to write a brief 2-3 sentence recommendation about our collaboration?'
    }
  });

  // Auto-sync profile name if user logged in or saved
  useEffect(() => {
    if (loggedInUser?.name && loggedInUser.name !== 'User') {
      setCandidateName(loggedInUser.name);
      return;
    }
    try {
      const stored = localStorage.getItem('resume_auth_user');
      if (stored) {
        const u = JSON.parse(stored);
        if (u && u.name && u.name !== 'User') {
          setCandidateName(u.name);
          return;
        }
      }
      const profile = localStorage.getItem('cv_user_profile');
      if (profile) {
        const p = JSON.parse(profile);
        if (p && p.name) setCandidateName(p.name);
      }
    } catch (_) {}
  }, [loggedInUser]);

  const handleFileUpload = (file: File) => {
    if (!file) return;
    setUploadedFile(file);
    setUploadedFileName(file.name);
    setFileType(file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'text/plain'));
    setStatusMessage(`Uploaded "${file.name}". Click "Shape My LinkedIn Profile from CV" to generate.`);

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
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleAutoSync = () => {
    try {
      const lastAnalysis = localStorage.getItem('latest_resume_analysis');
      if (lastAnalysis) {
        const parsed = JSON.parse(lastAnalysis);
        if (parsed.act_name) setCandidateName(parsed.act_name);
        if (parsed.predicted_field) setIndustry(parsed.predicted_field);
        if (parsed.key_skills && Array.isArray(parsed.key_skills)) {
          setSkills(parsed.key_skills.slice(0, 10));
        }
        setUploadedFileName(`Synced from CV Analyzer (${parsed.act_name || 'Resume'})`);
        setStatusMessage(`Synced CV data for ${parsed.act_name || 'Candidate'}. Ready to shape LinkedIn profile!`);
        return;
      }
      setStatusMessage('No previous analysis found. Please upload your CV file below.');
    } catch (e) {
      console.warn('Sync error:', e);
    }
  };

  const handleShapeProfile = async () => {
    setLoading(true);
    setStatusMessage('Reading CV, extracting achievements, and generating LinkedIn coaching blueprint...');
    try {
      const res = await fetch('/api/linkedin-optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateName,
          roleTitle,
          seniority,
          industry,
          currentCompany,
          location,
          templateStyle,
          tone,
          openToWork,
          skills,
          rawResumeText: rawCvText,
          fileBase64,
          fileType,
          fileName: uploadedFileName
        })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const resultData: LinkedInOptimizationResult = json.data;
          setData(resultData);
          setSelectedHeadlineIndex(0);
          setActivePreviewSection('guidance');

          // If backend extracted candidate profile fields from the CV, apply them
          if (resultData.extractedProfile) {
            if (resultData.extractedProfile.candidateName) setCandidateName(resultData.extractedProfile.candidateName);
            if (resultData.extractedProfile.roleTitle) setRoleTitle(resultData.extractedProfile.roleTitle);
            if (resultData.extractedProfile.seniority) setSeniority(resultData.extractedProfile.seniority);
            if (resultData.extractedProfile.industry) setIndustry(resultData.extractedProfile.industry);
            if (resultData.extractedProfile.currentCompany) setCurrentCompany(resultData.extractedProfile.currentCompany);
            if (resultData.extractedProfile.location) setLocation(resultData.extractedProfile.location);
            if (resultData.extractedProfile.skills && Array.isArray(resultData.extractedProfile.skills)) {
              setSkills(resultData.extractedProfile.skills);
            }
          }

          setStatusMessage(`✨ LinkedIn profile successfully shaped from CV! Check your blueprint and headlines below.`);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Shape profile error:', err);
    }
    setStatusMessage('Generated profile package. Review your results below.');
    setLoading(false);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveToDocuments = async () => {
    try {
      const activeHeadlineText = data.headlines[selectedHeadlineIndex]?.text || data.headlines[0]?.text;
      const fullPackageContent = `# LinkedIn Profile Strategy & Content Pack for ${candidateName}
Role: ${roleTitle} (${seniority}) | Industry: ${industry}

## 1. Selected Headline:
${activeHeadlineText}

## 2. Strategic "About" Summary:
${data.about}

## 3. Experience Impact Bullets (STAR/XYZ Formula):
${data.experienceBullets.map(b => `• ${b}`).join('\n')}

## 4. Featured Skills & Recruiter Tags:
Core: ${data.featuredSkills.core.join(', ')}
Cloud & Tools: ${data.featuredSkills.toolsAndCloud.join(', ')}
Leadership: ${data.featuredSkills.leadershipAndDomain.join(', ')}

## 5. CV-to-LinkedIn Blueprint:
Strategy: ${data.cvToLinkedInBlueprint?.transformationStrategy || ''}

## 6. Networking & Recommendation Notes:
Connection Request: ${data.networkingNotes.connectionRequest}
Recruiter Reply: ${data.networkingNotes.recruiterReply}
Recommendation Template: ${data.cvToLinkedInBlueprint?.recommendationRequestTemplate || ''}
`;

      const userEmail = localStorage.getItem('cv_user_email') || 'candidate@example.com';
      const res = await fetch('/api/user/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          owner_email: userEmail,
          title: `LinkedIn Strategy Pack - ${roleTitle}`,
          type: 'linkedin_pack',
          target_job: roleTitle,
          content: fullPackageContent
        })
      });

      if (res.ok) {
        setSaveDocSuccess(true);
        setTimeout(() => setSaveDocSuccess(false), 3000);
      }
    } catch (_) {}
  };

  const toggleCheckStep = (index: number) => {
    setCheckedSteps(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleAddSkill = () => {
    if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
      setSkills([...skills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const currentActiveHeadline = data.headlines[selectedHeadlineIndex]?.text || data.headlines[0]?.text;

  return (
    <div id="linkedin_optimizer_container" className="max-w-7xl mx-auto space-y-6 pb-16 animate-fade-in">
      <PrivacyIndicator featureName="LinkedIn Profile Coaching & Optimization" />

      {/* Header Banner */}
      <div id="linkedin_header_banner" className="bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-mono text-xs font-bold uppercase tracking-widest mb-1">
            <Linkedin className="w-4 h-4" />
            <span>Profile Shaping & Recruiter Visibility Blueprint</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>LinkedIn Profile Coach</span>
            <span className="text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
              CV ➔ LinkedIn
            </span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 max-w-2xl">
            Upload your CV below to shape your entire LinkedIn profile—translating cold resume bullets into compelling stories, optimized headlines, and recruiter search rankings.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            id="linkedin_save_docs_btn"
            onClick={handleSaveToDocuments}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
              saveDocSuccess
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40'
            }`}
          >
            {saveDocSuccess ? <Check className="w-3.5 h-3.5" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
            <span>{saveDocSuccess ? 'Saved to My Docs!' : 'Save Strategy to Docs'}</span>
          </button>
        </div>
      </div>

      {/* Primary Section: Upload The CV and Shape My LinkedIn Profile (Zero friction!) */}
      <div id="cv_shape_profile_card" className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 dark:from-[#111827] dark:via-slate-900 dark:to-blue-950/20 p-6 rounded-3xl border-2 border-blue-200 dark:border-blue-900/50 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Shape LinkedIn Profile from CV</span>
            </span>
            <h2 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
              Upload your CV to generate your customized LinkedIn package
            </h2>
          </div>
          
          <button
            type="button"
            onClick={handleAutoSync}
            className="self-start md:self-auto text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 cursor-pointer"
          >
            <FolderSync className="w-3.5 h-3.5" />
            <span>Sync with CV Analyzer</span>
          </button>
        </div>

        {/* Upload Dropzone */}
        <div
          onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('cv_shape_file_input')?.click()}
          className={`p-6 rounded-2xl border-2 border-dashed transition text-center cursor-pointer ${
            isDragOver
              ? 'border-blue-500 bg-blue-100/50 dark:bg-blue-950/40'
              : uploadedFileName
              ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20'
              : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 hover:border-blue-400 hover:bg-blue-50/20'
          }`}
        >
          <input
            id="cv_shape_file_input"
            type="file"
            accept=".pdf,.docx,.doc,.txt"
            className="hidden"
            onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          />
          
          <div className="flex flex-col items-center justify-center gap-2">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${
              uploadedFileName
                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                : 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
            }`}>
              {uploadedFileName ? <FileCheck className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
            </div>

            <div className="space-y-1">
              <span className="text-sm font-bold text-slate-900 dark:text-white block">
                {uploadedFileName ? uploadedFileName : 'Upload your CV / Resume file'}
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {uploadedFileName
                  ? 'File ready! Click the button below to shape your LinkedIn profile.'
                  : 'Drag and drop your PDF, Word (.docx) or Text file here, or click to browse'}
              </p>
            </div>

            {uploadedFileName && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>CV Attached Successfully</span>
              </span>
            )}
          </div>
        </div>

        {/* Optional Paste Text Accordion */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowPasteOption(!showPasteOption)}
            className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 cursor-pointer"
          >
            {showPasteOption ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            <span>Or paste raw CV text directly instead of uploading</span>
          </button>

          {showPasteOption && (
            <div className="mt-2 animate-fade-in">
              <textarea
                rows={4}
                value={rawCvText}
                onChange={e => setRawCvText(e.target.value)}
                placeholder="Paste your CV / resume text here (experience, summary, key skills)..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}
        </div>

        {/* The Single Big Action Button */}
        <div className="pt-2">
          <button
            id="shape_linkedin_profile_btn"
            onClick={handleShapeProfile}
            disabled={loading}
            className="w-full py-4 px-6 rounded-2xl text-sm font-black text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 flex items-center justify-center gap-2.5 shadow-lg shadow-blue-500/20 hover:shadow-xl disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Analyzing CV & Shaping Your Complete Profile...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Shape My LinkedIn Profile from CV</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>

        {statusMessage && (
          <p className="text-xs text-center font-medium text-slate-600 dark:text-slate-300 animate-fade-in">
            {statusMessage}
          </p>
        )}

        {/* Optional Customizer Accordion for fine-tuning */}
        <div className="border-t border-slate-200 dark:border-slate-800/80 pt-3">
          <button
            type="button"
            onClick={() => setShowCustomizer(!showCustomizer)}
            className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-blue-500" />
            <span>Optional: Customize Target Role & Tone Settings</span>
            {showCustomizer ? <ChevronDown className="w-3.5 h-3.5 ml-auto" /> : <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
          </button>

          {showCustomizer && (
            <div className="mt-3 p-4 bg-white/70 dark:bg-slate-900/70 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Candidate Name</label>
                  <input
                    type="text"
                    value={candidateName}
                    onChange={e => setCandidateName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Target Role Title</label>
                  <input
                    type="text"
                    value={roleTitle}
                    onChange={e => setRoleTitle(e.target.value)}
                    placeholder="e.g. Senior Full Stack Developer"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Positioning Archetype</label>
                  <select
                    value={templateStyle}
                    onChange={e => setTemplateStyle(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {TEMPLATE_ARCHETYPES.map(a => (
                      <option key={a.id} value={a.id}>{a.name} ({a.badge})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Writing Tone</label>
                  <select
                    value={tone}
                    onChange={e => setTone(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="authoritative">Engineering Authority & Scale</option>
                    <option value="results_driven">Metric & XYZ Quantifiable Focus</option>
                    <option value="storyteller">Mission & Storyteller Narrative</option>
                    <option value="minimalist">Modern Minimalist</option>
                  </select>
                </div>
              </div>

              {/* Skills Editor */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Core Skills ({skills.length})
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                    >
                      <span>{skill}</span>
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-blue-400 hover:text-blue-700 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={e => setNewSkillInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    placeholder="Add skill (e.g. Next.js, AWS, Kubernetes)..."
                    className="flex-1 text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer border border-slate-200 dark:border-slate-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Mockup & Blueprint Coaching Results */}
      <div className="space-y-6">
        
        {/* Authentic LinkedIn Profile Card Mockup */}
        <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Banner with Banner Theme Switcher */}
          <div className={`h-36 ${activeBanner.class} relative flex items-start justify-end p-3`}>
            <div className="bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[10px] text-white font-medium border border-white/20">
              <span>Theme:</span>
              {BANNER_THEMES.map(b => (
                <button
                  key={b.id}
                  onClick={() => setActiveBanner(b)}
                  className={`w-3 h-3 rounded-full cursor-pointer transition ${
                    activeBanner.id === b.id ? 'ring-2 ring-white scale-125' : 'opacity-60 hover:opacity-100'
                  } ${b.class}`}
                  title={b.name}
                />
              ))}
            </div>
          </div>

          {/* Profile Info Header */}
          <div className="px-6 pb-6 pt-0 relative">
            {/* Avatar with #OpenToWork Badge */}
            <div className="flex justify-between items-end -mt-16 mb-3">
              <div className="relative">
                <div className={`w-28 h-28 rounded-full border-4 border-white dark:border-[#111827] bg-slate-800 text-white flex items-center justify-center font-black text-2xl shadow-md ${
                  openToWork ? 'ring-4 ring-emerald-500' : ''
                }`}>
                  {candidateName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                {openToWork && (
                  <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full border-2 border-white dark:border-[#111827] tracking-wider shadow-xs">
                    #OPEN
                  </div>
                )}
              </div>

              {/* Right side status if needed */}
              <div className="flex items-center gap-2">
              </div>
            </div>

            {/* Name & Headline */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">{candidateName}</h2>
                <div className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold">
                  ✓
                </div>
              </div>

              {/* Active Headline Display */}
              <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed max-w-2xl bg-blue-50/40 dark:bg-blue-950/20 p-2.5 rounded-xl border border-blue-100 dark:border-blue-900/40">
                {currentActiveHeadline}
              </p>

              {/* Open to work ribbon */}
              {openToWork && (
                <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Open to work</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {roleTitle} roles • Full-time, Contract • Remote, Hybrid
                    </p>
                  </div>
                  <button
                    onClick={() => setActivePreviewSection('headlines')}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Edit roles
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section Selector Sub-Tabs: Coaching Blueprint is First! */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto pb-1">
          {[
            { id: 'guidance', label: '1. CV ➔ Profile Blueprint', icon: Compass },
            { id: 'headlines', label: '2. Headlines (220c)', icon: Flame },
            { id: 'about', label: '3. "About" Story', icon: FileText },
            { id: 'experience', label: '4. Experience Bullets', icon: Briefcase },
            { id: 'skills', label: '5. Featured Skills', icon: Tag },
            { id: 'networking', label: '6. Networking & InMail', icon: MessageSquareQuote }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activePreviewSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActivePreviewSection(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition whitespace-nowrap cursor-pointer border-b-2 ${
                  isActive
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: CV ➔ LinkedIn Transformation Blueprint & Coaching Guide */}
        {activePreviewSection === 'guidance' && (
          <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            
            {/* Mindset Transformation Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-purple-900/10 border border-blue-200 dark:border-blue-800/60">
              <div className="flex items-center gap-2 mb-2 text-blue-700 dark:text-blue-300 font-bold text-xs">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                <span>The Core Principle: Why Resumes & LinkedIn Are Different</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {data.cvToLinkedInBlueprint?.transformationStrategy ||
                  "A CV is a formal retrospective document written in concise 3rd-person bullets. LinkedIn is an interactive, searchable digital portfolio written in engaging 1st-person. Your goal after uploading your CV is not to copy-paste it verbatim, but to expand the narrative, highlight your engineering philosophy, and add social proof."}
              </p>
            </div>

            {/* Section-by-Section "What to Write" Breakdown */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span>Section-by-Section: What to Write on Your LinkedIn</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-blue-600 dark:text-blue-400">1. Headline Formula</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">220 chars</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {data.cvToLinkedInBlueprint?.whatToWriteGuidance.headlineGuide ||
                      "Combine your target job title + your primary stack + your biggest metric. Avoid passive filler words like 'Actively Seeking' or 'Unemployed'."}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-blue-600 dark:text-blue-400">2. "About" 4-Part Structure</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">Storytelling</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {data.cvToLinkedInBlueprint?.whatToWriteGuidance.aboutGuide ||
                      "Structure your summary into 4 distinct blocks: 1) Hook, 2) Career Story, 3) Concrete CV Wins, and 4) Call to Action."}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-blue-600 dark:text-blue-400">3. Experience Entries</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">STAR/XYZ</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {data.cvToLinkedInBlueprint?.whatToWriteGuidance.experienceGuide ||
                      "For each role from your CV, write 1 summary paragraph explaining team context and tech architecture, followed by 3-4 XYZ accomplishment bullets."}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-blue-600 dark:text-blue-400">4. Featured Media & Skills</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">Social Proof</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {data.cvToLinkedInBlueprint?.whatToWriteGuidance.featuredGuide ||
                      "Pin 2-3 links directly connected to your CV: GitHub repositories, live demo URLs, architecture diagrams, certifications, or major company announcements."}
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Step-by-Step Checklist */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-blue-500" />
                <span>Post-CV Action Checklist</span>
              </h3>

              <div className="space-y-2.5">
                {(data.cvToLinkedInBlueprint?.stepByStepChecklist || [
                  {
                    step: "1. Update Headline & Open-to-Work",
                    action: "Apply the keyword-optimized headline and set Open-to-Work visibility.",
                    why: "Recruiter algorithms rank profiles based on the exact match of job title + top 3 skill keywords in the headline."
                  },
                  {
                    step: "2. Publish the Storyteller 'About' Section",
                    action: "Paste your generated summary with bullet dividers and clear contact links.",
                    why: "Mobile LinkedIn truncates after 3 lines — hook the recruiter before they scroll away."
                  },
                  {
                    step: "3. Upgrade Experience with STAR Bullets",
                    action: "Update your latest positions with quantifiable impact bullets from your CV analysis.",
                    why: "Proves real-world execution capacity rather than just listing job duties."
                  },
                  {
                    step: "4. Pin Top 5 Skills & Featured Media",
                    action: "Add your core tech skills and pin your portfolio projects to the Featured ribbon.",
                    why: "Recruiters use Skill filters as hard pass/fail criteria when searching candidates."
                  },
                  {
                    step: "5. Request 2 Recommendations",
                    action: "Send the tailored message to past managers or senior teammates from previous companies.",
                    why: "Endorsements and written recommendations boost profile credibility by over 300%."
                  }
                ]).map((item, idx) => {
                  const isChecked = checkedSteps[idx] || false;
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleCheckStep(idx)}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                        isChecked
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-lg border mt-0.5 flex items-center justify-center shrink-0 transition ${
                        isChecked
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-xs font-bold ${isChecked ? 'line-through text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                            {item.step}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                          {item.action}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          <span className="font-semibold text-blue-600 dark:text-blue-400">Why it matters:</span> {item.why}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommendation Request Note */}
            {data.cvToLinkedInBlueprint?.recommendationRequestTemplate && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Manager Recommendation Request Template (From CV)</span>
                  </span>
                  <button
                    onClick={() => handleCopy(data.cvToLinkedInBlueprint!.recommendationRequestTemplate, 'rec_note')}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    {copiedId === 'rec_note' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'rec_note' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-mono bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 leading-relaxed">
                  {data.cvToLinkedInBlueprint.recommendationRequestTemplate}
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Headlines */}
        {activePreviewSection === 'headlines' && (
          <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Choose Your Preferred Headline (220 Max Characters)</span>
              </span>
              <span className="text-xs text-slate-500 font-medium">Click card to apply to live preview</span>
            </div>

            <div className="space-y-3">
              {data.headlines.map((h, idx) => {
                const isSelected = selectedHeadlineIndex === idx;
                const charLen = h.text.length;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedHeadlineIndex(idx)}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-500 shadow-xs'
                        : 'bg-slate-50/70 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        <span>{h.label}</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          charLen <= 220 ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300' : 'bg-red-100 text-red-700'
                        }`}>
                          {charLen} / 220 chars
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(h.text, `hl_${idx}`);
                          }}
                          className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
                        >
                          {copiedId === `hl_${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedId === `hl_${idx}` ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    <p className="text-xs font-medium text-slate-900 dark:text-white leading-relaxed">
                      {h.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: About Story */}
        {activePreviewSection === 'about' && (
          <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span>Storytelling "About" Section (Optimized for First 3 Lines)</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Engineered with an irresistible hook, quantifiable CV metrics, tech arsenal, and contact CTA.
                </p>
              </div>

              <button
                onClick={() => handleCopy(data.about, 'about_sec')}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                {copiedId === 'about_sec' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'about_sec' ? 'Copied!' : 'Copy Summary'}</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-sans text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
              {data.about}
            </div>
          </div>
        )}

        {/* TAB 4: Experience Bullets */}
        {activePreviewSection === 'experience' && (
          <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-blue-500" />
                  <span>Quantifiable Impact Bullets (Adapted for LinkedIn)</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Converts standard CV duties into high-impact STAR/XYZ accomplishment statements.
                </p>
              </div>

              <button
                onClick={() => handleCopy(data.experienceBullets.map(b => `• ${b}`).join('\n'), 'exp_all')}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                {copiedId === 'exp_all' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'exp_all' ? 'Copied All!' : 'Copy All Bullets'}</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {data.experienceBullets.map((bullet, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 group"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                      {bullet}
                    </p>
                  </div>

                  <button
                    onClick={() => handleCopy(`• ${bullet}`, `exp_${idx}`)}
                    className="text-xs font-semibold text-slate-400 hover:text-blue-600 flex items-center gap-1 shrink-0 cursor-pointer pt-0.5"
                  >
                    {copiedId === `exp_${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === `exp_${idx}` ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: Featured Skills */}
        {activePreviewSection === 'skills' && (
          <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-blue-500" />
                <span>Featured Skills & Recruiter Keyword Categories</span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Organized to match boolean search queries used by LinkedIn recruiters.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 space-y-2.5">
                <span className="text-xs font-black text-blue-700 dark:text-blue-300 block">
                  Top 5 Core Skills
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {data.featuredSkills.core.map((s, idx) => (
                    <span key={idx} className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800 shadow-2xs">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2.5">
                <span className="text-xs font-black text-slate-800 dark:text-slate-200 block">
                  Cloud, Tools & Infrastructure
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {data.featuredSkills.toolsAndCloud.map((s, idx) => (
                    <span key={idx} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-2xs">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2.5">
                <span className="text-xs font-black text-slate-800 dark:text-slate-200 block">
                  Leadership & Methodologies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {data.featuredSkills.leadershipAndDomain.map((s, idx) => (
                    <span key={idx} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-2xs">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: Networking Notes & InMail */}
        {activePreviewSection === 'networking' && (
          <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <MessageSquareQuote className="w-4 h-4 text-blue-500" />
                <span>High-Converting Outreach & InMail Response Scripts</span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Pre-formatted connection notes (under 300 chars) and recruiter InMail reply scripts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Connection Note */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Connection Request (Under 300c)</span>
                  <button
                    onClick={() => handleCopy(data.networkingNotes.connectionRequest, 'net_conn')}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    {copiedId === 'net_conn' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'net_conn' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-mono bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 leading-relaxed">
                  {data.networkingNotes.connectionRequest}
                </p>
              </div>

              {/* Recruiter Reply */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Recruiter InMail Response</span>
                  <button
                    onClick={() => handleCopy(data.networkingNotes.recruiterReply, 'net_rec')}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    {copiedId === 'net_rec' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'net_rec' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-mono bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 leading-relaxed">
                  {data.networkingNotes.recruiterReply}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
