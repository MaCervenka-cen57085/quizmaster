import type { QuizQuestion } from 'model/quiz-question'

export interface WorkspaceData {
    readonly title: string
    readonly questions: readonly QuizQuestion[]
}
