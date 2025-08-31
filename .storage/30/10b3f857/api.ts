import { Quiz, Question, UploadedFile, UserProgress, QuizAttempt } from '@/types';

// Mock data for development
const mockQuestions: Question[] = [
  {
    id: '1',
    type: 'multiple-choice',
    question: 'What is the primary function of mitochondria in cells?',
    options: [
      'Protein synthesis',
      'Energy production',
      'DNA storage',
      'Waste removal'
    ],
    correctAnswer: 1,
    explanation: 'Mitochondria are known as the powerhouse of the cell, responsible for producing ATP through cellular respiration.'
  },
  {
    id: '2',
    type: 'true-false',
    question: 'Photosynthesis occurs only in the leaves of plants.',
    correctAnswer: 0,
    explanation: 'Photosynthesis can occur in any green part of the plant that contains chlorophyll, including stems and green fruits.'
  },
  {
    id: '3',
    type: 'multiple-choice',
    question: 'Which of the following is NOT a renewable energy source?',
    options: [
      'Solar power',
      'Wind power',
      'Coal',
      'Hydroelectric power'
    ],
    correctAnswer: 2,
    explanation: 'Coal is a fossil fuel and is considered non-renewable because it takes millions of years to form.'
  }
];

export const apiService = {
  // File upload simulation
  uploadFile: async (file: File): Promise<UploadedFile> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const uploadedFile: UploadedFile = {
          id: Date.now().toString(),
          name: file.name,
          size: file.size,
          uploadedAt: new Date().toISOString(),
          extractedText: `This is mock extracted text from ${file.name}. In a real implementation, this would contain the actual text extracted from the PDF using libraries like PyPDF2 or pdfplumber.`,
          status: 'completed'
        };
        
        // Store in localStorage
        const files = JSON.parse(localStorage.getItem('uploaded_files') || '[]');
        files.push(uploadedFile);
        localStorage.setItem('uploaded_files', JSON.stringify(files));
        
        resolve(uploadedFile);
      }, 2000);
    });
  },

  // AI quiz generation simulation
  generateQuiz: async (fileId: string, questionCount: number = 5): Promise<Quiz> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const quiz: Quiz = {
          id: Date.now().toString(),
          title: `Quiz from uploaded document`,
          questions: mockQuestions.slice(0, questionCount),
          createdAt: new Date().toISOString(),
          sourceFile: fileId,
          totalQuestions: questionCount
        };

        // Store in localStorage
        const quizzes = JSON.parse(localStorage.getItem('generated_quizzes') || '[]');
        quizzes.push(quiz);
        localStorage.setItem('generated_quizzes', JSON.stringify(quizzes));

        resolve(quiz);
      }, 3000);
    });
  },

  // Get user's quizzes
  getUserQuizzes: (): Quiz[] => {
    return JSON.parse(localStorage.getItem('generated_quizzes') || '[]');
  },

  // Get user's uploaded files
  getUserFiles: (): UploadedFile[] => {
    return JSON.parse(localStorage.getItem('uploaded_files') || '[]');
  },

  // Submit quiz attempt
  submitQuizAttempt: (quizId: string, answers: Record<string, string | number>): number => {
    const quizzes = JSON.parse(localStorage.getItem('generated_quizzes') || '[]');
    const quiz = quizzes.find((q: Quiz) => q.id === quizId);
    
    if (!quiz) return 0;

    let correctAnswers = 0;
    quiz.questions.forEach((question: Question) => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    
    // Store attempt
    const attempts = JSON.parse(localStorage.getItem('quiz_attempts') || '[]');
    const attempt: QuizAttempt = {
      id: Date.now().toString(),
      userId: '1', // Mock user ID
      quizId,
      answers,
      score,
      totalQuestions: quiz.questions.length,
      completedAt: new Date().toISOString(),
      timeSpent: 0
    };
    attempts.push(attempt);
    localStorage.setItem('quiz_attempts', JSON.stringify(attempts));

    return score;
  },

  // Get user progress
  getUserProgress: (): UserProgress => {
    const attempts = JSON.parse(localStorage.getItem('quiz_attempts') || '[]');
    const quizzes = JSON.parse(localStorage.getItem('generated_quizzes') || '[]');

    if (attempts.length === 0) {
      return {
        totalQuizzes: quizzes.length,
        completedQuizzes: 0,
        averageScore: 0,
        totalTimeSpent: 0,
        strengths: [],
        weaknesses: []
      };
    }

    const totalScore = attempts.reduce((sum: number, attempt: QuizAttempt) => sum + attempt.score, 0);
    const averageScore = Math.round(totalScore / attempts.length);

    return {
      totalQuizzes: quizzes.length,
      completedQuizzes: attempts.length,
      averageScore,
      totalTimeSpent: 0,
      strengths: averageScore >= 80 ? ['Critical Thinking', 'Problem Solving'] : [],
      weaknesses: averageScore < 60 ? ['Concept Understanding', 'Application'] : []
    };
  }
};