import { fetchJson, postJson, putJson } from './helpers.ts'
import type { Quiz, QuizCreateFromQuestionListRequest, QuizCreateRequest } from '../model/quiz-question.ts'

export const getQuiz = async (quizId: string) => await fetchJson<Quiz>(`/api/quiz/${quizId}`)

export const putQuiz = async (quiz: Quiz, id: string) => await putJson<Quiz, string>(`/api/quiz/${id}`, quiz)

export const postQuiz = async (quiz: QuizCreateRequest) => await postJson<QuizCreateRequest, string>('/api/quiz', quiz)

export const postQuizWithQuestionList = async (quiz: QuizCreateFromQuestionListRequest) =>
    await postJson<QuizCreateFromQuestionListRequest, string>('/api/quiz-with-list', quiz)
