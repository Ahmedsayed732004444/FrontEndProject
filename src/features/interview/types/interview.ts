export interface InterviewOption {
  id: number;
  optionText: string;
}

export interface InterviewQuestion {
  id: number;
  question: string;
  options: InterviewOption[];
}

export interface InterviewAnswer {
  questionId: number;
  selectedOptionId: number;
}

export interface SubmitInterviewRequest {
  answers: InterviewAnswer[];
}

export interface InterviewResultDetail {
  questionId: number;
  question: string;
  yourAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface InterviewResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  details: InterviewResultDetail[];
}
