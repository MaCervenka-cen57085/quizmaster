import { fetchJson, postJson, putJson } from './helpers.ts'
import type { Quiz } from 'model/quiz.ts'

export interface QuizCreateRequest {
    readonly title: string
    readonly description: string
    readonly questionIds: readonly number[]
    readonly afterEach: boolean
    readonly passScore: number
    readonly timeLimit: number
}

export const fetchQuiz = async (quizId: string) => await fetchJson<Quiz>(`/api/quiz/${quizId}`)

export const putQuiz = async (quiz: Quiz, id: string) => await putJson<Quiz, string>(`/api/quiz/${id}`, quiz)

export const postQuiz = async (quiz: QuizCreateRequest) => await postJson<QuizCreateRequest, string>('/api/quiz', quiz)
