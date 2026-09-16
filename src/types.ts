export type TopicType = "Percentage" | "Ratio & Proportion" | "Profit & Loss" | "DSA";

export type OptionKey = "A" | "B" | "C" | "D";

export interface QuestionOptions {
  A: string;
  B: string;
  C: string;
  D: string;
}

export interface Question {
  id: string;
  topic: TopicType;
  question: string;
  options: QuestionOptions;
  correctAnswer: OptionKey;
  explanation: string;
  memoryTrick: string;
}

export interface UserAnswerRecord {
  questionId: string;
  selectedAnswer: OptionKey;
  isCorrect: boolean;
  timestamp: number;
}

export interface TopicProgress {
  topic: TopicType;
  answers: Record<string, UserAnswerRecord>;
  lastActiveIndex: number;
  bookmarkedIds: string[];
  shuffledOrder?: string[];
}

export interface GlobalStats {
  totalAttempted: number;
  totalCorrect: number;
  overallAccuracy: number;
}

export type QuizMode = "all" | "wrong-only";
