export interface ScoreFactors {
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

export interface FeedbackDetail {
  factor: string;
  status: 'added' | 'missing';
  detail: string;
}

export interface CourseRecommendation {
  title: string;
  link: string;
}

export interface AnalysisData {
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
  feedback: FeedbackDetail[];
  recommended_courses: CourseRecommendation[];
}

export interface ApiAnalyzeResponse {
  success: boolean;
  data: AnalysisData;
  record: any;
}

export interface UserDbRecord {
  id: number;
  sec_token: string;
  ip_add: string;
  host_name: string;
  dev_user: string;
  os_name_ver: string;
  latlong: string;
  city: string;
  state: string;
  country: string;
  act_name: string;
  act_mail: string;
  act_mob: string;
  name: string;
  email: string;
  resume_score: string;
  timestamp: string;
  page_no: string;
  reco_field: string;
  cand_level: string;
  skills: string; // JSON string encoded
  recommended_skills: string; // JSON string encoded
  courses: string; // JSON string encoded
  pdf_name: string;
  owner_email?: string;
}

export interface FeedbackDbRecord {
  id: number;
  feed_name: string;
  feed_email: string;
  feed_score: string;
  comments: string;
  timestamp: string;
}
