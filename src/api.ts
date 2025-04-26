// src/api.ts
import axios from 'axios';

export interface Question {
  _id: string;
  subject: string;
  text: string;
  choices: string[];
  answerIndex: number;
  explanation?: string;
}

// In development, Vite will proxy “/questions” → http://localhost:3000.
// In production, it will use the URL you set in .env (e.g. https://www.amgwebapps.com).
const baseURL = import.meta.env.DEV
  ? ''                                    // dev: relative URLs → Vite proxy
  : import.meta.env.VITE_API_BASE_URL;    // prod: full URL from .env

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// ——— read all ———
export function fetchQuestions(subject?: string) {
  return api.get<Question[]>('/questions', {
    params: subject ? { subject } : {},
  });
}

// ——— read one ———
export function fetchQuestion(id: string) {
  return api.get<Question>(`/questions/${id}`);
}

// ——— create one ———
export function createQuestion(data: Omit<Question, '_id'>) {
  return api.post<Question>('/questions', data);
}

// ——— update one ———
export function updateQuestion(
  id: string,
  data: Partial<Omit<Question, '_id'>>
) {
  return api.put<Question>(`/questions/${id}`, data);
}

// ——— delete one ———
export function deleteQuestion(id: string) {
  return api.delete<void>(`/questions/${id}`);
}

// ——— bulk insert ———
export function bulkInsertQuestions(items: Omit<Question, '_id'>[]) {
  return api.post<Question[]>('/questions/bulk', items);
}