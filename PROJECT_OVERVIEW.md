# 📘 Project Architecture & Comprehensive Study Guide
## AI-Powered ATS Resume Analyzer & Career Optimizer

Welcome to the comprehensive technical documentation and study guide for the **AI-Powered ATS Resume Analyzer & Career Optimizer**. This document provides an in-depth, file-by-file analysis of the frontend, backend, controller layers, database synchronization, and AI processing pipelines.

---

## 📑 Table of Contents
1. [System Architecture Overview](#1-system-architecture-overview)
2. [End-to-End Workflow & Data Flow](#2-end-to-end-workflow--data-flow)
3. [File Tree & Directory Structure](#3-file-tree--directory-structure)
4. [Backend Architecture & Controller Layer](#4-backend-architecture--controller-layer)
   - [Entry Point & Server Setup (`server.ts`)](#41-entry-point--server-setup-serverts)
   - [Middleware Layer (`server/middleware/`)](#42-middleware-layer-servermiddleware)
   - [Controllers Deep Dive (`server/controllers/`)](#43-controllers-deep-dive-servercontrollers)
   - [Routing System (`server/routes/`)](#44-routing-system-serverroutes)
5. [Database & Data Persistence Layer](#5-database--data-persistence-layer)
   - [`src/db.ts` Database Engine](#51-srcdbts-database-engine)
   - [`user.json` User Registry Sync](#52-userjson-user-registry-sync)
6. [AI & Heuristic Processing Engine](#6-ai--heuristic-processing-engine)
   - [`src/gemini_service.ts` Gemini GenAI Pipeline](#61-srcgemini_servicets-gemini-genai-pipeline)
   - [`src/heuristic_service.ts` Offline Heuristic Fallback](#62-srcheuristic_servicets-offline-heuristic-fallback)
   - [`src/services/` Privacy & PII Sanitization](#63-srcservices-privacy--pii-sanitization)
7. [Frontend Architecture & Component Hierarchy](#7-frontend-architecture--component-hierarchy)
   - [Root & Orchestration (`src/App.tsx`, `src/main.tsx`)](#71-root--orchestration-srcapptsx-srcmaintsx)
   - [Core ATS & Career Suite Components](#72-core-ats--career-suite-components)
   - [User Management Suite (`src/components/user/`)](#73-user-management-suite-srccomponentsuser)
   - [Admin Portal Suite (`src/components/admin/`)](#74-admin-portal-suite-srccomponentsadmin)
   - [Data Visualization & Insights](#75-data-visualization--insights)
8. [Comprehensive File-by-File Necessity Matrix](#8-comprehensive-file-by-file-necessity-matrix)
9. [Developer & Student Study Guide](#9-developer--student-study-guide)

---

## 1. System Architecture Overview

The application follows a **Full-Stack Decoupled Architecture** utilizing React 18 with TypeScript on the client side, and Express with TypeScript on the server side, tied together with Vite's server-side rendering middleware during development:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React 18 + TS)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │ AnalyzerTab  │  │ UserDashboard│  │ AdminOverview│  │ CvBuilder  │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └─────┬──────┘  │
│         │                 │                 │                │         │
│         └─────────────────┼─────────────────┴────────────────┘         │
│                           │ HTTP Fetch / JSON Payloads                 │
└───────────────────────────┼────────────────────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     BACKEND ROUTER (Express + TS)                      │
│                           │                                            │
│   /api/auth/*     /api/user/*     /api/admin/*    /api/analyze & more  │
│        │               │               │                   │           │
│        ▼               ▼               ▼                   ▼           │
│  AuthController   UserController  AdminController   ResumeController   │
└────────┬───────────────┬───────────────┬───────────────────┬───────────┘
         │               │               │                   │
         ├───────────────┴───────────────┴───────────────────┤
         ▼                                                   ▼
┌──────────────────────────────────┐        ┌────────────────────────────┐
│      PERSISTENCE LAYER           │        │     AI EVALUATION ENGINE   │
│  ┌────────────────────────────┐  │        │  ┌───────────────────────┐ │
│  │ src/db.ts (Local Store)    │  │        │  │ Google Gemini 2.5 API │ │
│  ├────────────────────────────┤  │        │  └───────────┬───────────┘ │
│  │ user.json (User Registry)  │  │        │              ▼ (Fallback)  │
│  ├────────────────────────────┤  │        │  ┌───────────────────────┐ │
│  │ data/db.json (Active DB)   │  │        │  │ Heuristic Rule Engine │ │
│  └────────────────────────────┘  │        │  └───────────────────────┘ │
└──────────────────────────────────┘        └────────────────────────────┘
```

---

## 2. End-to-End Workflow & Data Flow

### A. Resume Upload & ATS Evaluation Flow
1. **User Input**: The user uploads a resume file (`.pdf`, `.docx`, or `.txt`) or pastes raw resume text in `src/components/AnalyzerTab.tsx`.
2. **Frontend Sanitization & Dispatch**: The frontend triggers a `POST /api/analyze` request with the Base64 file or raw text.
3. **Backend Parsing (`ResumeController`)**:
   - If PDF: Uses `pdf-parse` to extract text from the binary stream.
   - If DOCX: Uses `mammoth` to extract raw text content.
   - If plain text: Cleans invalid control characters.
4. **AI Analysis (`gemini_service.ts` / `heuristic_service.ts`)**:
   - The server invokes the Google Gemini API with a structured prompt and schema.
   - If Gemini is unavailable or rate-limited, it automatically falls back to `localHeuristicAnalysis` to compute skill matches, section scores, and recommendations.
5. **Database Storage & Audit (`src/db.ts`)**:
   - The analysis result, predicted field, score factors, and skills are saved to `data/db.json`.
   - An audit log entry is written for the administrator.
6. **Frontend Visualization**:
   - The client renders the ATS Compatibility Gauge, Score Breakdown, Missing Skills Badges, Recommended Courses, Project Recommendations, and Interactive Radar/Bar charts (`ResumeCharts.tsx`).

### B. User Registration & Security Flow
1. **User Sign Up**: Candidate enters name, email, phone, and password in `AuthModal.tsx`.
2. **Controller Processing (`AuthController.signup`)**:
   - Validates fields, checks for duplicate accounts, hashes password.
   - Sets user role (`admin` for designated emails, `user` for standard accounts).
3. **Dual Persistence (`src/db.ts`)**:
   - Inserts record into `data/db.json`.
   - Synchronizes a clean, standardized record into `user.json`.
   - Generates welcome notification and logs a `USER_REGISTERED` security event.
4. **State Hydration**: Returns the sanitized user profile (excluding password) to hydrate client-side session state in `src/App.tsx`.

---

## 3. File Tree & Directory Structure

```
├── .env.example                      # Template for required environment variables
├── .gitignore                        # Git exclusion rules
├── README.md                         # Standard project overview
├── PROJECT_OVERVIEW.md               # [THIS FILE] In-depth technical guide
├── index.html                        # Single Page Application HTML root
├── metadata.json                     # AI Studio application metadata & permissions
├── package.json                      # NPM dependencies & build scripts
├── tsconfig.json                     # TypeScript compiler configuration
├── user.json                         # Synchronized user registration database
├── vite.config.ts                    # Vite configuration with Tailwind integration
│
├── server.ts                         # Main Express application entry point
├── server/                           # Backend Architecture
│   ├── middleware/
│   │   └── auth.middleware.ts        # Admin authorization & security check
│   ├── controllers/
│   │   ├── admin.controller.ts       # Admin metrics, user status & audit logs
│   │   ├── auth.controller.ts        # Signup, login, password & MFA management
│   │   ├── feedback.controller.ts    # User ratings & feedback management
│   │   ├── privacy.controller.ts     # Privacy audit trails & settings
│   │   ├── resume.controller.ts      # ATS resume analysis & cover letters
│   │   └── user.controller.ts        # CV versions, sessions, docs & deletion
│   └── routes/
│       ├── admin.routes.ts           # /api/admin routing
│       ├── auth.routes.ts            # /api/auth routing
│       ├── feedback.routes.ts        # /api/feedback routing
│       ├── privacy.routes.ts         # /api/privacy routing
│       ├── resume.routes.ts          # /api (analyze, cover-letter, records)
│       ├── user.routes.ts            # /api/user routing
│       └── index.ts                  # Central API router index
│
├── data/
│   ├── db.json                       # Local JSON database storage
│   └── user.json                     # Mirrored user registration JSON
│
└── src/                              # Frontend Architecture & Shared Services
    ├── main.tsx                      # React root entry point
    ├── App.tsx                       # Master Application Orchestrator & State
    ├── index.css                     # Global styles & Tailwind CSS imports
    ├── types.ts                      # Universal TypeScript Interfaces & Types
    ├── db.ts                         # Local Storage Engine & CRUD Helpers
    ├── gemini_service.ts             # Google Gemini GenAI SDK Client
    ├── heuristic_service.ts          # Offline Keyword & ATS Heuristic Engine
    │
    ├── config/
    │   └── aiDataPolicy.ts           # AI Privacy Policy configuration
    │
    ├── lib/
    │   └── supabase.ts               # Optional Supabase client configuration
    │
    ├── services/
    │   ├── aiPrivacyGuard.service.ts # PII detection & masking for AI payloads
    │   ├── gemini.service.ts         # Gemini prompt construction helpers
    │   ├── piiSanitization.service.ts# Regex sanitizers for emails/phones
    │   └── privacyAudit.service.ts   # In-memory & local audit log tracker
    │
    └── components/                   # React UI Components
        ├── Navbar.tsx                # Top navigation bar with active tab & auth
        ├── LandingPage.tsx           # Product showcase & landing screen
        ├── AuthModal.tsx             # Modal for Login, Signup & Admin Access
        ├── AnalyzerTab.tsx           # Interactive ATS Resume Analyzer
        ├── CvBuilderTab.tsx          # Real-time Interactive CV Builder
        ├── CoverLetterTab.tsx        # AI Cover Letter Generator
        ├── LinkedInOptimizerTab.tsx  # LinkedIn Profile Optimizer
        ├── BioGeneratorTab.tsx       # Professional Bio & Elevator Pitch Creator
        ├── OutreachEmailsTab.tsx     # Cold Outreach & Interview Follow-up Emails
        ├── FeedbackTab.tsx           # Rating submission & community reviews
        ├── AboutTab.tsx              # Documentation, ATS criteria & algorithm info
        ├── PresentationSlides.tsx    # Slide deck explaining ATS technology
        ├── PrivacyIndicator.tsx      # Visual badge showing zero-retention status
        ├── PrivacySettingsModal.tsx  # User control for PII masking & data privacy
        ├── ResumeCharts.tsx          # Recharts visualizations (Radar, Bar, Pie)
        ├── ClusteringMap.tsx         # Skill cluster network visualization
        ├── SkillUpgradePathway.tsx   # Step-by-step career skill roadmap
        ├── ChecklistAudit.tsx        # ATS resume checklist interactive widget
        │
        ├── admin/
        │   └── AdminDashboardOverview.tsx # Complete Admin Dashboard & Telemetry
        │
        └── user/
            ├── UserDashboard.tsx     # Candidate dashboard wrapper
            ├── MyCVsTab.tsx          # Saved CVs & version history
            ├── GeneratedDocsTab.tsx  # Generated cover letters & emails archive
            └── SecuritySettingsTab.tsx # 2FA, session manager & data erasure
```

---

## 4. Backend Architecture & Controller Layer

### 4.1 Entry Point & Server Setup (`server.ts`)
- **Purpose**: Initializes the Express HTTP server, configures CORS and JSON payload parsers (with a 50MB limit to support binary resume uploads), and mounts all modular routes.
- **Vite Integration**: In development mode, attaches Vite as middleware so the frontend and backend run seamlessly on a unified port (`3000`). In production, serves static assets from `dist/`.

### 4.2 Middleware Layer (`server/middleware/auth.middleware.ts`)
- **`requireAdmin`**:
  - Validates `x-admin-token` or user email privileges (`thapakaji@gmail.com` or users with `role: "admin"`).
  - Automatically records an `UNAUTHORIZED_ADMIN_ACCESS` security event in `src/db.ts` upon unauthorized attempts.
  - Returns `403 Forbidden` if validation fails.

### 4.3 Controllers Deep Dive (`server/controllers/`)

#### 1. `auth.controller.ts`
- **`signup(req, res)`**: Registers a new user, hashes credentials, creates default profile, logs registration event, triggers welcome notification, and writes to `user.json`.
- **`login(req, res)`**: Authenticates credentials, verifies account status (`active` vs `disabled`), registers an active session, logs security events, and returns safe user data.
- **`updateProfile(req, res)`**: Modifies user name, phone, or location.
- **`changePassword(req, res)`**: Validates current password and updates to new password.
- **`toggleMfa(req, res)`**: Enables or disables Two-Factor Authentication flag.

#### 2. `resume.controller.ts`
- **`analyzeResume(req, res)`**:
  - Handles incoming multipart Base64 files (`.pdf` via `pdf-parse`, `.docx` via `mammoth`) or raw text strings.
  - Calls `gemini_service.ts` or falls back to `heuristic_service.ts`.
  - Computes ATS scores (0-100), factor status, keyword gaps, and recommended courses.
  - Saves the record in `data/db.json` and returns the structured evaluation.
- **`generateCoverLetter(req, res)`**: Generates a tailored cover letter based on candidate skills, job title, and company name using Gemini or a high-quality fallback template.
- **`getRecords(req, res)`**: Retrieves analyzed CV records (filterable by owner email).
- **`deleteRecord(req, res)`**: Removes a CV record by ID and logs the deletion.

#### 3. `user.controller.ts`
- **`getUserCvs(req, res)`**: Fetches all CV records belonging to a logged-in user.
- **`getVersions(req, res)` / `createVersion(req, res)` / `deleteVersion(req, res)`**: Full CRUD operations for CV version control.
- **`getDocuments(req, res)` / `createDocument(req, res)` / `deleteDocument(req, res)`**: Manages saved cover letters, bios, and outreach messages.
- **`getSessions(req, res)` / `revokeSession(req, res)`**: Provides active session tracking and one-click revocation of other devices.
- **`getNotifications(req, res)`**: Retrieves user-specific system alerts and tips.
- **`getSecurityActivity(req, res)`**: Retrieves personal audit history.
- **`clearAiHistory(req, res)`**: Clears AI evaluation history.
- **`deleteAllUserData(req, res)` / `deleteAccount(req, res)`**: Enforces GDPR/CCPA-compliant complete data erasure.

#### 4. `admin.controller.ts`
- **`adminLogin(req, res)`**: Authenticates administrative credentials.
- **`getAdminStats(req, res)`**: Returns platform-wide statistics (total users, active users, total scans, memory usage, server uptime).
- **`getAdminUsers(req, res)`**: Returns registered user directory with CV counts and roles.
- **`updateUserStatus(req, res)` / `updateUserRole(req, res)`**: Toggles account enablement and upgrades/downgrades roles.
- **`getFeatureUsage(req, res)` & `getAiUsage(req, res)`**: Returns tool consumption metrics and token statistics.
- **`getSystemHealth(req, res)`**: Evaluates latency across database, API, and file storage subsystems.
- **`getAdminSecurityEvents(req, res)` & `getAdminAuditLogsList(req, res)`**: Returns security logs and administrative action audits.

#### 5. `feedback.controller.ts`
- **`getAllFeedback(req, res)`**: Returns all public user reviews and star ratings.
- **`submitFeedback(req, res)`**: Saves candidate reviews and scores.

#### 6. `privacy.controller.ts`
- **`getPrivacyAudit(req, res)`**: Returns PII sanitization and AI data minimization audit trails.
- **`getPrivacySettings(req, res)`**: Returns system privacy compliance parameters.

### 4.4 Routing System (`server/routes/`)
All routes are separated into dedicated route files and bundled in `server/routes/index.ts`:
- `/api/auth/*` ➔ `auth.routes.ts`
- `/api/user/*` ➔ `user.routes.ts`
- `/api/admin/*` ➔ `admin.routes.ts`
- `/api/feedback/*` ➔ `feedback.routes.ts`
- `/api/privacy/*` ➔ `privacy.routes.ts`
- `/api/*` (e.g. `/api/analyze`) ➔ `resume.routes.ts`

---

## 5. Database & Data Persistence Layer

### 5.1 `src/db.ts` Database Engine
A lightweight, JSON-backed persistence layer built with Node.js `fs` module:
- **Collections Managed**:
  - `auth_users`: Registered accounts, password hashes, roles, MFA status.
  - `user_data`: Evaluated CV records, scoring JSON, recommended courses.
  - `user_versions`: CV snapshot versions for comparison.
  - `user_documents`: Saved cover letters and bios.
  - `user_sessions`: Active device tokens and login timestamps.
  - `user_notifications`: User alerts and guidance tips.
  - `security_events`: Security event log (logins, failures, deletions).
  - `admin_audit_logs`: Administrative actions log.
  - `user_feedback`: User ratings and comments.

### 5.2 `user.json` User Registry Sync
Whenever an account is registered or modified, `syncUserJson()` formats the data into a clean public schema and synchronizes it to `/user.json` and `/data/user.json`:

```json
[
  {
    "id": 1,
    "name": "Platform Administrator",
    "email": "thapakaji@gmail.com",
    "phone": "+1-800-555-ADMIN",
    "role": "admin",
    "status": "active",
    "mfa_enabled": false,
    "registered_at": "2026-08-14T00:00:00.000Z"
  }
]
```

---

## 6. AI & Heuristic Processing Engine

### 6.1 `src/gemini_service.ts` Gemini GenAI Pipeline
- Connects to Google's `@google/genai` SDK using `process.env.GEMINI_API_KEY`.
- Uses `gemini-2.5-flash` for high-speed, structured JSON generation.
- Implements exponential backoff retry logic (`callGeminiWithRetry`) to handle transient rate limits.

### 6.2 `src/heuristic_service.ts` Offline Heuristic Fallback
- Comprehensive rule-based parser that executes when offline or when no API key is provided.
- Contains extensive keyword dictionaries across **Software Development, Data Science, Web Development, Mobile Development, DevOps/Cloud, UI/UX Design, and Product Management**.
- Evaluates:
  - Section presence (Experience, Education, Skills, Projects, Certifications).
  - Quantifiable metrics (percentages, numbers, impact statements).
  - Contact information completeness.
  - Calculates ATS score (0-100) and outputs structured recommendations.

### 6.3 `src/services/` Privacy & PII Sanitization
- **`piiSanitization.service.ts`**: Uses deterministic regular expressions to redact Social Security numbers, credit cards, and sensitive identifiers.
- **`aiPrivacyGuard.service.ts`**: Wraps AI requests to ensure raw personal data is minimized before transmission.
- **`privacyAudit.service.ts`**: Maintains an audit log of sanitization events.

---

## 7. Frontend Architecture & Component Hierarchy

### 7.1 Root & Orchestration (`src/App.tsx`, `src/main.tsx`)
- Coordinates the current active tab (`activeTab`).
- Manages authenticated user session (`loggedInUser`), stored in `localStorage`.
- Handles global modals (`AuthModal`, `PrivacySettingsModal`).
- Provides navigation routing across the application.

### 7.2 Core ATS & Career Suite Components
- **`Navbar.tsx`**: Header with logo, navigation links, quick analysis CTA, user profile dropdown, and auth trigger.
- **`LandingPage.tsx`**: Visual showcase highlighting ATS scoring features, statistics, and quick-start actions.
- **`AnalyzerTab.tsx`**: Drag-and-drop resume upload zone, PDF text parser, real-time analysis triggering, and comprehensive results dashboard.
- **`CvBuilderTab.tsx`**: Interactive resume builder with live preview, section reordering, and PDF export.
- **`CoverLetterTab.tsx`**: AI generator for custom job application letters.
- **`LinkedInOptimizerTab.tsx`**: Headline, About section, and experience bullet points optimizer.
- **`BioGeneratorTab.tsx`**: Executive, speaker, and portfolio bio generator.
- **`OutreachEmailsTab.tsx`**: Networking, cold pitch, and interview follow-up email creator.
- **`FeedbackTab.tsx`**: User testimonial submission and ratings display.
- **`AboutTab.tsx`**: Educational reference detailing how ATS scanners parse resumes.

### 7.3 User Management Suite (`src/components/user/`)
- **`UserDashboard.tsx`**: Main candidate portal coordinating sub-tabs.
- **`MyCVsTab.tsx`**: Past resume evaluations and version history.
- **`GeneratedDocsTab.tsx`**: Library of saved cover letters and emails.
- **`SecuritySettingsTab.tsx`**: Session manager, password reset, 2FA toggle, and complete data deletion.

### 7.4 Admin Portal Suite (`src/components/admin/`)
- **`AdminDashboardOverview.tsx`**: Unified administrative command center displaying:
  - System performance metrics (uptime, heap memory, response latency).
  - User management table (role switching, account disabling).
  - AI and feature usage analytics.
  - Live security event logs and administrative audit trail.

### 7.5 Data Visualization & Insights
- **`ResumeCharts.tsx`**: Interactive visual charts (Skill Competency Radar, Section Breakdown Bar Chart, Experience Fit Pie Chart) built with `recharts`.
- **`ClusteringMap.tsx`**: Visual skill cluster mapping.
- **`SkillUpgradePathway.tsx`**: Career progression milestone tracker.
- **`ChecklistAudit.tsx`**: Interactive ATS compliance checklist.
- **`PresentationSlides.tsx`**: Interactive slide deck for educational presentations.

---

## 8. Comprehensive File-by-File Necessity Matrix

| File Path | Layer | Necessity & Purpose |
| :--- | :--- | :--- |
| `server.ts` | Backend Entry | Express server boot, CORS, body parsers, Vite dev server middleware integration. |
| `server/routes/index.ts` | Backend Routing | Aggregates and mounts all sub-routes under `/api`. |
| `server/routes/auth.routes.ts` | Backend Routing | Endpoints for signup, login, profile, password change, and MFA. |
| `server/routes/resume.routes.ts`| Backend Routing | Endpoints for resume analysis, cover letter creation, and record management. |
| `server/routes/user.routes.ts` | Backend Routing | Endpoints for user CV versions, documents, sessions, and data erasure. |
| `server/routes/admin.routes.ts` | Backend Routing | Endpoints for admin statistics, user management, telemetry, and security logs. |
| `server/routes/feedback.routes.ts`| Backend Routing | Endpoints for listing and posting user ratings. |
| `server/routes/privacy.routes.ts` | Backend Routing | Endpoints for privacy settings and audit trails. |
| `server/controllers/auth.controller.ts` | Controller | Business logic for authentication, validation, session generation, and user.json sync. |
| `server/controllers/resume.controller.ts`| Controller | PDF/DOCX file extraction, Gemini AI scoring with heuristic fallback, and record saving. |
| `server/controllers/user.controller.ts` | Controller | Versioning, document CRUD, session revocation, and GDPR data erasure logic. |
| `server/controllers/admin.controller.ts`| Controller | Aggregates system metrics, manages account statuses, and serves audit logs. |
| `server/controllers/feedback.controller.ts`| Controller | Manages user feedback and reviews. |
| `server/controllers/privacy.controller.ts`| Controller | Manages privacy policies and audit logs. |
| `server/middleware/auth.middleware.ts` | Middleware | Protects admin endpoints and logs unauthorized intrusion attempts. |
| `src/db.ts` | Persistence | Reads/writes `data/db.json` and keeps `user.json` synchronized. |
| `user.json` | Public Data | Standalone, human-readable user registry updated on every registration. |
| `src/gemini_service.ts` | AI Service | Client for Google Gemini GenAI SDK with automatic retry logic. |
| `src/heuristic_service.ts` | Offline AI | 100% offline rule-based ATS evaluation engine with comprehensive skill dictionaries. |
| `src/types.ts` | Shared Types | Defines all TypeScript interfaces (User, ResumeData, Evaluation, AdminStats, etc.). |
| `src/App.tsx` | Frontend Orchestrator | Root React component managing navigation, session state, and modal triggers. |
| `src/main.tsx` | Frontend Entry | Mounts React DOM to `index.html`. |
| `src/index.css` | Styling | Global styles and Tailwind CSS configurations. |
| `src/components/AnalyzerTab.tsx` | UI Component | Primary ATS evaluation UI supporting drag-and-drop file upload, pasting, and results display. |
| `src/components/CvBuilderTab.tsx` | UI Component | Interactive resume builder with customizable sections and PDF export. |
| `src/components/CoverLetterTab.tsx` | UI Component | Generator for tailored cover letters. |
| `src/components/LinkedInOptimizerTab.tsx` | UI Component | Generator for LinkedIn profile content. |
| `src/components/BioGeneratorTab.tsx` | UI Component | Generator for professional bios and pitches. |
| `src/components/OutreachEmailsTab.tsx` | UI Component | Generator for job inquiry and follow-up emails. |
| `src/components/Navbar.tsx` | UI Component | Navigation bar with tab switching and user profile menu. |
| `src/components/AuthModal.tsx` | UI Component | Authentication modal for candidate signup, login, and admin access. |
| `src/components/ResumeCharts.tsx` | UI Component | Visual charts (radar, bar, pie) for ATS metrics. |
| `src/components/admin/AdminDashboardOverview.tsx`| UI Component | Comprehensive admin dashboard for telemetry, users, and audit logs. |
| `src/components/user/UserDashboard.tsx` | UI Component | Candidate portal coordinating saved CVs, documents, and security. |
| `src/components/user/SecuritySettingsTab.tsx` | UI Component | Security management (2FA, sessions, data deletion). |

---

## 9. Developer & Student Study Guide

If you are studying this codebase to understand how modern full-stack web applications and ATS analyzers operate, follow this recommended sequence:

### Step 1: Understand the Data Model
- Start by reading `src/types.ts`. It provides a blueprint of all entities in the system: candidate profiles, ATS evaluation responses, scoring criteria, and audit logs.

### Step 2: Explore the Storage & Persistence Layer
- Read `src/db.ts` to see how local JSON persistence works, how default admin credentials are seeded, and how `user.json` is automatically updated on user registration.

### Step 3: Study the ATS Evaluation Engines
- Review `src/heuristic_service.ts` to understand how deterministic ATS scoring works (identifying sections, detecting action verbs, calculating skill densities).
- Next, review `src/gemini_service.ts` to understand how large language models are prompted with structured schemas and fallback handling.

### Step 4: Examine the Backend Controller & Routing Architecture
- Read `server.ts` to see how Express and Vite work together.
- Follow the path of a request: `server/routes/resume.routes.ts` ➔ `server/controllers/resume.controller.ts` ➔ `src/db.ts`.

### Step 5: Explore the Frontend State & UI Components
- Open `src/App.tsx` to understand top-level React state management and tab routing.
- Review `src/components/AnalyzerTab.tsx` to see how file upload, base64 encoding, and API integration are tied together with animated UI feedback.
- Examine `src/components/admin/AdminDashboardOverview.tsx` to see how protected administration interfaces consume telemetry and audit endpoints.
