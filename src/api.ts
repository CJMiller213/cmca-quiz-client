import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export interface Question {
  _id: string;
  subject: string;
  text: string;
  choices: string[];
  answerIndex: number;
  explanation?: string;
}

export function fetchQuestions(subject?: string) {
  return api.get<Question[]>('/questions', {
    params: subject ? { subject } : {},
  });
}

export function createQuestion(data: Omit<Question, '_id'>) {
  return api.post<Question>('/questions', data);
}

// add updateQuestion, deleteQuestion, bulkInsert as needed...
