import type { QuizLinkRequest, QuizQuestion } from 'model/quiz-question.ts'
import type { QuestionCreateResponse } from 'model/question-create-response.ts'
import { fetchJson, postJson, patchJson } from './helpers.ts'

export const getQuestion = async (questionId: string) =>
    await fetchJson<QuizQuestion>(`/api/quiz-question/${questionId}`)

export const getQuestionByHash = async (hash: string) =>
    await fetchJson<QuizQuestion>(`/api/quiz-question/${hash}/edit`)

export type QuestionApiData = Omit<QuizQuestion, 'id'>

export const saveQuestion = async (question: QuestionApiData) =>
    await postJson<QuestionApiData, QuestionCreateResponse>('/api/quiz-question', question)

export const updateQuestion = async (question: QuestionApiData, hash: string) =>
    await patchJson<QuestionApiData, number>(`/api/quiz-question/${hash}`, question)

export const linkQuestionToList = async (questionId: number, listGuid: string) =>
    await patchJson<QuizLinkRequest, boolean>(`/api/quiz-question/link-to-list/${questionId}`, { listGuid: listGuid })
