import type { QuizQuestion } from 'model/quiz-question.ts'
import { fetchJson, postJson, patchJson, deleteJson } from './helpers.ts'

export const fetchQuestion = async (questionId: string) =>
    await fetchJson<QuizQuestion>(`/api/quiz-question/${questionId}`)

export const fetchQuestionByEditId = async (editId: string) =>
    await fetchJson<QuizQuestion>(`/api/quiz-question/${editId}/edit`)

export type QuestionApiData = Omit<QuizQuestion, 'id'>

export interface QuestionCreateResponse {
    readonly id: number
    readonly editId: string
}

export const saveQuestion = async (question: QuestionApiData) =>
    await postJson<QuestionApiData, QuestionCreateResponse>('/api/quiz-question', question)

export const updateQuestion = async (question: QuestionApiData, editId: string) =>
    await patchJson<QuestionApiData, number>(`/api/quiz-question/${editId}`, question)

export const deleteQuestion = async (questionId: number) => await deleteJson(`/api/quiz-question/${questionId}`)
