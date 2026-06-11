from typing import List, TypedDict, Literal, Optional

class ScoreFactors(TypedDict):
    has_objective: bool
    has_education: bool
    has_experience: bool
    has_internship: bool
    has_skills: bool
    has_hobbies: bool
    has_interests: bool
    has_achievements: bool
    has_certifications: bool
    has_projects: bool


class FeedbackDetail(TypedDict):
    factor: str
    status: Literal['added', 'missing']
    detail: str


class CourseRecommendation(TypedDict):
    title: str
    link: str


class AnalysisData(TypedDict):
    name: str
    email: str
    phone: str
    degree: str
    no_of_pages: int
    cand_level: Literal['Fresher', 'Intermediate', 'Experienced']
    predicted_field: str
    current_skills: List[str]
    recommended_skills: List[str]
    resume_score: int
    score_factors: ScoreFactors
    feedback: List[FeedbackDetail]
    recommended_courses: List[CourseRecommendation]


class ApiAnalyzeResponse(TypedDict):
    success: bool
    data: AnalysisData
    record: any


class UserDbRecord(TypedDict):
    id: int
    sec_token: str
    ip_add: str
    host_name: str
    dev_user: str
    os_name_ver: str
    latlong: str
    city: str
    state: str
    country: str
    act_name: str
    act_mail: str
    act_mob: str
    name: str
    email: str
    resume_score: str
    timestamp: str
    page_no: str
    reco_field: str
    cand_level: str
    skills: str  # JSON string
    recommended_skills: str  # JSON string
    courses: str  # JSON string
    pdf_name: str
    owner_email: Optional[str]


class FeedbackDbRecord(TypedDict):
    id: int
    feed_name: str
    feed_email: str
    feed_score: str
    comments: str
    timestamp: str
