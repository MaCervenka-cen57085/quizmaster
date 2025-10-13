import type { AnswerIdxs } from 'model/quiz-question'

export type SelectedAnswers = readonly AnswerIdxs[]

export type QuizAnswers = {
    readonly firstAnswers: SelectedAnswers
    readonly finalAnswers: SelectedAnswers
}
