# AI-Powered CV Optimizer & Career Acceleration Suite

> **Tagline:** *"Upload. Optimize. Get Hired."*  
> **Target Platform:** Full-Stack Web Application (Node.js + Express.js + React 19 + TypeScript + Vite + Tailwind CSS + Google Gemini AI)

---

## 📑 Table of Contents
1. [Executive Summary & Motivation](#1-executive-summary--motivation)
2. [Step-by-Step Guide: Running Locally in VS Code](#2-step-by-step-guide-running-locally-in-vs-code)
3. [System Architecture & Data Flow](#3-system-architecture--data-flow)
4. [Complete Project Mechanics (For Final Defense & Viva)](#4-complete-project-mechanics-for-final-defense--viva)
   - [A. Resume File Ingestion (PDF / DOCX Parsing)](#a-resume-file-ingestion-pdf--docx-parsing)
   - [B. 10-Category ATS Scoring Algorithm](#b-10-category-ats-scoring-algorithm)
   - [C. AI Engine & Heuristic Fallback Engine](#c-ai-engine--heuristic-fallback-engine)
   - [D. LinkedIn Profile Optimizer & Coaching Blueprint](#d-linkedin-profile-optimizer--coaching-blueprint)
   - [E. Cover Letter & Outreach Email Generators](#e-cover-letter--outreach-email-generators)
   - [F. Database & Persistence Layer](#f-database--persistence-layer)
   - [G. Admin Dashboard & Telemetry](#g-admin-dashboard--telemetry)
5. [Anticipated Defense Questions & Answers (Viva Prep)](#5-anticipated-defense-questions--answers-viva-prep)
6. [Credentials & Configuration Reference](#6-credentials--configuration-reference)

---

## 1. Executive Summary & Motivation

Modern hiring relies heavily on **Applicant Tracking Systems (ATS)**—software used by over 98% of Fortune 500 companies to filter, score, and rank job applicants before a human recruiter ever sees a resume. Due to non-standard resume formats, missing industry keywords, and weak metric articulation, **over 75% of qualified resumes are automatically rejected**.

This project provides an end-to-end, full-stack career platform that bridges this gap:
- **Transparent ATS Analysis:** Evaluates resumes against target Job Descriptions (JD) across a strict 10-category scoring matrix (0–100 score) with detailed keyword gap analysis.
- **Dynamic CV Builder:** Parses uploaded PDFs and Word documents into structured JSON schemas, enabling one-click edits and multi-template PDF exports.
- **LinkedIn Profile Coach:** Transforms cold 3rd-person resume bullets into engaging 1st-person recruiter-optimized headlines, summaries, and action blueprints.
- **Cover Letter & Outreach Studio:** Generates tailored, anti-hallucination cover letters and cold recruiter outreach messages.
- **High-Availability Hybrid Architecture:** Seamlessly switches between the Google Gemini API (`gemini-2.5-flash`) and a local offline **Heuristic NLP Engine** (`src/heuristic_service.ts`), ensuring 100% uptime even without an internet connection or API quota.

---

## 2. Step-by-Step Guide: Running Locally in VS Code

Follow these clear, beginner-friendly instructions to clone, install, and run this project on your personal computer using Visual Studio Code.

### 📋 Prerequisites
Before you start, ensure you have the following installed on your computer:
1. **Node.js** (Version 18.x or higher, recommended: Node.js 20 LTS): [Download Node.js](https://nodejs.org/)
2. **Visual Studio Code**: [Download VS Code](https://code.visualstudio.com/)
3. **Git** (Optional, if cloning directly): [Download Git](https://git-scm.com/)

---

### Step 1: Download or Clone the Repository
- **Option A (Via Git):**
  Open your terminal or command prompt and run:
  ```bash
  git clone https://github.com/your-username/cv-optimizer.git
  cd cv-optimizer
  ```
- **Option B (Via ZIP Download):**
  1. Click **Code -> Download ZIP** on GitHub.
  2. Extract the downloaded ZIP file to a folder on your computer (e.g., `C:\Projects\cv-optimizer` or `~/Projects/cv-optimizer`).

---

### Step 2: Open the Folder in VS Code
1. Open **Visual Studio Code**.
2. Click **File -> Open Folder...** (or `Cmd + O` on macOS / `Ctrl + K Ctrl + O` on Windows).
3. Select the extracted `cv-optimizer` directory and click **Open**.

---

### Step 3: Open the Integrated Terminal
1. In VS Code, open the integrated terminal by pressing:
   - Windows/Linux: `Ctrl + ~` (tilde) or click **Terminal -> New Terminal** from the top menu bar.
   - macOS: `Cmd + ~` (tilde).
2. Verify that your Node.js and npm versions are recognized:
   ```bash
   node -v
   npm -v
   ```
   *(Should output `v18.x.x` or `v20.x.x` and `npm 9+` or `10+`)*

---

### Step 4: Install Dependencies
In the terminal, run:
```bash
npm install
```
This will read `package.json` and download all necessary frontend and backend libraries into a local `node_modules` folder.

---

### Step 5: Configure Environment Variables
1. Create a `.env` file in the root directory by copying the sample:
   - On Windows (PowerShell):
     ```powershell
     cp .env.example .env
     ```
   - On macOS/Linux:
     ```bash
     cp .env.example .env
     ```
   - Or simply right-click in the VS Code file explorer -> **New File** -> name it `.env`.
2. Open `.env` and configure your settings:
   ```env
   # Required for AI generation features (obtain free key from https://aistudio.google.com/app/apikey)
   GEMINI_API_KEY=your_gemini_api_key_here

   # Server Port (Default is 3000)
   PORT=3000
   ```
   > **Note on Offline / No-Key Mode:** Even if you do NOT provide a `GEMINI_API_KEY`, the application is equipped with an integrated **Local Heuristic Fallback Engine** that will automatically compute ATS scores, perform keyword gap analysis, and extract skills locally!

---

### Step 6: Start the Development Server
In the VS Code terminal, run:
```bash
npm run dev
```

You will see output indicating that the backend Express server and Vite development server are running:
```
Server running on port 3000
Vite dev server ready
```

---

### Step 7: Open the Application in Your Browser
Open your web browser (Chrome, Edge, Firefox, or Safari) and visit:
```
http://localhost:3000
```
You will see the live application dashboard ready to analyze and build resumes!

---

### Step 8: Build for Production (Optional / Evaluation Check)
To test the standalone production build:
```bash
npm run build
npm start
```
This bundles the React client into `dist/` and packages the Express backend using `esbuild` into a self-contained CommonJS runtime at `dist/server.cjs`.

---

## 3. System Architecture & Data Flow

```
+-------------------------------------------------------------------------+
|                              CLIENT TIER                                |
|  React 19 (SPA) + TypeScript + Tailwind CSS + Lucide Icons + Recharts   |
|  - ATS Scanner Tab (0-100 Matrix, Keyword Gaps, Recommendation Badges)  |
|  - CV Builder Tab (Form Editor + Live PDF Multi-Template Rendering)     |
|  - LinkedIn Profile Coach (CV-to-LinkedIn Blueprint, Banner Themes)     |
|  - Cover Letter & Cold Outreach Generators                              |
|  - Admin Dashboard & Telemetry Logs                                     |
+------------------------------------+------------------------------------+
                                     |
                       REST API Calls (JSON / Base64)
                                     |
+------------------------------------v------------------------------------+
|                             BACKEND ENGINE                              |
|  Node.js + Express.js Server (`server.ts`)                              |
|  - Multipart File Receiver & Base64 Decoder                             |
|  - Document Extraction Engine (`pdf-parse`, `mammoth` for DOCX)         |
|  - Authentication Controller (Direct single-factor session storage)    |
|  - Document & Resume Management APIs (/api/user/documents, /api/resumes)|
|  - Telemetry & Security Audit Logger                                    |
+-------------------+--------------------------------+--------------------+
                    |                                |
       (If GEMINI_API_KEY Present)          (Offline / Fallback Mode)
                    |                                |
+-------------------v--------------+  +--------------v--------------------+
|         AI CLOUD ENGINE          |  |      LOCAL HEURISTIC ENGINE       |
|  Google Gemini API               |  |  `src/heuristic_service.ts`       |
|  (`@google/genai` SDK)           |  |  - Regular Expression Tokenizer   |
|  - Model: `gemini-2.5-flash`     |  |  - TF-IDF Keyword Matcher         |
|  - Strict Anti-Hallucination     |  |  - 10-Category Scoring Algorithm  |
|  - Structured JSON Mode Output   |  |  - Skill Taxonomy Dictionaries    |
+----------------------------------+  +-----------------------------------+
```

---

## 4. Complete Project Mechanics (For Final Defense & Viva)

This section contains the in-depth technical explanations needed to explain the codebase during an academic or technical defense.

---

### A. Resume File Ingestion (PDF / DOCX Parsing)
1. **Client-Side:** The user drags and drops a PDF, DOCX, or TXT resume into `AnalyzerTab.tsx` or `LinkedInOptimizerTab.tsx`. The file is converted to a base64 string using the browser `FileReader` API.
2. **Server-Side Ingestion (`server.ts`):**
   - If the file is a PDF: The server strips the base64 data header, converts it to a raw binary buffer (`Buffer.from(base64, 'base64')`), and passes it to `pdf-parse`. `pdf-parse` extracts text streams, layout blocks, and metadata.
   - If the file is a DOCX: The binary buffer is passed to `mammoth.extractRawText`, which parses the XML structure of the Microsoft Word document into clean text.
3. **Sanitization:** Excess whitespace, binary null characters, and encoding artifacts are cleaned before passing text to the scoring and AI engines.

---

### B. 10-Category ATS Scoring Algorithm
The ATS scanner evaluates resume compatibility against a target Job Description using a transparent mathematical matrix with 10 weighted categories (Total = 100 points):

| # | Category | Weight | How It Is Evaluated |
| :--- | :--- | :--- | :--- |
| **1** | **Keyword Match** | 15 pts | Calculates frequency and contextual density of target JD keywords in the resume. |
| **2** | **Skills Match** | 15 pts | Compares required hard skills (e.g., React, TypeScript, Docker) and soft skills against candidate experience. |
| **3** | **Experience Relevance** | 15 pts | Checks whether past role responsibilities align with the seniorities and duties outlined in the JD. |
| **4** | **Education Match** | 10 pts | Matches required degrees (e.g., BS in Computer Science), fields of study, and academic equivalents. |
| **5** | **Job Title Match** | 10 pts | Analyzes similarity between target job title and past candidate designations. |
| **6** | **Formatting & Structure** | 10 pts | Checks for standard headers, parseable tables, font consistency, and absence of unreadable graphics. |
| **7** | **Section Completeness** | 5 pts | Verifies presence of all core sections: Summary, Experience, Education, Skills, and Contact Info. |
| **8** | **Achievement Strength** | 10 pts | Scans bullet points for the **STAR / XYZ formula** (Action Verb + Quantifiable Metric + Outcome). |
| **9** | **Contact & Social Info** | 5 pts | Verifies email, phone number, LinkedIn URL, and portfolio/GitHub links. |
| **10**| **ATS Parser Readability** | 5 pts | Tests clean token extraction without character distortion or broken text encoding. |

**Score Interpretation:**
- `80 - 100`: **Excellent Match** (High probability of passing automated enterprise ATS filters).
- `60 - 79`: **Moderate Match** (Needs keyword alignment and metric additions).
- `0 - 59`: **High Risk of ATS Rejection** (Missing critical skill keywords or core formatting).

---

### C. AI Engine & Heuristic Fallback Engine
1. **Google Gemini Integration (`src/gemini_service.ts`):**
   - Leverages the official Google GenAI SDK (`@google/genai`) using the high-speed, cost-effective `gemini-2.5-flash` model.
   - Enforces structured JSON output schema to ensure predictable type safety across TypeScript components.
   - Uses **Anti-Hallucination Prompts**: Strictly prevents the model from fabricating non-existent employers, fake metrics, or unearned certifications.
2. **Deterministic Heuristic Engine (`src/heuristic_service.ts`):**
   - If `GEMINI_API_KEY` is not provided or if the API rate limit is exceeded, the application triggers its built-in heuristic engine.
   - Performs dictionary-based skill extraction across 500+ technical and soft skill taxonomies.
   - Computes TF-IDF (Term Frequency-Inverse Document Frequency) keyword overlap between the CV and JD.
   - Generates deterministic category breakdowns and actionable recommendation tips.

---

### D. LinkedIn Profile Optimizer & Coaching Blueprint
The LinkedIn Optimizer (`src/components/LinkedInOptimizerTab.tsx`) solves a common candidate dilemma: *A CV is a formal retrospective document written in 3rd-person bullets, while LinkedIn is an interactive, searchable digital portfolio written in engaging 1st-person narrative.*

- **One-Click Ingestion:** Candidate uploads their CV, and the system extracts their primary title, core competencies, and career milestones.
- **Dynamic Identity:** Displays the logged-in candidate's name dynamically without hardcoded sample data.
- **Multiple Positioning Archetypes:**
  - *Technical Leader & Architect* (Scale, system design, engineering mentorship).
  - *0-to-1 Product Engineer* (Rapid product delivery, startup velocity, user impact).
  - *Recruiter SEO & Keyword Stack* (Maximized for recruiter boolean queries).
  - *Visionary Storyteller* (Career passion, mission, and long-term vision).
- **Banner Theme Selector:** Features modern banner presets including Tech Blue, Emerald Growth, Vibrant Sunset, and Dark Executive.
- **5-Step Action Blueprint:** Actionable checklist for headlines, storyteller summary, STAR bullets, top 5 skill tags, and manager recommendation templates.

---

### E. Cover Letter & Outreach Email Generators
- **Cover Letter Studio (`src/components/CoverLetterTab.tsx`):** Synthesizes the applicant's real CV achievements with target company requirements to produce 3 customizable paragraphs (Opening Hook, Core Experience & Metric Alignment, Enthusiastic Call-to-Action).
- **Outreach Email Studio (`src/components/OutreachEmailsTab.tsx`):** Provides instant templates for Recruiter Outreach, Hiring Manager DMs, Referral Requests, and Post-Interview Thank You notes.

---

### F. Database & Persistence Layer
- **Local Persistence (`data/db.json` via `src/db.ts`):** Stores user profiles, CV versions, generated documents, and user feedback locally with zero complex database setup.
- **Supabase Client Support (`src/lib/supabase.ts`):** Ready-to-connect integration with cloud PostgreSQL if cloud sync is enabled.
- **Document Management (`/api/user/documents`):** Users can save any generated strategy pack, cover letter, or elevator pitch directly to their "Saved Documents" tab for later retrieval.

---

### G. Admin Dashboard & Telemetry
- Accessible via admin credentials (`thapakaji@gmail.com` or `admin` with password `password`).
- Visualizes platform usage metrics via Recharts (Total Scans, Average ATS Match Score, Daily Activity).
- Displays AI token usage, API response latency, and system audit logs.
- Allows administrator role and account status toggles.

---

## 5. Anticipated Defense Questions & Answers (Viva Prep)

| # | Expected Question | Ideal Answer / Defense Explanation |
| :--- | :--- | :--- |
| **Q1** | **Why did you build a hybrid AI + Heuristic engine instead of relying purely on an LLM?** | LLM API calls require an active internet connection, incur financial costs, and can be subject to rate limits or latency. By engineering an offline Heuristic Engine in `heuristic_service.ts`, our platform guarantees **100% availability and deterministic 0–100 mathematical scoring** even when running offline or in restricted environments. |
| **Q2** | **How do you prevent the AI from hallucinating fake experience on resumes?** | Our system prompts enforce strict anti-hallucination rules. The prompt instructs the Gemini model to act strictly as a *formatting and articulation coach* rather than a creator. It is forbidden from inventing unlisted company names, altering employment dates, or introducing fake numerical metrics. |
| **Q3** | **How does your ATS scoring compare to commercial tools like Jobscan?** | Like Jobscan, our engine evaluates exact keyword density and hard/soft skill overlap. However, we expand on traditional tools by providing a **transparent 10-category breakdown** (including action-verb strength, formatting compatibility, and contact integrity) along with direct CV-to-LinkedIn and Cover Letter transformation pipelines in a single dashboard. |
| **Q4** | **How are files processed and is user data kept secure?** | File uploads are processed in-memory as binary buffers using `pdf-parse` and `mammoth`. Resumes are not sold or forwarded to third-party ad networks. In local mode, data resides strictly in `data/db.json` on the host server. |
| **Q5** | **Why was Vite + React 19 chosen for the frontend?** | React 19 provides modular state management and rapid DOM reconciliation. Vite offers lightning-fast build bundling and hot reloading. We decoupled all API calls into server-side routes (`/api/*`), ensuring secret API keys are never exposed in client browser bundles. |

---

## 6. Credentials & Configuration Reference

### Admin Login Credentials
- **Email / Username:** `thapakaji@gmail.com` (or `admin`)
- **Password:** `password`
- **Authentication Flow:** Direct single-factor login (MFA/2FA prompts removed for instant, seamless evaluation).

### Project Scripts Reference
- `npm run dev`: Runs the full-stack application using `tsx server.ts` (starts backend Express server with Vite middleware on port 3000).
- `npm run build`: Compiles the React client with Vite and bundles `server.ts` into CommonJS format at `dist/server.cjs` via `esbuild`.
- `npm start`: Runs the compiled production server from `dist/server.cjs`.
- `npm run lint`: Runs ESLint across the codebase to check syntax and type health.

---

*Created for AI Studio & Academic Project Defense.*
