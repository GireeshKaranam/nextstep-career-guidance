export type StreamId = 'pcm' | 'pcb' | 'commerce_math' | 'commerce' | 'arts' | 'vocational';

export interface QuizOption {
  id: string;
  text: string;
  textHi: string;
  scores: Partial<Record<StreamId, number>>;
}

export interface QuizQuestion {
  id: string;
  pillar: 'academic' | 'work_style' | 'scenario';
  question: string;
  questionHi: string;
  options: QuizOption[];
}

export interface StreamInfo {
  id: StreamId;
  name: string;
  nameHi: string;
  tagline: string;
  taglineHi: string;
  color: string;
  emoji: string;
  careers: string[];
  careersHi: string[];
  subjects: string[];
}

export interface Course {
  id: string;
  name: string;
  nameHi: string;
  stream: StreamId | 'any';
  duration: string;
  feesAnnual: number;
  startingSalary: number;
  growthSalary: number;
  entranceExams: string[];
  institutions: string[];
  institutionType: 'govt' | 'private' | 'deemed';
  states: string[];
  switchable: boolean;
  switchNotes?: string;
  emoji: string;
}

export interface PassionTrack {
  id: string;
  title: string;
  titleHi: string;
  emoji: string;
  tagline: string;
  taglineHi: string;
  formats: { name: string; nameHi: string; desc: string; descHi: string }[];
  skills: string[];
  certifications: string[];
  income: { stage: string; stageHi: string; range: string }[];
  roleModels: string[];
  realityCheck: string;
  realityCheckHi: string;
  rampUp: string;
}

export interface Scholarship {
  id: string;
  name: string;
  nameHi: string;
  provider: string;
  amount: string;
  deadline: string;
  states: string[];
  categories: string[];
  incomeLimit: string;
  courseLevel: string[];
  gender: 'all' | 'girls';
  pwd: boolean;
  url: string;
  documents: string[];
  emoji: string;
}

export interface CareerStage {
  stage: string;
  stageHi: string;
  detail: string;
  detailHi: string;
}

export interface CareerAlternate {
  route: string;
  routeHi: string;
  steps: string[];
}

export interface CareerRoadmap {
  id: string;
  title: string;
  titleHi: string;
  emoji: string;
  stream: StreamId | 'any';
  stages: CareerStage[];
  alternates: CareerAlternate[];
  salaryStart: string;
  salaryMid: string;
  salaryPeak: string;
}

export interface MentorReview {
  id: string;
  careerId: string;
  name: string;
  role: string;
  roleHi: string;
  yearsExperience: number;
  wishIKnew: string;
  wishIKnewHi: string;
  dayInLife: string;
  dayInLifeHi: string;
  pros: string[];
  cons: string[];
  topAdvice: string;
  topAdviceHi: string;
  approved: boolean;
  rating: number;
}

export interface ParentMyth {
  id: string;
  myth: string;
  mythHi: string;
  reality: string;
  realityHi: string;
  data: string;
  dataHi: string;
}

export interface ParentCourseNote {
  courseId: string;
  jobSecurity: number;
  recognition: string;
  recognitionHi: string;
  safetyNote: string;
  safetyNoteHi: string;
}

export type Language = 'en' | 'hi';

export type ViewId =
  | 'home'
  | 'stream'
  | 'courses'
  | 'passion'
  | 'calculator'
  | 'scholarships'
  | 'careers'
  | 'mentors'
  | 'parent'
  | 'profile';

export interface SavedItem {
  id: string;
  type: 'course' | 'scholarship' | 'career' | 'passion' | 'stream';
  title: string;
  subtitle: string;
  savedAt: number;
}

export interface QuizResult {
  date: number;
  scores: Record<StreamId, number>;
  topStream: StreamId;
}
