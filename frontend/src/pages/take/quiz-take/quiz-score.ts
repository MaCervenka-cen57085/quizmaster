import { isAnsweredCorrectly, type AnswerIdxs } from 'model/quiz-question.ts'
import type { Quiz } from 'model/quiz.ts'

export type SelectedAnswers = readonly AnswerIdxs[]

export interface QuizScore {
    readonly correct: number
    readonly firstCorrect: number
    readonly total: number
}

export const evaluate = (quiz: Quiz, firstAnswers: SelectedAnswers, finalAnswers: SelectedAnswers) => ({
    correct: quiz.questions.filter((question, idx) => isAnsweredCorrectly(finalAnswers[idx], question.correctAnswers))
        .length,
    firstCorrect: quiz.questions.filter((question, idx) =>
        isAnsweredCorrectly(firstAnswers[idx], question.correctAnswers),
    ).length,
    total: quiz.questions.length,
})
