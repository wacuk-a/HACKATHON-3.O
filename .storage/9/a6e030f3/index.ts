export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher';
  isPremium: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  createdAt: string;
  sourceFile: string;
  totalQuestions: number;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  answers: Record<string, string | number>;
  score: number;
  totalQuestions: number;
  completedAt: string;
  timeSpent: number;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
  extractedText: string;
  status: 'processing' | 'completed' | 'failed';
}

export interface UserProgress {
  totalQuizzes: number;
  completedQuizzes: number;
  averageScore: number;
  totalTimeSpent: number;
  strengths: string[];
  weaknesses: string[];
}