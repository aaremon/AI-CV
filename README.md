# Complete AI-Powered CV Optimizer (Node.js + Express.js Engine)

> **Tagline:** "Upload. Optimize. Get Hired."

A production-ready, full-stack Node.js + Express.js + React TypeScript application designed to optimize CVs, calculate transparent 0–100 ATS compatibility scores, run keyword gap analyses, generate tailored cover letters, optimize LinkedIn profiles, enhance resume bullet points using the **Action + Task + Method + Result** formula, produce executive bios and elevator pitches, and generate cold job outreach emails.

---

## 🔑 Admin Login Credentials

The platform provides a full-featured Administrator Control Panel for telemetry, system health monitoring, user account control, and audit logs.

| Role | Username / Email | Password | Multi-Factor Auth (MFA) |
| :--- | :--- | :--- | :--- |
| **Administrator** | `thapakaji@gmail.com` (or `admin`) | `password` | **Removed / Disabled** (Direct Single-Factor Authentication) |

> **Note:** Multi-Factor Authentication (MFA/2FA) verification has been completely removed to provide instant, seamless administrator and user login.

---

## 1. Features & Core Modules

### A. Core Tools
1. **ATS Resume Scanner & Compatibility Checker**:
   - 0–100 ATS compatibility score based on a transparent 10-category scoring matrix (Keyword Match, Skills Match, Experience Relevance, Education, Job Title Match, Formatting, Section Completeness, Achievement Strength, Contact Info, ATS Readability).
   - Keyword Gap Analysis categorizing found vs. missing hard/soft skills and technical terminology.
   - Formatting checks for legacy ATS compatibility.

2. **CV Builder & AI Extraction**:
   - PDF and DOCX resume text extraction using Node.js parsing libraries (`pdf-parse` and `mammoth`).
   - Extracts structured JSON fields (Personal Details, Summary, Experience, Education, Skills, Projects, Certifications) into editable forms with instant preview and multi-template rendering.

3. **AI Cover Letter Generator**:
   - Tailored cover letter generation aligned with candidate experience and target job description.
   - Tone selection: Professional, Confident, Modern, Formal, Friendly, Executive.
   - Strict Anti-Hallucination rules ensuring zero fabricated experience or metrics.

### B. My Workspace
1. **My Resumes**:
   - Manage multiple versions of uploaded and generated CVs.
   - One-click duplicate, edit, export, and comparative analytics.

2. **Saved Documents**:
   - Central repository for all generated cover letters, bios, outreach emails, and optimized summaries.

### C. Career Agents
1. **LinkedIn Profile Optimizer**:
   - Generates high-impact headlines, engaging 1st-person About section, experience adaptors, and recruiter visibility tips.

2. **Executive Summary & Bio Generator**:
   - Generates 3 resume summary options, a 3rd-person professional bio, and a 30-second elevator pitch across career levels (Entry, Junior, Mid-Level, Senior, Executive, Career Changer).

3. **Outreach & Job Email Studio**:
   - Application, Recruiter Outreach, Referral Request, Hiring Manager Outreach, Interview Follow-up, and Thank You emails.

4. **Resume Proofreader & Bullet Point Enhancer**:
   - Enhances bullet points using Action + Task + Method + Result formula.
   - Before / After side-by-side comparison.

### D. Admin & System Management
1. **Admin Control Panel**:
   - Real-time platform metrics (total users, CV scans, average ATS match score, daily scan rates).
   - User account status management (active/disabled) and role management (user/admin).
   - Telemetry on AI prompt token usage, latency, and system health status.
   - Security event logs and administrator audit trails.

---

## 2. Technology Stack

- **Backend / Core Engine**: Node.js 20+ & Express.js 4.x (`server.ts`)
- **Frontend / UI**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts
- **AI Integration**: Google Gemini API (`@google/genai` SDK with `gemini-2.5-flash`)
- **Document Processing**: `pdf-parse`, `mammoth`
- **Database / Persistence**: Local JSON persistence engine (`data/db.json`) with optional Supabase client integration
- **Build / Bundle Engine**: Vite & `esbuild`

---

## 3. Project Architecture

```
cv-optimizer/
│
├── server.ts                # Main Express.js backend server & API endpoints
├── package.json             # Complete Node.js dependencies and scripts
├── .env.example             # Environment variable template
├── README.md                # Comprehensive project documentation
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite dev server configuration
│
├── src/                     # React & Express Shared Application Code
│   ├── main.tsx             # React entry point
│   ├── App.tsx              # Application layout & active view controller
│   ├── db.ts                # Local persistence & user database helper
│   ├── gemini_service.ts    # Google Gemini API client & fallback logic
│   ├── heuristic_service.ts # Local ATS analysis & heuristic fallback engine
│   ├── types.ts             # Global TypeScript interfaces & data models
│   │
│   └── components/          # Modular React Components
│       ├── DashboardTab.tsx
│       ├── CvBuilderTab.tsx
│       ├── AnalyzerTab.tsx
│       ├── CoverLetterTab.tsx
│       ├── LinkedInOptimizerTab.tsx
│       ├── BulletEnhancerTab.tsx
│       ├── BioGeneratorTab.tsx
│       ├── OutreachEmailsTab.tsx
│       ├── Navbar.tsx
│       ├── AuthModal.tsx
│       ├── AdminTab.tsx
│       ├── FeedbackTab.tsx
│       ├── AboutTab.tsx
│       ├── PresentationSlides.tsx
│       └── ResumeCharts.tsx
│
└── data/                    # Database & Persistent Records
    └── db.json
```

---

## 4. Local Setup Instructions

### Step 1: Open Project Directory
Open your terminal in the root directory of the project.

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Set your `GEMINI_API_KEY`:
```env
GEMINI_API_KEY="your_actual_gemini_api_key_here"
PORT=3000
```

### Step 4: Run Application in Development Mode
```bash
npm run dev
```
Open your browser and navigate to:
`http://localhost:3000`

### Step 5: Build for Production
```bash
npm run build
npm start
```

---

## 5. Security & Authentication Architecture

1. **Direct Single-Factor Authentication**:
   - Fast login flow for users and administrators without mandatory MFA token prompts.
   - Protected API endpoints validate request tokens and authorization headers.
2. **Anti-Hallucination & AI Safety**:
   - System prompts explicitly forbid inventing fictitious employers, degrees, certifications, or false metrics.
   - Contextual enhancement relies exclusively on provided applicant input.
3. **Graceful Fallbacks**:
   - If `GEMINI_API_KEY` is not present, local heuristic algorithms handle 10-category ATS scoring, keyword extraction, and gap analysis with 0% downtime.
