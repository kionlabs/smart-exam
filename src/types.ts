export interface QuestionResult {
  number: string;
  content: string;
  studentAnswer: string;
  correctAnswer: string;
  status: 'correct' | 'incorrect';
  explanation: string;
  pageNumber?: number; // The page number this question resides on
}

export interface PageSummary {
  pageNumber: number;
  title: string;
  correctCount: number;
  incorrectCount: number;
  summary: string;
}

export interface AnalysisResponse {
  subject: string;
  title: string;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  score: number;
  overallSummary: string;
  strengths: string[];
  weaknesses: string[];
  studyPlan: string[];
  questions: QuestionResult[];
  pageSummaries?: PageSummary[]; // Page-by-page diagnostic summaries
}
