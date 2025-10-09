import type { QuizQuestion } from 'model/quiz-question'

export interface QuestionListData {
    readonly title: string
    readonly questions: readonly QuizQuestion[]
}
