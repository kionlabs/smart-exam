export interface QuestionResult {
  number: string;
  content: string;
  studentAnswer: string;
  correctAnswer: string;
  status: 'correct' | 'incorrect';
  explanation: string;
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
}
