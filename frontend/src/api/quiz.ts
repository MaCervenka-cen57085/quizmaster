import { fetchJson, postJson, putJson } from './helpers.ts'
import type { Quiz } from '../model/quiz.ts'
import type { QuizCreateRequest } from 'model/quiz-question.ts'

export const fetchQuiz = async (quizId: string) => await fetchJson<Quiz>(`/api/quiz/${quizId}`)

export const putQuiz = async (quiz: Quiz, id: string) => await putJson<Quiz, string>(`/api/quiz/${id}`, quiz)

export const postQuiz = async (quiz: QuizCreateRequest) => await postJson<QuizCreateRequest, string>('/api/quiz', quiz)
