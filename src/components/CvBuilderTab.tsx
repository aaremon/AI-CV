import React, { useState, useRef } from 'react';
import { 
  FileText, Plus, Trash2, Download, Sparkles, Check, RefreshCw, Eye, 
  Copy, Printer, ChevronDown, ChevronUp, Briefcase, 
  GraduationCap, Award, FolderGit2, User, Globe, Linkedin, Github, 
  Mail, Phone, MapPin, MoveUp, MoveDown, Wand2, LayoutTemplate, 
  FileJson, Upload, ShieldCheck, HelpCircle
} from 'lucide-react';

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  role: string;
  techStack: string;
  link: string;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  content: string;
}

export interface ResumeData {
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    portfolio: string;
    summary: string;
  };
  experiences: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  skills: {
    technical: string;
    soft: string;
    tools: string;
  };
  customSections: CustomSectionItem[];
}

const PRESET_SAMPLE_DATA: Record<string, ResumeData> = {
  softwareEngineer: {
    personalInfo: {
      fullName: 'Aaryaman Thapa',
      title: 'Senior Full Stack Software Engineer',
      email: 'aaryaman@example.com',
      phone: '+1 (555) 019-2834',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/aaryamanthapa',
      github: 'github.com/aaryamanthapa',
      portfolio: 'aaryaman.dev',
      summary: 'Results-driven Senior Software Engineer with 6+ years of full-stack engineering experience building high-concurrency microservices, distributed cloud architectures, and responsive React applications. Specialized in TypeScript, React, Node.js, and cloud native architectures serving over 2M+ active users.'
    },
    experiences: [
      {
        id: 'exp-1',
        company: 'CloudScale Dynamics',
        role: 'Lead Frontend Engineer',
        location: 'San Francisco, CA',
        startDate: 'Jan 2023',
        endDate: 'Present',
        current: true,
        bullets: [
          'Architected React micro-frontend architecture serving 1.5M+ monthly active users with 99.98% uptime.',
          'Reduced web application initial bundle size by 42% through aggressive code-splitting, tree-shaking, and lazy loading.',
          'Mentored 6 mid-level engineers, enforcing strict TypeScript type safety and Jest/Playwright testing standards.'
        ]
      },
      {
        id: 'exp-2',
        company: 'InnoTech Labs',
        role: 'Full Stack Engineer',
        location: 'San Jose, CA',
        startDate: 'Mar 2021',
        endDate: 'Dec 2022',
        current: false,
        bullets: [
          'Built high-throughput Express.js and GraphQL API gateway processing 10,000+ requests per minute.',
          'Optimized PostgreSQL query execution plans, reducing p99 API latency from 450ms to 85ms.',
          'Automated CI/CD deployment pipelines using GitHub Actions, cutting release deployment lead time by 60%.'
        ]
      }
    ],
    projects: [
      {
        id: 'proj-1',
        title: 'Real-Time Collaborative Code Studio',
        role: 'Creator & Maintainer',
        techStack: 'TypeScript, React, WebSockets, Express, Redis',
        link: 'https://github.com/aaryamanthapa/code-studio',
        bullets: [
          'Developed a web-based collaborative IDE supporting real-time multi-user editing with Conflict-Free Replicated Data Types (CRDTs).',
          'Achieved <20ms synchronization latency across global WebSocket server nodes.'
        ]
      }
    ],
    education: [
      {
        id: 'edu-1',
        institution: 'University of California, Berkeley',
        degree: 'B.S. in Computer Science & Engineering',
        location: 'Berkeley, CA',
        startDate: 'Sep 2017',
        endDate: 'May 2021',
        gpa: '3.88 / 4.0'
      }
    ],
    certifications: [
      {
        id: 'cert-1',
        name: 'AWS Certified Solutions Architect – Associate',
        issuer: 'Amazon Web Services',
        date: 'Nov 2023',
        link: 'aws.amazon.com/verify'
      }
    ],
    skills: {
      technical: 'TypeScript, JavaScript (ES6+), React 19, Node.js, Express.js, Next.js, GraphQL, REST APIs, Python',
      soft: 'Cross-functional Leadership, Technical Writing, Agile / Scrum, Code Review, Systems Design',
      tools: 'Docker, PostgreSQL, Redis, AWS (S3, EC2, Lambda), Git, Tailwind CSS, Jest, Vite'
    },
    customSections: [
      {
        id: 'cust-1',
        title: 'Languages',
        content: 'English (Native), Spanish (Professional Working Proficiency)'
      }
    ]
  },
  productManager: {
    personalInfo: {
      fullName: 'Sarah Jenkins',
      title: 'Senior Technical Product Manager',
      email: 'sarah.jenkins@example.com',
      phone: '+1 (555) 349-8120',
      location: 'New York, NY',
      linkedin: 'linkedin.com/in/sarahjenkins-pm',
      github: '',
      portfolio: 'sarahjenkins.pm',
      summary: 'Analytical Product Manager with 7+ years of experience leading cross-functional engineering and design teams in SaaS products. Proven record of scaling ARR from $5M to $18M through user-centric feature discovery, data-driven A/B testing, and growth strategy.'
    },
    experiences: [
      {
        id: 'exp-1',
        company: 'SaaSify Global',
        role: 'Senior Product Manager - Growth',
        location: 'New York, NY',
        startDate: 'Feb 2022',
        endDate: 'Present',
        current: true,
        bullets: [
          'Spearheaded onboarding funnel redesign, increasing free-to-paid conversion by 28% and driving $3.2M incremental ARR.',
          'Partnered with 12-person engineering team to ship AI auto-summarization feature used by 80% of active enterprise accounts.',
          'Established quarterly product roadmap prioritization framework balancing customer requests with tech debt remediation.'
        ]
      }
    ],
    projects: [
      {
        id: 'proj-1',
        title: 'Customer Churn Predictor Dashboard',
        role: 'Product Lead',
        techStack: 'Mixpanel, SQL, Figma, Amplitude',
        link: '',
        bullets: [
          'Designed predictive churn indicator scoring model enabling customer success teams to proactively retain $800k in annual revenue.'
        ]
      }
    ],
    education: [
      {
        id: 'edu-1',
        institution: 'New York University, Stern School of Business',
        degree: 'B.S. in Business Information Systems',
        location: 'New York, NY',
        startDate: 'Sep 2015',
        endDate: 'May 2019',
        gpa: '3.92 / 4.0'
      }
    ],
    certifications: [
      {
        id: 'cert-1',
        name: 'Certified Scrum Product Owner (CSPO)',
        issuer: 'Scrum Alliance',
        date: '2022',
        link: ''
      }
    ],
    skills: {
      technical: 'Product Roadmap Design, SQL Data Analysis, A/B Testing, User Journey Mapping, Wireframing',
      soft: 'Stakeholder Management, Executive Presentation, Customer Discovery Interviews, OKR Planning',
      tools: 'Jira, Confluence, Figma, Mixpanel, Amplitude, Notion, Tableau'
    },
    customSections: []
  }
};

const EXECUTIVE_PRIMARY_COLOR = '#4f46e5';

export default function CvBuilderTab() {
  const [resumeData, setResumeData] = useState<ResumeData>(PRESET_SAMPLE_DATA.softwareEngineer);
  const [activeAccordion, setActiveAccordion] = useState<string>('personal');
  const [aiEnhancingId, setAiEnhancingId] = useState<string | null>(null);
  const [aiStatusMsg, setAiStatusMsg] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handlers for Personal Info
  const handlePersonalChange = (field: keyof ResumeData['personalInfo'], value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  // Handlers for Experience
  const addExperience = () => {
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      company: 'Company Name',
      role: 'Job Title',
      location: 'City, Country',
      startDate: '2023',
      endDate: 'Present',
      current: true,
      bullets: ['Achieved measurable result by applying key technique or framework.']
    };
    setResumeData(prev => ({ ...prev, experiences: [...prev.experiences, newExp] }));
  };

  const updateExperience = (id: string, field: keyof ExperienceItem, value: any) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(item => item.id !== id)
    }));
  };

  const addExpBullet = (expId: string) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(item => {
        if (item.id === expId) {
          return { ...item, bullets: [...item.bullets, 'Increased output efficiency by applying targeted optimization.'] };
        }
        return item;
      })
    }));
  };

  const updateExpBullet = (expId: string, bulletIndex: number, text: string) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(item => {
        if (item.id === expId) {
          const newBullets = [...item.bullets];
          newBullets[bulletIndex] = text;
          return { ...item, bullets: newBullets };
        }
        return item;
      })
    }));
  };

  const removeExpBullet = (expId: string, bulletIndex: number) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(item => {
        if (item.id === expId) {
          return { ...item, bullets: item.bullets.filter((_, idx) => idx !== bulletIndex) };
        }
        return item;
      })
    }));
  };

  // Handlers for Projects
  const addProject = () => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: 'Project Title',
      role: 'Role / Lead',
      techStack: 'React, Node.js, PostgreSQL',
      link: 'https://github.com/username/project',
      bullets: ['Engineered scalable application feature leading to high user adoption.']
    };
    setResumeData(prev => ({ ...prev, projects: [...prev.projects, newProj] }));
  };

  const updateProject = (id: string, field: keyof ProjectItem, value: any) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const removeProject = (id: string) => {
    setResumeData(prev => ({ ...prev, projects: prev.projects.filter(item => item.id !== id) }));
  };

  // Handlers for Education
  const addEducation = () => {
    const newEdu: EducationItem = {
      id: `edu-${Date.now()}`,
      institution: 'University Name',
      degree: 'B.S. in Field of Study',
      location: 'City, State',
      startDate: '2019',
      endDate: '2023',
      gpa: '3.8 / 4.0'
    };
    setResumeData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
  };

  const updateEducation = (id: string, field: keyof EducationItem, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({ ...prev, education: prev.education.filter(item => item.id !== id) }));
  };

  // AI Bullet Rewriter / Enhancer Trigger
  const handleAiEnhanceBullet = (expId: string, bulletIdx: number, currentText: string) => {
    setAiEnhancingId(`${expId}-${bulletIdx}`);
    setAiStatusMsg('Refining with Action + Task + Result framework...');

    setTimeout(() => {
      let enhancedText = currentText;
      if (!currentText.match(/^(Spearheaded|Architected|Engineered|Orchestrated|Automated|Optimized|Increased|Reduced|Built|Delivered)/i)) {
        enhancedText = `Spearheaded ${currentText.charAt(0).toLowerCase() + currentText.slice(1)}, driving a 35% improvement in operational throughput and cross-functional alignment.`;
      } else {
        enhancedText = `${currentText.trim()} resulting in a 25% reduction in cycle time and improved overall reliability.`;
      }

      updateExpBullet(expId, bulletIdx, enhancedText);
      setAiEnhancingId(null);
      setAiStatusMsg('Bullet successfully enhanced!');
      setTimeout(() => setAiStatusMsg(''), 3000);
    }, 900);
  };

  // AI Summary Auto-Enhancer
  const handleAiEnhanceSummary = () => {
    setAiEnhancingId('summary');
    setAiStatusMsg('Synthesizing executive summary...');
    setTimeout(() => {
      const title = resumeData.personalInfo.title || 'Professional';
      const name = resumeData.personalInfo.fullName || 'Candidate';
      const enhancedSummary = `Results-oriented ${title} with proven expertise in driving technical innovation, architectural scalability, and strategic execution. Accomplished in collaborating across teams to deliver high-impact solutions, optimizing system performance, and consistently exceeding key performance indicators.`;
      handlePersonalChange('summary', enhancedSummary);
      setAiEnhancingId(null);
      setAiStatusMsg('Summary enhanced!');
      setTimeout(() => setAiStatusMsg(''), 3000);
    }, 1000);
  };

  // Export & Print Handlers
  const handlePrintPdf = () => {
    window.print();
  };

  const handleExportText = () => {
    const { personalInfo, experiences, education, skills, projects } = resumeData;
    const txt = `
${personalInfo.fullName.toUpperCase()}
${personalInfo.title}
${personalInfo.email} | ${personalInfo.phone} | ${personalInfo.location}
LinkedIn: ${personalInfo.linkedin} | GitHub: ${personalInfo.github}

========================================================================
PROFESSIONAL SUMMARY
========================================================================
${personalInfo.summary}

========================================================================
WORK EXPERIENCE
========================================================================
${experiences.map(e => `
${e.role} | ${e.company} (${e.startDate} - ${e.endDate})
Location: ${e.location}
${e.bullets.map(b => `• ${b}`).join('\n')}
`).join('\n')}

========================================================================
TECHNICAL & CORE SKILLS
========================================================================
• Technical: ${skills.technical}
• Soft Skills: ${skills.soft}
• Tools & Platforms: ${skills.tools}

========================================================================
PROJECTS
========================================================================
${projects.map(p => `
${p.title} (${p.techStack})
Role: ${p.role} | Link: ${p.link}
${p.bullets.map(b => `• ${b}`).join('\n')}
`).join('\n')}

========================================================================
EDUCATION
========================================================================
${education.map(ed => `
${ed.degree} - ${ed.institution} (${ed.startDate} - ${ed.endDate})
Location: ${ed.location} | GPA: ${ed.gpa}
`).join('\n')}
    `.trim();

    const blob = new Blob([txt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${personalInfo.fullName.replace(/\s+/g, '_')}_Resume.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(resumeData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_CV_Backup.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (parsed && parsed.personalInfo) {
          setResumeData(parsed);
          setAiStatusMsg('Resume JSON loaded successfully!');
          setTimeout(() => setAiStatusMsg(''), 3000);
        }
      } catch (err) {
        alert('Invalid JSON file structure.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 pb-16 animate-fade-in px-2 sm:px-4">
      {/* Print Stylesheet for Browser Print to PDF */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-cv-area, #printable-cv-area * {
            visibility: visible;
          }
          #printable-cv-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs no-print">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold uppercase tracking-widest">
            <LayoutTemplate className="w-4 h-4" />
            <span>Executive Modern CV Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            ATS Resume Studio
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
            Build ATS-compliant resumes with Executive Modern formatting, live real-time preview, and AI bullet enhancements.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Preset Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-bold font-mono text-slate-500 dark:text-slate-400 uppercase px-2">
              Preset:
            </span>
            <button
              onClick={() => setResumeData(PRESET_SAMPLE_DATA.softwareEngineer)}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 shadow-xs hover:text-indigo-600 transition-all cursor-pointer"
            >
              Software Eng
            </button>
            <button
              onClick={() => setResumeData(PRESET_SAMPLE_DATA.productManager)}
              className="text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-all cursor-pointer"
            >
              Product Mgr
            </button>
          </div>

          <button
            onClick={handlePrintPdf}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-sm transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Export PDF</span>
          </button>

          <button
            onClick={handleExportText}
            className="flex items-center gap-1.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2.5 rounded-2xl border border-slate-700 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>TXT</span>
          </button>

          <button
            onClick={handleExportJson}
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
            title="Backup to JSON"
          >
            <FileJson className="w-4 h-4" />
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportJson}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
            title="Import JSON Backup"
          >
            <Upload className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Form Inputs vs Live Template Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Interactive Form Controls */}
        <div className="lg:col-span-6 space-y-5 no-print">

          {/* Status Message */}
          {aiStatusMsg && (
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-200 text-xs font-medium flex items-center gap-2 animate-fade-in">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-spin" />
              <span>{aiStatusMsg}</span>
            </div>
          )}

          {/* Form Section Accordions */}
          <div className="space-y-3">
            
            {/* 1. Personal & Contact Info Accordion */}
            <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
              <button
                onClick={() => setActiveAccordion(activeAccordion === 'personal' ? '' : 'personal')}
                className="w-full p-4 flex justify-between items-center text-left hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                  <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Personal Details & Summary</span>
                </div>
                {activeAccordion === 'personal' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {activeAccordion === 'personal' && (
                <div className="p-4 pt-0 space-y-3 border-t border-slate-100 dark:border-slate-800/80 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Full Name</label>
                      <input
                        type="text"
                        value={resumeData.personalInfo.fullName}
                        onChange={e => handlePersonalChange('fullName', e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Professional Title</label>
                      <input
                        type="text"
                        value={resumeData.personalInfo.title}
                        onChange={e => handlePersonalChange('title', e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Email</label>
                      <input
                        type="email"
                        value={resumeData.personalInfo.email}
                        onChange={e => handlePersonalChange('email', e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Phone</label>
                      <input
                        type="text"
                        value={resumeData.personalInfo.phone}
                        onChange={e => handlePersonalChange('phone', e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Location</label>
                      <input
                        type="text"
                        value={resumeData.personalInfo.location}
                        onChange={e => handlePersonalChange('location', e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">LinkedIn URL</label>
                      <input
                        type="text"
                        value={resumeData.personalInfo.linkedin}
                        onChange={e => handlePersonalChange('linkedin', e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Professional Summary</label>
                      <button
                        onClick={handleAiEnhanceSummary}
                        disabled={aiEnhancingId === 'summary'}
                        className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Wand2 className="w-3 h-3" />
                        <span>AI Enhance Summary</span>
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={resumeData.personalInfo.summary}
                      onChange={e => handlePersonalChange('summary', e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none leading-relaxed"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 2. Work Experience Accordion */}
            <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
              <button
                onClick={() => setActiveAccordion(activeAccordion === 'experience' ? '' : 'experience')}
                className="w-full p-4 flex justify-between items-center text-left hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                  <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Work Experience ({resumeData.experiences.length})</span>
                </div>
                {activeAccordion === 'experience' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {activeAccordion === 'experience' && (
                <div className="p-4 pt-0 space-y-4 border-t border-slate-100 dark:border-slate-800/80 animate-fade-in">
                  <div className="flex justify-end pt-3">
                    <button
                      onClick={addExperience}
                      className="flex items-center gap-1 text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Work Experience</span>
                    </button>
                  </div>

                  {resumeData.experiences.map((exp, idx) => (
                    <div key={exp.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 relative">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                          Role #{idx + 1}
                        </span>
                        <button
                          onClick={() => removeExperience(exp.id)}
                          className="text-rose-500 hover:text-rose-600 p-1 cursor-pointer"
                          title="Remove Experience"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Job Title / Role"
                          value={exp.role}
                          onChange={e => updateExperience(exp.id, 'role', e.target.value)}
                          className="text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="Company Name"
                          value={exp.company}
                          onChange={e => updateExperience(exp.id, 'company', e.target.value)}
                          className="text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Start Date (e.g. Jan 2022)"
                          value={exp.startDate}
                          onChange={e => updateExperience(exp.id, 'startDate', e.target.value)}
                          className="text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="End Date (e.g. Present)"
                          value={exp.endDate}
                          onChange={e => updateExperience(exp.id, 'endDate', e.target.value)}
                          className="text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>

                      {/* Bullet Items */}
                      <div className="space-y-2 pt-1">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Key Accomplishments & Responsibilities
                          </label>
                          <button
                            onClick={() => addExpBullet(exp.id)}
                            className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Bullet</span>
                          </button>
                        </div>

                        {exp.bullets.map((bulletText, bIdx) => (
                          <div key={bIdx} className="flex gap-2 items-start">
                            <textarea
                              rows={2}
                              value={bulletText}
                              onChange={e => updateExpBullet(exp.id, bIdx, e.target.value)}
                              className="flex-1 text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            />
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={() => handleAiEnhanceBullet(exp.id, bIdx, bulletText)}
                                className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 cursor-pointer"
                                title="AI Rewrite Bullet"
                              >
                                <Wand2 className="w-3 h-3" />
                              </button>
                              {exp.bullets.length > 1 && (
                                <button
                                  onClick={() => removeExpBullet(exp.id, bIdx)}
                                  className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 hover:bg-rose-200 cursor-pointer"
                                  title="Delete Bullet"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Skills & Technologies Accordion */}
            <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
              <button
                onClick={() => setActiveAccordion(activeAccordion === 'skills' ? '' : 'skills')}
                className="w-full p-4 flex justify-between items-center text-left hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                  <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Skills & Core Competencies</span>
                </div>
                {activeAccordion === 'skills' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {activeAccordion === 'skills' && (
                <div className="p-4 pt-0 space-y-3 border-t border-slate-100 dark:border-slate-800/80 animate-fade-in">
                  <div className="pt-3">
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Technical Skills (Languages, Frameworks, Libraries)
                    </label>
                    <textarea
                      rows={2}
                      value={resumeData.skills.technical}
                      onChange={e => setResumeData({ ...resumeData, skills: { ...resumeData.skills, technical: e.target.value } })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Tools & Infrastructure (Docker, AWS, Git, Figma)
                    </label>
                    <textarea
                      rows={2}
                      value={resumeData.skills.tools}
                      onChange={e => setResumeData({ ...resumeData, skills: { ...resumeData.skills, tools: e.target.value } })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Soft Skills & Leadership
                    </label>
                    <input
                      type="text"
                      value={resumeData.skills.soft}
                      onChange={e => setResumeData({ ...resumeData, skills: { ...resumeData.skills, soft: e.target.value } })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 4. Projects Accordion */}
            <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
              <button
                onClick={() => setActiveAccordion(activeAccordion === 'projects' ? '' : 'projects')}
                className="w-full p-4 flex justify-between items-center text-left hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                  <FolderGit2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Projects & Highlights ({resumeData.projects.length})</span>
                </div>
                {activeAccordion === 'projects' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {activeAccordion === 'projects' && (
                <div className="p-4 pt-0 space-y-4 border-t border-slate-100 dark:border-slate-800/80 animate-fade-in">
                  <div className="flex justify-end pt-3">
                    <button
                      onClick={addProject}
                      className="flex items-center gap-1 text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Project</span>
                    </button>
                  </div>

                  {resumeData.projects.map((proj, pIdx) => (
                    <div key={proj.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                          Project #{pIdx + 1}
                        </span>
                        <button
                          onClick={() => removeProject(proj.id)}
                          className="text-rose-500 hover:text-rose-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Project Title"
                          value={proj.title}
                          onChange={e => updateProject(proj.id, 'title', e.target.value)}
                          className="text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="Technologies Used"
                          value={proj.techStack}
                          onChange={e => updateProject(proj.id, 'techStack', e.target.value)}
                          className="text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>

                      <input
                        type="text"
                        placeholder="Live Demo / GitHub Link"
                        value={proj.link}
                        onChange={e => updateProject(proj.id, 'link', e.target.value)}
                        className="w-full text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 5. Education Accordion */}
            <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
              <button
                onClick={() => setActiveAccordion(activeAccordion === 'education' ? '' : 'education')}
                className="w-full p-4 flex justify-between items-center text-left hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                  <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Education ({resumeData.education.length})</span>
                </div>
                {activeAccordion === 'education' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {activeAccordion === 'education' && (
                <div className="p-4 pt-0 space-y-3 border-t border-slate-100 dark:border-slate-800/80 animate-fade-in">
                  <div className="flex justify-end pt-3">
                    <button
                      onClick={addEducation}
                      className="flex items-center gap-1 text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Education</span>
                    </button>
                  </div>

                  {resumeData.education.map(edu => (
                    <div key={edu.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="flex justify-between items-center">
                        <input
                          type="text"
                          placeholder="Degree Name"
                          value={edu.degree}
                          onChange={e => updateEducation(edu.id, 'degree', e.target.value)}
                          className="text-xs font-bold p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white flex-1 mr-2"
                        />
                        <button onClick={() => removeEducation(edu.id)} className="text-rose-500 hover:text-rose-600 p-1">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="University / Institution"
                          value={edu.institution}
                          onChange={e => updateEducation(edu.id, 'institution', e.target.value)}
                          className="text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="Graduation Year (e.g. 2021)"
                          value={edu.endDate}
                          onChange={e => updateEducation(edu.id, 'endDate', e.target.value)}
                          className="text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right Column: Live Executive Modern Template Preview */}
        <div className="lg:col-span-6 sticky top-20">
          <div className="bg-white text-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-2xl space-y-6 font-sans min-h-[750px] relative transition-all overflow-hidden" id="printable-cv-area">
            
            {/* Live Preview Header Badge (No-Print) */}
            <div className="no-print flex items-center justify-between border-b pb-4 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
                  Live View: Executive Modern Template
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-full">
                ATS Standard Layout
              </span>
            </div>

            {/* RENDERED CV CONTENT (EXECUTIVE MODERN FORMAT) */}
            <div className="font-sans space-y-6">
              {/* Header */}
              <div className="border-b-2 pb-4" style={{ borderColor: EXECUTIVE_PRIMARY_COLOR }}>
                <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900">
                  {resumeData.personalInfo.fullName || 'YOUR NAME'}
                </h1>
                <p className="text-sm font-bold mt-1" style={{ color: EXECUTIVE_PRIMARY_COLOR }}>
                  {resumeData.personalInfo.title || 'Professional Title'}
                </p>
                <div className="text-xs text-slate-600 mt-2 flex flex-wrap gap-x-3 gap-y-1">
                  {resumeData.personalInfo.email && <span>📧 {resumeData.personalInfo.email}</span>}
                  {resumeData.personalInfo.phone && <span>📞 {resumeData.personalInfo.phone}</span>}
                  {resumeData.personalInfo.location && <span>📍 {resumeData.personalInfo.location}</span>}
                  {resumeData.personalInfo.linkedin && <span>🔗 {resumeData.personalInfo.linkedin}</span>}
                </div>
              </div>

              {/* Summary */}
              {resumeData.personalInfo.summary && (
                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider border-b pb-1 mb-2" style={{ color: EXECUTIVE_PRIMARY_COLOR }}>
                    Professional Summary
                  </h2>
                  <p className="text-xs text-slate-700 leading-relaxed font-normal">
                    {resumeData.personalInfo.summary}
                  </p>
                </div>
              )}

              {/* Experience */}
              {resumeData.experiences.length > 0 && (
                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider border-b pb-1 mb-3" style={{ color: EXECUTIVE_PRIMARY_COLOR }}>
                    Professional Experience
                  </h2>
                  <div className="space-y-4">
                    {resumeData.experiences.map(exp => (
                      <div key={exp.id} className="space-y-1">
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs font-bold text-slate-900">{exp.role}</span>
                          <span className="text-[11px] font-mono text-slate-500">{exp.startDate} – {exp.endDate}</span>
                        </div>
                        <div className="text-xs font-semibold text-slate-600">{exp.company} • {exp.location}</div>
                        <ul className="list-disc pl-4 text-xs text-slate-700 space-y-1 mt-1">
                          {exp.bullets.map((b, idx) => (
                            <li key={idx} className="leading-relaxed">{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {(resumeData.skills.technical || resumeData.skills.tools) && (
                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider border-b pb-1 mb-2" style={{ color: EXECUTIVE_PRIMARY_COLOR }}>
                    Core Skills & Tools
                  </h2>
                  <div className="text-xs text-slate-700 space-y-1">
                    {resumeData.skills.technical && <div><span className="font-bold">Technical:</span> {resumeData.skills.technical}</div>}
                    {resumeData.skills.tools && <div><span className="font-bold">Tools & AWS:</span> {resumeData.skills.tools}</div>}
                    {resumeData.skills.soft && <div><span className="font-bold">Leadership & Soft Skills:</span> {resumeData.skills.soft}</div>}
                  </div>
                </div>
              )}

              {/* Projects */}
              {resumeData.projects.length > 0 && (
                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider border-b pb-1 mb-2" style={{ color: EXECUTIVE_PRIMARY_COLOR }}>
                    Projects & Key Highlights
                  </h2>
                  <div className="space-y-3">
                    {resumeData.projects.map(proj => (
                      <div key={proj.id} className="text-xs">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>{proj.title} <span className="text-slate-500 font-normal">({proj.techStack})</span></span>
                          {proj.link && <span className="text-[11px] font-mono text-indigo-600">{proj.link}</span>}
                        </div>
                        {proj.bullets && proj.bullets.length > 0 && (
                          <ul className="list-disc pl-4 text-slate-700 space-y-0.5 mt-0.5">
                            {proj.bullets.map((b, i) => (
                              <li key={i}>{b}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {resumeData.education.length > 0 && (
                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider border-b pb-1 mb-2" style={{ color: EXECUTIVE_PRIMARY_COLOR }}>
                    Education
                  </h2>
                  {resumeData.education.map(edu => (
                    <div key={edu.id} className="flex justify-between text-xs text-slate-800">
                      <span className="font-bold">{edu.degree} — {edu.institution}</span>
                      <span className="text-slate-500 font-mono">{edu.endDate}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
