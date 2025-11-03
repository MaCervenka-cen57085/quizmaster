import { postJson, fetchJson } from './helpers.ts'
import type { Workspace } from 'model/workspace.ts'
import type { QuestionListItem } from 'model/question-list-item.ts'
import type { QuizListItem } from 'model/quiz-list-item.ts'

export type WorkspaceCreateRequest = {
    readonly title: string
}

export interface WorkspaceCreateResponse {
    readonly guid: string
}

export const postWorkspace = async (workspaceApiData: WorkspaceCreateRequest) =>
    await postJson<WorkspaceCreateRequest, WorkspaceCreateResponse>('/api/workspace', workspaceApiData)

export const fetchWorkspace = async (guid: string) => await fetchJson<Workspace>(`/api/workspace/${guid}`)

export const fetchWorkspaceQuestions = async (guid: string) =>
    await fetchJson<readonly QuestionListItem[]>(`/api/quiz-question/by-workspace/${guid}`)

export const fetchWorkspaceQuizzes = async (guid: string) =>
    await fetchJson<readonly QuizListItem[]>(`/api/quiz/by-workspace/${guid}`)
