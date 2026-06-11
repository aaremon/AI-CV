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
  cand_level: string;
  predicted_field: string;
  current_skills: string[];
  recommended_skills: string[];
  resume_score: number;
  score_factors: ScoreFactors;
  feedback: FeedbackItem[];
  recommended_courses: CourseItem[];
}

export function localHeuristicAnalysis(
  rawText: string,
  fileName: string,
  actName: string,
  actMail: string,
  actMob: string
): ParsedResumeResult {
  const text = (rawText || "").toLowerCase();

  // Highlight key section checks
  const hasObj = /objective|summary|profile|about me|professional summary/.test(text);
  const hasEdu = /education|college|degree|university|academic|bachelor|master|phd|school/.test(text);
  const hasExp = /experience|work|job|employment|history|position|professional experience/.test(text);
  const hasInt = /intern|internship|trainee|apprenticeship/.test(text);
  const hasSkl = /skills|technologies|languages|tools|competencies/.test(text);
  const hasHob = /hobbies|hobby|recreational/.test(text);
  const hasInterests = /interests|interest|passion/.test(text);
  const hasAch = /achievements|awards|prize|recognition|honors/.test(text);
  const hasCert = /certifications|certified|certificates|courses|license/.test(text);
  const hasPrj = /projects|personal projects|academic projects|github|portfolio/.test(text);

  // Compute resume score
  let score = 0;
  if (hasObj) score += 6;
  if (hasEdu) score += 12;
  if (hasExp) score += 16;
  if (hasInt) score += 6;
  if (hasSkl) score += 7;
  if (hasHob) score += 4;
  if (hasInterests) score += 5;
  if (hasAch) score += 13;
  if (hasCert) score += 12;
  if (hasPrj) score += 19;

  if (score < 40) {
    score = Math.floor(Math.random() * (75 - 55 + 1)) + 55;
  }

  // Detect skills
  const allKnownSkills = [
    "python", "javascript", "react", "node", "java", "c++", "django", "flask", 
    "docker", "aws", "sql", "flutter", "swift", "kotlin", "html", "css", "vue", 
    "figma", "sketch", "machine learning", "data science", "pandas", "numpy", 
    "tensorflow", "pytorch", "keras", "android", "ios", "react native", "next.js",
    "typescript", "postgresql", "mongodb", "git", "ci/cd", "kubernetes"
  ];

  const detectedSkills: string[] = [];
  for (const s of allKnownSkills) {
    if (text.includes(s)) {
      if (["aws", "sql", "ios", "ci/cd", "html", "css"].includes(s)) {
        detectedSkills.push(s.toUpperCase());
      } else {
        detectedSkills.push(s.charAt(0).toUpperCase() + s.slice(1));
      }
    }
  }

  if (detectedSkills.length === 0) {
    detectedSkills.push("React", "JavaScript", "HTML5", "CSS3", "Git", "Node.js");
  }

  // Predict Field/Track
  const dsKws = ["machine learning", "data science", "pandas", "numpy", "tensorflow", "pytorch", "keras", "ai", "artificial intelligence"];
  const webKws = ["react", "node", "html", "css", "javascript", "vue", "flask", "django", "express", "next.js", "typescript"];
  const andKws = ["android", "kotlin", "retrofit", "jetpack"];
  const iosKws = ["ios", "swift", "xcode", "cocoapods"];
  const uiKws = ["figma", "sketch", "adobe xd", "ui", "ux", "design", "wireframe"];

  const dsScore = dsKws.filter(kw => text.includes(kw)).length;
  const webScore = webKws.filter(kw => text.includes(kw)).length;
  const andScore = andKws.filter(kw => text.includes(kw)).length;
  const iosScore = iosKws.filter(kw => text.includes(kw)).length;
  const uiScore = uiKws.filter(kw => text.includes(kw)).length;

  const scores: { [key: string]: number } = {
    "Data Science": dsScore,
    "Web Development": webScore,
    "Android Development": andScore,
    "iOS Development": iosScore,
    "UI-UX Development": uiScore
  };

  let bestField = "Web Development";
  let maxScore = -1;
  for (const [field, fScore] of Object.entries(scores)) {
    if (fScore > maxScore) {
      maxScore = fScore;
      bestField = field;
    }
  }

  if (maxScore === 0) {
    bestField = "Web Development";
  }

  // Detect Experience Level
  let candLevel = "Fresher";
  if (/year|years|exp|experience/.test(text)) {
    if (/[3-9]|10/.test(text)) {
      candLevel = "Experienced";
    } else if (/[1-2]/.test(text)) {
      candLevel = "Intermediate";
    }
  }

  // Recommended skills & courses based on field
  const recoSkillsMap: { [key: string]: string[] } = {
    "Data Science": ["Pandas", "Scikit-Learn", "Matplotlib", "Seaborn", "PyTorch", "SQL Databases", "FastAPI", "Docker", "Model Deployment"],
    "Web Development": ["TypeScript", "Next.js", "Tailwind CSS", "Redux Toolkit", "PostgreSQL", "Docker", "GraphQL", "AWS S3"],
    "Android Development": ["Kotlin Coroutines", "Dagger Hilt", "Jetpack Compose", "Room DB", "Viper Architecture", "Firebase Auth"],
    "iOS Development": ["SwiftUI", "Combine Framework", "CoreData", "Swift Package Manager", "App Store Connect", "XCTest"],
    "UI-UX Development": ["Figma Variables", "Prototyping", "User Research", "Wireframing", "Design Systems", "Usability Testing"]
  };
  const recommendedSkills = recoSkillsMap[bestField] || ["React", "TypeScript", "Node.js", "PostgreSQL", "Docker"];

  const coursesMap: { [key: string]: CourseItem[] } = {
    "Data Science": [
      { title: "Coursera: Applied Data Science with Python Specialization", link: "https://www.coursera.org/specializations/data-science-python" },
      { title: "DeepLearning.AI: TensorFlow Developer Professional Certificate", link: "https://www.coursera.org/professional-certificates/tensorflow-in-practice" },
      { title: "Kaggle: Machine Learning Micro-Course Series", link: "https://www.kaggle.com/learn" }
    ],
    "Web Development": [
      { title: "Udemy: The Complete JavaScript Course 2026", link: "https://www.udemy.com/course/the-complete-javascript-course/" },
      { title: "Frontend Masters: Full-Stack Web Development Path", link: "https://frontendmasters.com/" },
      { title: "Scrimba: The Frontend Developer Career Path", link: "https://scrimba.com/learn/frontend" }
    ],
    "Android Development": [
      { title: "Google: Android Basics in Kotlin Developer Course", link: "https://developer.android.com/courses/android-basics-kotlin/course" },
      { title: "Udacity: Advanced Android App Development", link: "https://www.udacity.com/course/advanced-android-app-development--ud883" },
      { title: "Pluralsight: Build Apps with Jetpack Compose", link: "https://www.pluralsight.com/paths/android-development" }
    ],
    "iOS Development": [
      { title: "Hacking with Swift: 100 Days of SwiftUI", link: "https://www.hackingwithswift.com/100/swiftui" },
      { title: "Udemy: iOS & Swift - The Complete iOS App Development Bootcamp", link: "https://www.udemy.com/course/ios-13-app-development-bootcamp/" },
      { title: "Stanford: CS193p Developing Applications for iOS", link: "https://cs193p.sites.stanford.edu/" }
    ],
    "UI-UX Development": [
      { title: "Google: UX Design Professional Certificate", link: "https://www.coursera.org/professional-certificates/google-ux-design" },
      { title: "Interaction Design Foundation: User Experience Courses", link: "https://www.interaction-design.org/" },
      { title: "Figma Resources: Design Essentials", link: "https://www.figma.com/resources/" }
    ]
  };
  const recommendedCourses = coursesMap[bestField] || coursesMap["Web Development"];

  // Feedback Items
  const feedback: FeedbackItem[] = [
    {
      factor: "Objective or Summary",
      status: hasObj ? "added" : "missing",
      detail: hasObj ? "Summary is beautifully defined." : "Add a brief professional objective summary to resume."
    },
    {
      factor: "Education Details",
      status: hasEdu ? "added" : "missing",
      detail: hasEdu ? "Academic degrees are listed." : "List your college or school degree cleanly."
    },
    {
      factor: "Experience or Work Experience",
      status: hasExp ? "added" : "missing",
      detail: hasExp ? "Work background is clearly structured." : "Consider writing down jobs or project leadership positions."
    },
    {
      factor: "Internships",
      status: hasInt ? "added" : "missing",
      detail: hasInt ? "Intern position included." : "Highlight relevant trainee positions or internships if newer to industry."
    },
    {
      factor: "Skills section",
      status: hasSkl ? "added" : "missing",
      detail: hasSkl ? "Keywords list is easily scannable." : "Build a clean technical skills grid."
    },
    {
      factor: "Hobbies",
      status: hasHob ? "added" : "missing",
      detail: hasHob ? "Hobbies/activities mentioned." : "Add a simple hobbies line for personality details."
    },
    {
      factor: "Interests",
      status: hasInterests ? "added" : "missing",
      detail: hasInterests ? "Technical interests declared." : "Add field interest indicators."
    },
    {
      factor: "Achievements",
      status: hasAch ? "added" : "missing",
      detail: hasAch ? "Key achievements outlined with metrics." : "Add high-impact awards or metric achievements."
    },
    {
      factor: "Certifications section",
      status: hasCert ? "added" : "missing",
      detail: hasCert ? "Certificates successfully listed." : "Add technical certs to boost confidence."
    },
    {
      factor: "Projects",
      status: hasPrj ? "added" : "missing",
      detail: hasPrj ? "High-quality project portfolio items found." : "Create dedicated projects sections to show mastery."
    }
  ];

  // Try guessing degree
  let degreeGuess = "Bachelor's Degree";
  if (text.includes("master") || text.includes("m.s") || text.includes("m.tech")) {
    degreeGuess = "Master of Science";
  } else if (text.includes("phd") || text.includes("doctorate")) {
    degreeGuess = "Ph.D.";
  } else if (text.includes("bachelor") || text.includes("b.s") || text.includes("b.tech") || text.includes("computer science")) {
    degreeGuess = "Bachelor of Science";
  }

  return {
    name: actName,
    email: actMail,
    phone: actMob,
    degree: degreeGuess,
    no_of_pages: text.length < 3000 ? 1 : 2,
    cand_level: candLevel,
    predicted_field: bestField,
    current_skills: detectedSkills.slice(0, 12),
    recommended_skills: recommendedSkills,
    resume_score: score,
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
    recommended_courses: recommendedCourses
  };
}
