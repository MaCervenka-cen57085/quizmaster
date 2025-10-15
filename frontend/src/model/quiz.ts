import type { QuizQuestion } from './quiz-question.ts'

export interface Quiz {
    readonly id: number
    readonly title: string
    readonly description: string
    readonly questions: readonly QuizQuestion[]
    readonly afterEach: boolean
    readonly passScore: number
    readonly timeLimit: number

    readonly timesTaken: number
    readonly timesFinished: number
    readonly averageScore: number
    readonly size?: number
}
