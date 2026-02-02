export enum QuestionType {
  QCM = "QCM",
  VRAI_FAUX = "VRAI_FAUX",
}

export enum QuizStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

export interface Option {
  _id?: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  _id?: string;
  text: string;
  type: QuestionType;
  options: Option[];
}

export interface Quiz {
  _id: string;
  moduleId: {
    _id: string;
    title: string;
  };
  title: string;
  passingScore: number;
  timeLimit: number;
  shuffleQuestions: boolean;
  showResultsImmediately: boolean;
  status: QuizStatus;
  questions: Question[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateQuizDto {
  moduleId: string;
  title: string;
  passingScore: number;
  timeLimit?: number;
  shuffleQuestions?: boolean;
  showResultsImmediately?: boolean;
}

export interface CreateQuestionDto {
  text: string;
  type: QuestionType;
  options: Omit<Option, "_id">[];
}

export interface UpdateQuestionDto {
  text?: string;
  type?: QuestionType;
  options?: Omit<Option, "_id">[];
}
