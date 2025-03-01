export type Domain = 'Technical' | 'Design' | 'Editorial' | 'Management';

export interface User {
  uid: string;
  email: string;
  selectedDomains: Domain[];
  quizzesAttempted: Record<Domain, boolean>;
}

export interface Question {
  id: string;
  text: string;
  domain: Domain;
}

export interface QuizResponse {
  userId: string;
  domain: Domain;
  responses: Record<string, string>; // questionId: answer
  timestamp: number;
}

export interface DomainQuestions {
  [key: string]: Question[];
} 