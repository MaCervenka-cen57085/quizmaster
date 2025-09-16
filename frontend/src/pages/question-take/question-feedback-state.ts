import { type AnswerIdxs, isAnsweredCorrectly, type Answers } from 'model/quiz-question'
import type { QuestionTakeState } from 'pages/question-take'

export interface QuestionFeedbackState {
    readonly isQuestionCorrect: boolean
    readonly isAnswerCorrect: (idx: number) => boolean
    readonly isUserSelected: (idx: number) => boolean
    readonly showFeedback: (idx: number) => boolean
    readonly score: number
}

export const useQuestionFeedbackState = (state: QuestionTakeState, answers: Answers): QuestionFeedbackState => {
    const isQuestionCorrect = isAnsweredCorrectly(state.selectedAnswerIdxs, answers.correctAnswers)

    const isAnswerCorrect = (idx: number) =>
        (answers.correctAnswers.includes(idx) && state.selectedAnswerIdxs.includes(idx)) ||
        (!answers.correctAnswers.includes(idx) && !state.selectedAnswerIdxs.includes(idx))

    const isUserSelected = (idx: number) => state.selectedAnswerIdxs.includes(idx)

    const showFeedback = (idx: number) => (state.isMultipleChoice ? true : state.selectedAnswerIdxs[0] === idx)

    const score = calculateScore(state.selectedAnswerIdxs, answers.correctAnswers, isQuestionCorrect)

    return { isQuestionCorrect, isAnswerCorrect, showFeedback, isUserSelected, score }
}

const calculateScore = (
    selectedAnswerIdxs: AnswerIdxs,
    correctAnswers: AnswerIdxs,
    isAnsweredCorrectly: boolean,
): number => {
    const correctSelectedAnswers = selectedAnswerIdxs.filter(item => correctAnswers.includes(item))
    const wrongSelectedAnswers = selectedAnswerIdxs.filter(item => !correctAnswers.includes(item))
    const missingCorrectAnswers = correctAnswers.length - correctSelectedAnswers.length
    const totalErrorCount = wrongSelectedAnswers.length + missingCorrectAnswers

    if (isAnsweredCorrectly) {
        return 1
    }

    if (totalErrorCount <= 1) {
        return 0.5
    }

    return 0
}
