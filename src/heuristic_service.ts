interface ScoreFactors {
  has_objective: boolean;
  has_education: boolean;
  has_experience: boolean;
  has_internship: boolean;
  has_skills: boolean;
  has_hobbies: boolean;
  has_interests: boolean;
  has_achievements: boolean;
  has_certifications: boolean;
  has_projects: boolean;
}

interface FeedbackItem {
  factor: string;
  status: string;
  detail: string;
}

interface CourseItem {
  title: string;
  link: string;
}

export interface ParsedResumeResult {
  name: string;
  email: string;
  phone: string;
  degree: string;
  no_of_pages: number;
  cand_level: 'Fresher' | 'Intermediate' | 'Experienced';
  predicted_field: string;
  current_skills: string[];
  recommended_skills: string[];
  resume_score: number;
  score_factors: ScoreFactors;
  feedback: FeedbackItem[];
  recommended_courses: CourseItem[];
  ats_compatibility_score?: number;
  missing_skills?: string[];
  experience_relevance?: string;
  education_relevance?: string;
  strengths?: string[];
  weaknesses?: string[];
  industry_specific_recommendations?: string[];
  suggested_certifications?: string[];
  suggested_projects?: string[];
  suggested_keywords?: string[];
  interview_readiness?: string;
  career_growth_suggestions?: string[];
}

// Comprehensive multi-domain skill dictionary with boundary-safe patterns
const COMPREHENSIVE_SKILLS: { label: string; regex: RegExp; fields: string[] }[] = [
  // Software & Web Development
  { label: "JavaScript", regex: /\bjavascript\b|\bjs\b/i, fields: ["Software Development", "Web Development"] },
  { label: "TypeScript", regex: /\btypescript\b|\bts\b/i, fields: ["Software Development", "Web Development"] },
  { label: "React", regex: /\breact(\.js)?\b/i, fields: ["Software Development", "Web Development"] },
  { label: "Next.js", regex: /\bnext(\.js)?\b/i, fields: ["Software Development", "Web Development"] },
  { label: "Node.js", regex: /\bnode(\.js)?\b/i, fields: ["Software Development", "Web Development"] },
  { label: "Express.js", regex: /\bexpress(\.js)?\b/i, fields: ["Software Development", "Web Development"] },
  { label: "Vue.js", regex: /\bvue(\.js)?\b/i, fields: ["Software Development", "Web Development"] },
  { label: "Angular", regex: /\bangular(\.js)?\b/i, fields: ["Software Development", "Web Development"] },
  { label: "HTML5", regex: /\bhtml5?\b/i, fields: ["Software Development", "Web Development"] },
  { label: "CSS3", regex: /\bcss3?\b/i, fields: ["Software Development", "Web Development"] },
  { label: "Tailwind CSS", regex: /\btailwind(css)?\b/i, fields: ["Software Development", "Web Development"] },
  { label: "Bootstrap", regex: /\bbootstrap\b/i, fields: ["Software Development", "Web Development"] },
  { label: "REST APIs", regex: /\brest(ful)?\s*(api|service)s?\b/i, fields: ["Software Development", "Web Development"] },
  { label: "GraphQL", regex: /\bgraphql\b/i, fields: ["Software Development", "Web Development"] },
  { label: "Redux", regex: /\bredux\b/i, fields: ["Software Development", "Web Development"] },
  { label: "Python", regex: /\bpython3?\b/i, fields: ["Software Development", "Data Science"] },
  { label: "Java", regex: /\bjava\b(?!script)/i, fields: ["Software Development", "Android Development"] },
  { label: "C++", regex: /\bc\+\+\b/i, fields: ["Software Development"] },
  { label: "C#", regex: /\bc#\b|\bc\s*sharp\b/i, fields: ["Software Development"] },
  { label: ".NET", regex: /\b\.net\b|\bdotnet\b/i, fields: ["Software Development"] },
  { label: "Spring Boot", regex: /\bspring(\s*boot)?\b/i, fields: ["Software Development"] },
  { label: "Django", regex: /\bdjango\b/i, fields: ["Software Development", "Web Development"] },
  { label: "Flask", regex: /\bflask\b/i, fields: ["Software Development", "Web Development"] },
  { label: "FastAPI", regex: /\bfastapi\b/i, fields: ["Software Development", "Data Science"] },
  { label: "Go (Golang)", regex: /\bgolang\b|\bgo\s+lang\b/i, fields: ["Software Development"] },
  { label: "Rust", regex: /\brust\b/i, fields: ["Software Development"] },
  { label: "PHP", regex: /\bphp\b/i, fields: ["Software Development", "Web Development"] },
  { label: "Laravel", regex: /\blaravel\b/i, fields: ["Software Development", "Web Development"] },
  { label: "Ruby on Rails", regex: /\bruby(\s+on\s+rails)?\b|\brails\b/i, fields: ["Software Development", "Web Development"] },

  // Databases & Cloud / DevOps
  { label: "SQL", regex: /\bsql\b/i, fields: ["Software Development", "Data Science", "Business Analyst", "Finance & Accounting"] },
  { label: "PostgreSQL", regex: /\bpostgres(ql)?\b/i, fields: ["Software Development", "Data Science"] },
  { label: "MySQL", regex: /\bmysql\b/i, fields: ["Software Development", "Web Development"] },
  { label: "MongoDB", regex: /\bmongo(db)?\b/i, fields: ["Software Development", "Web Development"] },
  { label: "Redis", regex: /\bredis\b/i, fields: ["Software Development"] },
  { label: "Docker", regex: /\bdocker\b/i, fields: ["Software Development", "Data Science"] },
  { label: "Kubernetes", regex: /\bkubernetes\b|\bk8s\b/i, fields: ["Software Development"] },
  { label: "AWS", regex: /\baws\b|\bamazon\s+web\s+services\b/i, fields: ["Software Development", "Data Science"] },
  { label: "Azure", regex: /\bazure\b/i, fields: ["Software Development", "Data Science"] },
  { label: "Google Cloud (GCP)", regex: /\bgcp\b|\bgoogle\s+cloud\b/i, fields: ["Software Development", "Data Science"] },
  { label: "CI/CD Pipelines", regex: /\bci[\/-]cd\b|\bgithub\s*actions\b|\bjenkins\b/i, fields: ["Software Development"] },
  { label: "Git & Version Control", regex: /\bgit\b|\bgithub\b|\bgitlab\b/i, fields: ["Software Development", "Data Science"] },
  { label: "Linux / Unix", regex: /\blinux\b|\bunix\b|\bbash\b/i, fields: ["Software Development"] },

  // Data Science, AI & Machine Learning
  { label: "Machine Learning", regex: /\bmachine\s*learning\b|\bml\b/i, fields: ["Data Science", "Software Development"] },
  { label: "Deep Learning", regex: /\bdeep\s*learning\b/i, fields: ["Data Science"] },
  { label: "Pandas", regex: /\bpandas\b/i, fields: ["Data Science", "Business Analyst"] },
  { label: "NumPy", regex: /\bnumpy\b/i, fields: ["Data Science"] },
  { label: "Scikit-Learn", regex: /\bscikit[-_]?learn\b|\bsklearn\b/i, fields: ["Data Science"] },
  { label: "TensorFlow", regex: /\btensorflow\b|\btf\b/i, fields: ["Data Science"] },
  { label: "PyTorch", regex: /\bpytorch\b/i, fields: ["Data Science"] },
  { label: "Data Visualization", regex: /\bdata\s*visualization\b|\bmatplotlib\b|\bseaborn\b/i, fields: ["Data Science", "Business Analyst"] },
  { label: "NLP", regex: /\bnlp\b|\bnatural\s+language\s+processing\b/i, fields: ["Data Science"] },
  { label: "Computer Vision", regex: /\bcomputer\s+vision\b|\bopencv\b/i, fields: ["Data Science"] },
  { label: "Generative AI", regex: /\bgenerative\s+ai\b|\bgenai\b|\bllm\b|\blarge\s+language\s+models?\b/i, fields: ["Data Science", "Software Development"] },
  { label: "Statistical Modeling", regex: /\bstatistics\b|\bstatistical\s+modeling\b|\bhypothesis\s+testing\b/i, fields: ["Data Science", "Business Analyst"] },
  { label: "R Programming", regex: /\br\s+programming\b|\br\s+studio\b/i, fields: ["Data Science"] },

  // Mobile Development
  { label: "Flutter", regex: /\bflutter\b/i, fields: ["Software Development", "Android Development", "iOS Development"] },
  { label: "React Native", regex: /\breact\s+native\b/i, fields: ["Software Development", "Android Development", "iOS Development"] },
  { label: "Kotlin", regex: /\bkotlin\b/i, fields: ["Android Development", "Software Development"] },
  { label: "Android SDK", regex: /\bandroid(\s+studio|\s+sdk)?\b/i, fields: ["Android Development"] },
  { label: "Jetpack Compose", regex: /\bjetpack\s+compose\b/i, fields: ["Android Development"] },
  { label: "Swift", regex: /\bswift\b/i, fields: ["iOS Development", "Software Development"] },
  { label: "SwiftUI", regex: /\bswiftui\b/i, fields: ["iOS Development"] },
  { label: "Xcode", regex: /\bxcode\b/i, fields: ["iOS Development"] },

  // UI/UX Design
  { label: "Figma", regex: /\bfigma\b/i, fields: ["UI/UX Design", "Software Development"] },
  { label: "UI Prototyping", regex: /\bwirefram(es|ing)\b|\bprototyp(es|ing)\b/i, fields: ["UI/UX Design"] },
  { label: "User Research", regex: /\buser\s+research\b|\busability\s+testing\b/i, fields: ["UI/UX Design"] },
  { label: "Design Systems", regex: /\bdesign\s+systems?\b/i, fields: ["UI/UX Design"] },
  { label: "Adobe XD", regex: /\badobe\s+xd\b|\bphotoshop\b|\billustrator\b/i, fields: ["UI/UX Design"] },
  { label: "Information Architecture", regex: /\binformation\s+architecture\b/i, fields: ["UI/UX Design"] },

  // Business Analyst & Project Management
  { label: "Requirements Gathering", regex: /\brequirements?\s+(gathering|analysis|documentation)\b|\bbrd\b|\bfrd\b/i, fields: ["Business Analyst", "Project Management"] },
  { label: "Tableau", regex: /\btableau\b/i, fields: ["Business Analyst", "Data Science", "Finance & Accounting"] },
  { label: "Power BI", regex: /\bpower\s*bi\b/i, fields: ["Business Analyst", "Finance & Accounting", "Data Science"] },
  { label: "Agile & Scrum", regex: /\bagile\b|\bscrum\b|\bsprint\s+planning\b/i, fields: ["Project Management", "Business Analyst", "Software Development"] },
  { label: "Jira / Confluence", regex: /\bjira\b|\bconfluence\b|\btrello\b|\basana\b/i, fields: ["Project Management", "Business Analyst"] },
  { label: "Risk Management", regex: /\brisk\s+management\b|\brisk\s+mitigation\b/i, fields: ["Project Management", "Finance & Accounting"] },
  { label: "Stakeholder Management", regex: /\bstakeholder\s+(management|engagement|communication)\b/i, fields: ["Project Management", "Business Analyst"] },
  { label: "Process Modeling (BPMN)", regex: /\bbpmn\b|\bprocess\s+(mapping|optimization|flow)\b/i, fields: ["Business Analyst"] },

  // Digital Marketing & Sales
  { label: "Search Engine Optimization (SEO)", regex: /\bseo\b|\bsearch\s+engine\s+optimization\b/i, fields: ["Digital Marketing"] },
  { label: "SEM / Google Ads", regex: /\bgoogle\s+ads\b|\bsem\b|\bppc\b|\bsearch\s+engine\s+marketing\b/i, fields: ["Digital Marketing"] },
  { label: "Content Marketing", regex: /\bcontent\s+(marketing|strategy|creation)\b|\bcopywriting\b/i, fields: ["Digital Marketing"] },
  { label: "Social Media Strategy", regex: /\bsocial\s+media(\s+marketing)?\b|\bmeta\s+ads\b|\blinkedin\s+ads\b/i, fields: ["Digital Marketing"] },
  { label: "Email Marketing & Automation", regex: /\bemail\s+marketing\b|\bmailchimp\b|\bhubspot\b|\bkindsight\b/i, fields: ["Digital Marketing"] },
  { label: "Google Analytics / GA4", regex: /\bgoogle\s+analytics\b|\bga4\b/i, fields: ["Digital Marketing", "Business Analyst"] },
  { label: "CRM & Salesforce", regex: /\bsalesforce\b|\bcrm\b|\bhubspot\s+crm\b|\bpipedrive\b/i, fields: ["Sales", "Customer Service", "Digital Marketing"] },
  { label: "B2B Lead Generation", regex: /\blead\s+generation\b|\bprospecting\b|\bcold\s+(calling|outreach)\b/i, fields: ["Sales"] },
  { label: "Pipeline & Deal Closing", regex: /\bpipeline\s+management\b|\bcontract\s+negotiation\b|\bdeal\s+closing\b/i, fields: ["Sales"] },

  // Finance & Accounting
  { label: "Financial Modeling", regex: /\bfinancial\s+model(ing)?\b|\bdcf\b|\bvaluation\b/i, fields: ["Finance & Accounting"] },
  { label: "Advanced Excel", regex: /\bexcel\b|\bvlookup\b|\bxlookup\b|\bpivot\s+tables?\b|\bmacros\b/i, fields: ["Finance & Accounting", "Business Analyst", "Human Resources"] },
  { label: "QuickBooks & ERP", regex: /\bquickbooks\b|\bsap\b|\boracle\s+financials\b|\bxero\b/i, fields: ["Finance & Accounting"] },
  { label: "Financial Reporting (GAAP/IFRS)", regex: /\bgaap\b|\bifrs\b|\bfinancial\s+statements?\b|\bbalance\s+sheet\b/i, fields: ["Finance & Accounting"] },
  { label: "Auditing & Tax Compliance", regex: /\baudit(ing)?\b|\btax(ation)?\b|\bcompliance\b/i, fields: ["Finance & Accounting"] },
  { label: "Budgeting & Forecasting", regex: /\bbudget(ing)?\b|\bforecasting\b|\bvariance\s+analysis\b/i, fields: ["Finance & Accounting", "Project Management"] },

  // Human Resources & Customer Service
  { label: "Talent Acquisition & Recruiting", regex: /\btalent\s+acquisition\b|\brecruit(ing|ment)\b|\bsourcing\b|\bapplicant\s+tracking\b/i, fields: ["Human Resources"] },
  { label: "Employee Relations & Onboarding", regex: /\bemployee\s+relations\b|\bonboarding\b|\bperformance\s+management\b/i, fields: ["Human Resources"] },
  { label: "HRIS & Payroll Management", regex: /\bhris\b|\bworkday\b|\badp\b|\bbamboohr\b|\bpayroll\b/i, fields: ["Human Resources"] },
  { label: "Customer Support & Ticketing", regex: /\bzendesk\b|\bfreshdesk\b|\bticketing\b|\bcustomer\s+service\b/i, fields: ["Customer Service"] },
  { label: "Conflict Resolution & Escalation", regex: /\bconflict\s+resolution\b|\bescalation\s+management\b|\bde-escalation\b/i, fields: ["Customer Service", "Human Resources"] },
  { label: "Customer Success & Retention (CSAT/NPS)", regex: /\bcsat\b|\bnps\b|\bcustomer\s+retention\b|\bchurn\s+reduction\b/i, fields: ["Customer Service", "Sales"] }
];

// Target Field Benchmarks & Custom Recommendations
const FIELD_BENCHMARKS: {
  [key: string]: {
    defaultSkills: string[];
    recommendedSkills: string[];
    courses: CourseItem[];
    certifications: string[];
    projects: string[];
    keywords: string[];
  };
} = {
  "Software Development": {
    defaultSkills: ["JavaScript", "TypeScript", "React", "Node.js", "Git & Version Control", "REST APIs"],
    recommendedSkills: ["Docker", "Kubernetes", "PostgreSQL", "AWS", "CI/CD Pipelines", "System Architecture", "GraphQL", "Microservices"],
    courses: [
      { title: "Meta: Full-Stack Engineer Professional Certificate (Coursera)", link: "https://www.coursera.org/professional-certificates/meta-full-stack-engineer" },
      { title: "Frontend Masters: Complete Full-Stack Web Development Path", link: "https://frontendmasters.com/" },
      { title: "Udemy: Master Modern Software Architecture & System Design", link: "https://www.udemy.com/" }
    ],
    certifications: ["AWS Certified Solutions Architect Associate", "Certified Kubernetes Application Developer (CKAD)", "Meta Certified Full Stack Developer"],
    projects: ["Full-Stack Distributed Application with Docker and CI/CD", "Real-Time Collaboration Platform with WebSocket microservices"],
    keywords: ["TypeScript", "React", "Node.js", "System Design", "Cloud Infrastructure", "CI/CD", "RESTful APIs", "Microservices"]
  },
  "Data Science": {
    defaultSkills: ["Python", "SQL", "Pandas", "NumPy", "Data Visualization", "Statistical Modeling"],
    recommendedSkills: ["PyTorch", "TensorFlow", "Scikit-Learn", "Generative AI", "FastAPI", "Docker", "Model Deployment", "MLOps"],
    courses: [
      { title: "DeepLearning.AI: Machine Learning Specialization (Coursera)", link: "https://www.coursera.org/specializations/machine-learning-introduction" },
      { title: "IBM Data Science Professional Certificate (Coursera)", link: "https://www.coursera.org/professional-certificates/ibm-data-science" },
      { title: "Kaggle: Advanced Machine Learning & Feature Engineering Series", link: "https://www.kaggle.com/learn" }
    ],
    certifications: ["TensorFlow Developer Certificate", "AWS Certified Machine Learning Specialty", "Google Cloud Professional Data Engineer"],
    projects: ["End-to-End Predictive Analytics Pipeline with Automated MLOps", "Generative AI LLM-Powered Semantic Search & Retrieval System"],
    keywords: ["Machine Learning", "Python", "Deep Learning", "PyTorch", "Data Modeling", "Feature Engineering", "SQL", "Model Deployment"]
  },
  "Business Analyst": {
    defaultSkills: ["Requirements Gathering", "SQL", "Advanced Excel", "Tableau", "Agile & Scrum", "Process Modeling (BPMN)"],
    recommendedSkills: ["Power BI", "Data Visualization", "Jira / Confluence", "Stakeholder Management", "Python for Analytics", "Financial Modeling"],
    courses: [
      { title: "Google: Data Analytics Professional Certificate (Coursera)", link: "https://www.coursera.org/professional-certificates/google-data-analytics" },
      { title: "IIBA: Certified Business Analysis Professional (CBAP) Training", link: "https://www.iiba.org/" },
      { title: "Udemy: Business Analysis Fundamentals & Agile Story Mapping", link: "https://www.udemy.com/" }
    ],
    certifications: ["Certified Business Analysis Professional (CBAP)", "PMI Professional in Business Analysis (PMI-PBA)", "Microsoft Certified: Power BI Data Analyst Associate"],
    projects: ["Enterprise Business Process Optimization & Gap Analysis Report", "Executive KPI Dashboard in Power BI with Automated Data Pipelines"],
    keywords: ["Requirements Gathering", "BRD/FRD", "Power BI", "SQL", "Stakeholder Alignment", "BPMN", "Agile", "User Stories"]
  },
  "Digital Marketing": {
    defaultSkills: ["Search Engine Optimization (SEO)", "SEM / Google Ads", "Content Marketing", "Social Media Strategy", "Google Analytics / GA4"],
    recommendedSkills: ["Email Marketing & Automation", "CRM & Salesforce", "A/B Testing", "Conversion Rate Optimization (CRO)", "Copywriting", "HubSpot"],
    courses: [
      { title: "Google: Digital Marketing & E-commerce Professional Certificate", link: "https://www.coursera.org/professional-certificates/google-digital-marketing-ecommerce" },
      { title: "HubSpot Academy: Inbound Marketing & Content Strategy Certification", link: "https://academy.hubspot.com/" },
      { title: "Meta: Certified Digital Marketing Associate Program", link: "https://www.facebook.com/business/learn/certification" }
    ],
    certifications: ["Google Ads Search & Measurement Certification", "HubSpot Inbound Marketing Certified", "Meta Certified Digital Marketing Associate"],
    projects: ["Omnichannel Multi-Tier Growth Campaign with 40%+ ROI Increase", "Comprehensive Technical SEO Audit & Conversion Optimization Overhaul"],
    keywords: ["SEO", "Google Ads", "GA4", "ROAS", "Content Strategy", "Email Automation", "Conversion Optimization", "Lead Generation"]
  },
  "Human Resources": {
    defaultSkills: ["Talent Acquisition & Recruiting", "Employee Relations & Onboarding", "HRIS & Payroll Management", "Advanced Excel"],
    recommendedSkills: ["Conflict Resolution & Escalation", "Labor Law & Compliance", "Performance Management", "Diversity & Inclusion (DEI)", "Compensation & Benefits"],
    courses: [
      { title: "University of Minnesota: Human Resource Management Specialization", link: "https://www.coursera.org/specializations/human-resource-management" },
      { title: "SHRM: Certified Professional (SHRM-CP) Exam Prep Masterclass", link: "https://www.shrm.org/" },
      { title: "HRCI: Associate Professional in Human Resources (aPHR) Training", link: "https://www.hrci.org/" }
    ],
    certifications: ["SHRM Certified Professional (SHRM-CP)", "Professional in Human Resources (PHR - HRCI)", "Talent Management Practitioner Certification"],
    projects: ["End-to-End Talent Acquisition Pipeline Reducing Time-to-Hire by 30%", "Enterprise Employee Onboarding & Retention Framework Implementation"],
    keywords: ["Talent Acquisition", "Employee Relations", "HRIS", "Performance Management", "Compliance", "Onboarding", "Retention", "DEI"]
  },
  "Finance & Accounting": {
    defaultSkills: ["Financial Modeling", "Advanced Excel", "Financial Reporting (GAAP/IFRS)", "Budgeting & Forecasting", "SQL"],
    recommendedSkills: ["QuickBooks & ERP", "Auditing & Tax Compliance", "Power BI", "Valuation Analysis", "Risk Management", "Variance Analysis"],
    courses: [
      { title: "Wharton: Business and Financial Modeling Specialization (Coursera)", link: "https://www.coursera.org/specializations/wharton-business-financial-modeling" },
      { title: "CFI: Financial Modeling & Valuation Analyst (FMVA) Certification", link: "https://corporatefinanceinstitute.com/" },
      { title: "Udemy: Complete Financial Analyst and Accounting Masterclass", link: "https://www.udemy.com/" }
    ],
    certifications: ["Financial Modeling & Valuation Analyst (FMVA)", "Certified Public Accountant (CPA / ACCA)", "Chartered Financial Analyst (CFA Level 1)"],
    projects: ["Multi-Year DCF Financial Valuation Model with Scenario Sensitivity Analysis", "Corporate Budget Forecasting & Automated Expense Variance Dashboard"],
    keywords: ["Financial Modeling", "GAAP", "Forecasting", "Variance Analysis", "Advanced Excel", "Auditing", "Cash Flow", "ERP Systems"]
  },
  "Project Management": {
    defaultSkills: ["Agile & Scrum", "Jira / Confluence", "Stakeholder Management", "Risk Management", "Requirements Gathering"],
    recommendedSkills: ["Budgeting & Forecasting", "Sprint Planning", "Resource Allocation", "Change Management", "Kanban", "Cross-Functional Leadership"],
    courses: [
      { title: "Google: Project Management Professional Certificate (Coursera)", link: "https://www.coursera.org/professional-certificates/google-project-management" },
      { title: "PMI: Project Management Professional (PMP) Exam Prep", link: "https://www.pmi.org/certifications/project-management-pmp" },
      { title: "Scrum Alliance: Certified ScrumMaster (CSM) Training", link: "https://www.scrumalliance.org/" }
    ],
    certifications: ["Project Management Professional (PMP)", "Certified ScrumMaster (CSM)", "PMI Agile Certified Practitioner (PMI-ACP)"],
    projects: ["Agile Transformation & Sprint Workflow Migration for 20+ Engineers", "Cross-Functional Multi-Milestone Enterprise Product Delivery Plan"],
    keywords: ["Agile", "Scrum Master", "Jira", "Risk Mitigation", "Sprint Planning", "Resource Management", "Stakeholder Delivery", "PMP"]
  },
  "UI/UX Design": {
    defaultSkills: ["Figma", "UI Prototyping", "User Research", "Design Systems", "Adobe XD"],
    recommendedSkills: ["Information Architecture", "Usability Testing", "HTML5", "CSS3", "Design Sprint", "Accessibility (WCAG)"],
    courses: [
      { title: "Google: UX Design Professional Certificate (Coursera)", link: "https://www.coursera.org/professional-certificates/google-ux-design" },
      { title: "Interaction Design Foundation: UX & UI Design Master Tracks", link: "https://www.interaction-design.org/" },
      { title: "Figma Academy: Advanced Design Systems & Variables Masterclass", link: "https://www.figma.com/resources/" }
    ],
    certifications: ["Google UX Design Professional Certificate", "Nielsen Norman Group UX Master Certified", "Interaction Design Foundation (IxDF) Specialist"],
    projects: ["Comprehensive Mobile & Web Design System with 100+ Reusable Components", "End-to-End E-Commerce User Journey Redesign with 25%+ Usability Lift"],
    keywords: ["Figma", "UI/UX", "User Research", "Wireframing", "Design Systems", "Prototyping", "WCAG Accessibility", "Information Architecture"]
  },
  "Sales": {
    defaultSkills: ["CRM & Salesforce", "B2B Lead Generation", "Pipeline & Deal Closing", "Advanced Excel"],
    recommendedSkills: ["Account Management", "Cold Calling & Email Outreach", "Contract Negotiation", "Quota Attainment", "HubSpot CRM", "Solution Selling"],
    courses: [
      { title: "Northwestern University: High-Impact Business Writing & Sales Pitching", link: "https://www.coursera.org/specializations/business-writing" },
      { title: "HubSpot Academy: Inbound Sales & Enterprise Deal Closing Certification", link: "https://academy.hubspot.com/" },
      { title: "Salesforce: Sales Development Representative Professional Certificate", link: "https://www.coursera.org/professional-certificates/salesforce-sales-development-representative" }
    ],
    certifications: ["Salesforce Certified Sales Representative", "HubSpot Inbound Sales Certified", "Certified Professional Sales Person (CPSP)"],
    projects: ["Outbound B2B Multi-Touch Prospecting Campaign Driving $500k+ Pipeline", "Sales Pipeline Stage Optimization & CRM Automation Overhaul"],
    keywords: ["B2B Sales", "Salesforce", "Lead Generation", "Pipeline Management", "Quota Attainment", "Account Management", "Contract Negotiation"]
  },
  "Customer Service": {
    defaultSkills: ["Customer Support & Ticketing", "Conflict Resolution & Escalation", "Customer Success & Retention (CSAT/NPS)", "CRM & Salesforce"],
    recommendedSkills: ["Zendesk Administrator", "Active Listening", "De-escalation Techniques", "Knowledge Base Management", "SLA Compliance", "Interpersonal Communication"],
    courses: [
      { title: "CVS Health / Coursera: Customer Service Excellence & Communication Skills", link: "https://www.coursera.org/learn/customer-service" },
      { title: "Zendesk Training: Omnichannel Support Masterclass", link: "https://training.zendesk.com/" },
      { title: "Udemy: Customer Success Management & Churn Prevention", link: "https://www.udemy.com/" }
    ],
    certifications: ["Zendesk Certified Support Specialist", "Certified Customer Experience Professional (CCXP)", "Customer Service Institute of America (CSIA) Certified"],
    projects: ["Customer Support SLA Optimization Improving Resolution Time by 40%", "Omnichannel Self-Service Knowledge Base Reducing Ticket Volume by 25%"],
    keywords: ["Customer Service", "Zendesk", "CSAT", "Conflict Resolution", "Ticketing", "Customer Retention", "Escalations", "SLA Management"]
  }
};

export function localHeuristicAnalysis(
  rawText: string,
  fileName: string,
  actName: string,
  actMail: string,
  actMob: string,
  selectedTargetField?: string
): ParsedResumeResult {
  const text = (rawText || "").toLowerCase();

  // 1. Dynamic Contact & Name Extraction
  let finalEmail = actMail;
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  const emailMatches = rawText ? rawText.match(emailRegex) : null;
  if (emailMatches && emailMatches.length > 0) {
    finalEmail = emailMatches[0].trim();
  }

  let finalPhone = actMob;
  const phoneRegex = /(\+?\d{1,4}[-.\s]??)?\(?\d{3}\)?[-.\s]??\d{3}[-.\s]??\d{4}/g;
  const phoneMatches = rawText ? rawText.match(phoneRegex) : null;
  if (phoneMatches && phoneMatches.length > 0) {
    finalPhone = phoneMatches[0].trim();
  }

  let finalName = actName && actName !== "Candidate" && actName !== "Applicant Candidate" ? actName : "";
  if (!finalName && rawText && rawText.length > 20) {
    const lines = rawText.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    for (const candidateLine of lines.slice(0, 5)) {
      if (
        candidateLine.length >= 3 &&
        candidateLine.length <= 40 &&
        !/email|phone|tel|mobile|resume|curriculum|vitae|github|linkedin|http|www|page|\.com|\.pdf|summary|objective|skills|experience/i.test(candidateLine) &&
        /^[a-zA-Z\s.'-]+$/.test(candidateLine)
      ) {
        finalName = candidateLine;
        break;
      }
    }
  }
  if (!finalName) finalName = actName || "Professional Candidate";

  // 2. Section Checks & Document Factor Analysis
  const hasObj = /objective|summary|profile|about me|professional summary|executive summary|career profile/.test(text);
  const hasEdu = /education|college|degree|university|academic|bachelor|master|phd|diploma|gpa|b\.s|b\.a|b\.tech|m\.s|m\.tech|mba/.test(text);
  const hasExp = /experience|work|job|employment|history|position|responsibilities|professional experience|career history/.test(text);
  const hasInt = /intern|internship|trainee|apprentice|fellowship/.test(text);
  const hasSkl = /skills|technologies|languages|tools|competencies|expertise|proficiencies|technical stack/.test(text);
  const hasHob = /hobbies|hobby|recreation|extracurricular|volunteer|volunteering/.test(text);
  const hasInterests = /interests|interest|passion|personal projects/.test(text);
  const hasAch = /achievements|awards|prize|recognition|honors|dean's list|promoted|exceeded|ranked|valedictorian/.test(text) ||
                 /\b\d{1,3}%\b|\$\d+|\b\d+\+\s*(users|clients|projects|million|k)\b/i.test(text);
  const hasCert = /certifications|certified|certificates|courses|licenses|accreditation/.test(text);
  const hasPrj = /projects|personal projects|academic projects|capstone|portfolio|github\.com/.test(text);

  // 3. Multi-Domain Skill Extraction
  const detectedSkillSet = new Set<string>();
  const fieldMatches: { [key: string]: number } = {
    "Software Development": 0,
    "Data Science": 0,
    "Business Analyst": 0,
    "Digital Marketing": 0,
    "Human Resources": 0,
    "Finance & Accounting": 0,
    "Project Management": 0,
    "UI/UX Design": 0,
    "Sales": 0,
    "Customer Service": 0
  };

  for (const item of COMPREHENSIVE_SKILLS) {
    if (item.regex.test(text)) {
      detectedSkillSet.add(item.label);
      for (const f of item.fields) {
        if (fieldMatches[f] !== undefined) {
          fieldMatches[f] += 1;
        }
      }
    }
  }

  // 4. Field Prediction & Alignment
  let bestField = selectedTargetField && selectedTargetField !== "Other" ? selectedTargetField : "";
  if (!bestField) {
    let highestCount = -1;
    for (const [f, count] of Object.entries(fieldMatches)) {
      if (count > highestCount) {
        highestCount = count;
        bestField = f;
      }
    }
    if (highestCount === 0 || !bestField) {
      bestField = "Software Development";
    }
  }

  const benchmark = FIELD_BENCHMARKS[bestField] || FIELD_BENCHMARKS["Software Development"];

  // Populate skills fallback from benchmark if completely empty
  const detectedSkills = Array.from(detectedSkillSet);
  if (detectedSkills.length === 0) {
    detectedSkills.push(...benchmark.defaultSkills.slice(0, 5));
  }

  // 5. Experience Level Detection
  let candLevel: 'Fresher' | 'Intermediate' | 'Experienced' = 'Fresher';
  const yearsMatch = text.match(/(\d+)\+?\s*(years?|yrs?)\s*(of)?\s*(experience|exp)?/i);
  let detectedYears = 0;
  if (yearsMatch) {
    detectedYears = parseInt(yearsMatch[1], 10) || 0;
  }
  const dateRanges = text.match(/20\d{2}\s*[-–to]+\s*(20\d{2}|present|current)/gi);
  if (dateRanges && dateRanges.length > 0) {
    detectedYears = Math.max(detectedYears, dateRanges.length * 2);
  }

  if (detectedYears >= 5 || hasExp && /lead|senior|principal|manager|head|director|architect/i.test(text)) {
    candLevel = 'Experienced';
  } else if (detectedYears >= 2 || hasExp && dateRanges && dateRanges.length >= 2) {
    candLevel = 'Intermediate';
  } else {
    candLevel = 'Fresher';
  }

  // 6. Comprehensive Accurate Degree & Education Extraction
  let degreeGuess = extractDegreeFromText(rawText);

  // 7. Transparent 10-Factor Scoring Matrix (0-100)
  let rawScore = 0;
  if (hasObj) rawScore += 8;
  if (hasEdu) rawScore += 12;
  if (hasExp) rawScore += 18;
  if (hasInt) rawScore += 6;
  if (hasSkl) rawScore += 10;
  if (hasHob) rawScore += 4;
  if (hasInterests) rawScore += 4;
  if (hasAch) rawScore += 14;
  if (hasCert) rawScore += 10;
  if (hasPrj) rawScore += 14;

  const skillMatchCount = detectedSkills.filter(s => benchmark.recommendedSkills.includes(s) || benchmark.defaultSkills.includes(s)).length;
  const keywordBonus = Math.min(skillMatchCount * 3, 15);
  const finalResumeScore = Math.min(Math.max(rawScore + (skillMatchCount >= 3 ? 5 : 0), 45), 98);
  const atsCompatibilityScore = Math.min(Math.max(finalResumeScore + keywordBonus - (hasExp ? 0 : 5), 50), 96);

  // Missing Skills tailored to target field
  const missingSkills = benchmark.recommendedSkills.filter(s => !detectedSkillSet.has(s)).slice(0, 6);

  // Feedback Items
  const feedback: FeedbackItem[] = [
    {
      factor: "Executive Summary / Objective",
      status: hasObj ? "added" : "missing",
      detail: hasObj
        ? "Professional summary is present and clearly articulates your core value proposition."
        : "Add a 2-3 line executive summary at the top to highlight your primary domain expertise."
    },
    {
      factor: "Education Credentials",
      status: hasEdu ? "added" : "missing",
      detail: hasEdu
        ? `Academic qualifications (${degreeGuess}) are clearly listed with institution details.`
        : "List your degree, major, university name, and graduation year."
    },
    {
      factor: "Professional Work Experience",
      status: hasExp ? "added" : "missing",
      detail: hasExp
        ? "Work history is structured with chronological responsibilities and role designations."
        : "Add commercial work history or relevant contract positions with quantifiable bullet points."
    },
    {
      factor: "Internship & Practical Experience",
      status: hasInt || hasExp ? "added" : "missing",
      detail: hasInt || hasExp
        ? "Practical hands-on industry experience is documented."
        : "Highlight relevant internships, student associations, or apprenticeship programs."
    },
    {
      factor: "Domain Skills Matrix",
      status: hasSkl ? "added" : "missing",
      detail: hasSkl
        ? `Detected ${detectedSkills.length} relevant skill keywords matching industry taxonomy.`
        : "Structure your skills into categorized groupings (e.g. Core Skills, Tools, Methodologies)."
    },
    {
      factor: "Quantified Metrics & Achievements",
      status: hasAch ? "added" : "missing",
      detail: hasAch
        ? "Strong presence of metric-driven achievements (percentages, revenues, scale metrics)."
        : "Use the Google XYZ Formula: 'Accomplished [X], as measured by [Y], by doing [Z]' in bullet points."
    },
    {
      factor: "Professional Certifications",
      status: hasCert ? "added" : "missing",
      detail: hasCert
        ? "Verified industry certifications listed to reinforce credibility."
        : `Consider earning recognized accreditations in ${bestField} to stand out to recruiters.`
    },
    {
      factor: "Key Projects & Portfolio",
      status: hasPrj ? "added" : "missing",
      detail: hasPrj
        ? "Demonstrated practical application through documented projects and deliverables."
        : "Add 2-3 high-impact project showcases with architecture context and live repository links."
    }
  ];

  return {
    name: finalName,
    email: finalEmail,
    phone: finalPhone,
    degree: degreeGuess,
    no_of_pages: text.length < 2500 ? 1 : 2,
    cand_level: candLevel,
    predicted_field: bestField,
    current_skills: detectedSkills.slice(0, 14),
    recommended_skills: benchmark.recommendedSkills,
    resume_score: finalResumeScore,
    ats_compatibility_score: atsCompatibilityScore,
    missing_skills: missingSkills,
    experience_relevance: hasExp
      ? `Demonstrated experience directly aligns with ${bestField} industry standards. Adding specific business metrics will optimize recruiter conversion.`
      : `Early career profile. Emphasize capstone initiatives, certifications, and technical deliverables in ${bestField} to pass automated screening.`,
    education_relevance: hasEdu
      ? `Academic background (${degreeGuess}) supports your qualification trajectory for ${bestField} roles.`
      : `Ensure relevant degree coursework, honors, or professional accreditations are highlighted.`,
    strengths: [
      hasSkl ? `Strong representation of key competencies (${detectedSkills.slice(0, 3).join(", ")})` : "Foundational knowledge and career interest",
      hasExp ? "Documented professional employment trajectory" : "Demonstrated project development aptitude",
      hasAch ? "Includes quantifiable achievements and impact metrics" : "Structured chronological presentation",
      "Clean, readable typography parseable by automated ATS software"
    ],
    weaknesses: [
      !hasAch ? "Missing quantifiable percentage/dollar impact metrics in bullet points" : "",
      !hasCert ? `No active ${bestField} professional certifications listed` : "",
      missingSkills.length > 0 ? `Missing several high-demand keyword tags: ${missingSkills.slice(0, 3).join(", ")}` : ""
    ].filter(Boolean),
    industry_specific_recommendations: [
      `Incorporate target keywords from ${bestField} job descriptions in the top third of your resume`,
      `Structure bullet points using strong action verbs (Engineered, Accelerated, Optimized, Spearheaded)`,
      `Ensure full alignment between your resume keywords and your public LinkedIn profile`
    ],
    suggested_certifications: benchmark.certifications,
    suggested_projects: benchmark.projects,
    suggested_keywords: benchmark.keywords,
    interview_readiness: finalResumeScore >= 75
      ? "High — Strong profile readiness for technical and behavioral screening rounds. Focus on deep-dive architectural and STAR stories."
      : "Moderate — Polish accomplishment metrics, bridge missing skill gaps, and practice STAR-format scenario questions.",
    career_growth_suggestions: [
      `Target high-growth ${bestField} positions while expanding specialized domain breadth`,
      "Build visible public deliverables (GitHub, case studies, or published articles) to establish authority",
      "Network directly with engineering and hiring managers on LinkedIn using tailored outreach notes"
    ],
    score_factors: {
      has_objective: hasObj,
      has_education: hasEdu,
      has_experience: hasExp,
      has_internship: hasInt,
      has_skills: hasSkl,
      has_hobbies: hasHob,
      has_interests: hasInterests,
      has_achievements: hasAch,
      has_certifications: hasCert,
      has_projects: hasPrj
    },
    feedback,
    recommended_courses: benchmark.courses
  };
}

/**
 * Intelligent parser to extract candidate's actual Degree, Major, Institution, and Graduation Year
 */
export function extractDegreeFromText(rawText: string): string {
  if (!rawText || rawText.trim().length === 0) {
    return "Bachelor's Degree";
  }

  const lines = rawText.split("\n").map(l => l.trim()).filter(l => l.length > 0);

  // 1. Degree match regexes for full title extraction
  const degreePatterns = [
    // Bachelor variations
    /(?:bachelor(?:'s)?(?:\s+of|\s+in)?|b\.?s\.?c?|b\.?tech|b\.?e|bba|bca|b\.?a|bcom|b\.?sc\s*csit|b\.?eng)\s*(?:in|of|-|–|:|,)?\s*([a-zA-Z\s&/,'-]+(?:\(\w+\))?)/i,
    // Master variations
    /(?:master(?:'s)?(?:\s+of|\s+in)?|m\.?s\.?c?|m\.?tech|m\.?e|mba|mca|m\.?a|mcom|m\.?eng)\s*(?:in|of|-|–|:|,)?\s*([a-zA-Z\s&/,'-]+(?:\(\w+\))?)/i,
    // Ph.D. / Doctorate variations
    /(?:ph\.?d\.?|doctor(?:ate)?(?:\s+of|\s+in)?)\s*(?:in|of|-|–|:|,)?\s*([a-zA-Z\s&/,'-]+)/i,
    // Associate & Diploma
    /(?:associate(?:'s)?(?:\s+of|\s+in)?|diploma(?:\s+in)?)\s*(?:in|of|-|–|:|,)?\s*([a-zA-Z\s&/,'-]+)/i,
    // High school / +2
    /(?:\+2|plus\s*two|high\s*school|higher\s*secondary|a\s*levels?|ib\s*diploma)\s*(?:in|of|-|–|:|,)?\s*([a-zA-Z\s&/,'-]+)?/i
  ];

  // Look for education block in the resume
  let inEducationSection = false;
  const educationLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isSectionHeader = /^(education|academic|qualifications|educational background|academic credentials|academics|degrees?)/i.test(line);
    const isNextSection = /^(experience|work experience|employment|projects|skills|technical skills|certifications|awards|summary|objective|interests|languages)/i.test(line);

    if (isSectionHeader) {
      inEducationSection = true;
      continue;
    } else if (inEducationSection && isNextSection) {
      inEducationSection = false;
      break;
    }

    if (inEducationSection) {
      educationLines.push(line);
    }
  }

  // Scan education section first, or full text if section wasn't delimited
  const linesToScan = educationLines.length > 0 ? educationLines : lines;

  for (const line of linesToScan) {
    // Ignore pure section headers
    if (/^(education|academics|qualifications|degrees?|educational background)$/i.test(line)) continue;

    for (const pattern of degreePatterns) {
      const match = line.match(pattern);
      if (match) {
        let cleanDegree = line.replace(/^[•\-\*–\d\.\s]+/, "").trim();
        // Clean out excessive noise
        if (cleanDegree.length > 90) {
          cleanDegree = cleanDegree.slice(0, 85).trim() + "...";
        }
        if (cleanDegree.length >= 4) {
          return cleanDegree;
        }
      }
    }
  }

  // Look for university / college mentions
  for (const line of linesToScan) {
    if (/(university|college|institute|campus|academy|school of)\b/i.test(line)) {
      const cleanLine = line.replace(/^[•\-\*–\d\.\s]+/, "").trim();
      if (cleanLine.length >= 6 && cleanLine.length <= 90) {
        return cleanLine;
      }
    }
  }

  // Fallback to coarse classification
  const lowerAll = rawText.toLowerCase();
  if (/ph\.?d|doctorate/i.test(lowerAll)) {
    return "Ph.D. / Doctorate";
  } else if (/mba\b/i.test(lowerAll)) {
    return "Master of Business Administration (MBA)";
  } else if (/m\.?s|master|m\.tech|m\.a|msc/i.test(lowerAll)) {
    return "Master's Degree (M.S. / M.Sc.)";
  } else if (/bba\b/i.test(lowerAll)) {
    return "Bachelor of Business Administration (BBA)";
  } else if (/bca\b/i.test(lowerAll)) {
    return "Bachelor of Computer Applications (BCA)";
  } else if (/b\.?sc\s*csit/i.test(lowerAll)) {
    return "B.Sc. in CSIT / Computer Science";
  } else if (/b\.?tech|b\.?e\b/i.test(lowerAll)) {
    return "Bachelor of Technology / Engineering (B.Tech / B.E.)";
  } else if (/bachelor|b\.s|b\.a|bsc/i.test(lowerAll)) {
    return "Bachelor's Degree";
  } else if (/associate|diploma/i.test(lowerAll)) {
    return "Associate Degree / Diploma";
  } else if (/\+2|plus two|high school/i.test(lowerAll)) {
    return "Higher Secondary (+2 / High School)";
  }

  return "Bachelor's Degree";
}
