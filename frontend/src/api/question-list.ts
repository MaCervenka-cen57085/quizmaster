import { postJson, fetchJson } from './helpers.ts'
import type { QuestionList } from 'model/question-list.ts'
import type { QuizQuestion } from 'model/quiz-question.ts'
import type { Quiz } from 'model/quiz.ts'

export type QuestionListCreateRequest = {
    readonly title: string
}

export interface QuestionListCreateResponse {
    readonly guid: string
}

export const postQuestionList = async (questionListApiData: QuestionListCreateRequest) =>
    await postJson<QuestionListCreateRequest, QuestionListCreateResponse>('/api/q-list', questionListApiData)

export const fetchQuestionList = async (guid: string) => await fetchJson<QuestionList>(`/api/q-list/${guid}`)

export const fetchListQuestions = async (guid: string) =>
    await fetchJson<readonly QuizQuestion[]>(`/api/quiz-question/by-question-list/${guid}`)

export const fetchListQuizzes = async (guid: string) =>
    await fetchJson<readonly Quiz[]>(`/api/quiz/by-question-list/${guid}`)
