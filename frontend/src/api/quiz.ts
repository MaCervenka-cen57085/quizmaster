import { fetchJson, postJson, putJson } from './helpers.ts'
import type { Quiz, QuizCreateRequest } from '../model/quiz-question.ts'
import type { QuizListResponse } from '../model/quiz-list-response.ts'

export const getQuiz = async (quizId: string) => await fetchJson<Quiz>(`/api/quiz/${quizId}`)

export const putQuiz = async (quiz: Quiz, id: string) => await putJson<Quiz, string>(`/api/quiz/${id}`, quiz)

export const postQuiz = async (quiz: QuizCreateRequest) => await postJson<QuizCreateRequest, string>('/api/quiz', quiz)

export const getQuizList = async () => await fetchJson<QuizListResponse>('/api/quiz/list')
