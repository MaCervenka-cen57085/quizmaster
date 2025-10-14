import { isAnsweredCorrectly } from 'model/quiz-question.ts'
import type { Quiz } from 'model/quiz.ts'
import type { QuizAnswers } from './quiz-answers-state'

export interface QuizScore {
    readonly correct: number
    readonly firstCorrect: number
    readonly total: number
}

export const evaluate = (quiz: Quiz, quizAnswers: QuizAnswers): QuizScore => ({
    correct: quiz.questions.filter((question, idx) =>
        isAnsweredCorrectly(quizAnswers.finalAnswers[idx], question.correctAnswers),
    ).length,
    firstCorrect: quiz.questions.filter((question, idx) =>
        isAnsweredCorrectly(quizAnswers.firstAnswers[idx], question.correctAnswers),
    ).length,
    total: quiz.questions.length,
})
