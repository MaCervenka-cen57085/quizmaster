import { useState } from 'react'

import { updated, useStateSet } from 'helpers'
import type { AnswerIdxs } from 'model/quiz-question.ts'
import type { Quiz } from 'model/quiz.ts'

export type SelectedAnswers = readonly AnswerIdxs[]

export type QuizAnswers = {
    readonly firstAnswers: SelectedAnswers
    readonly finalAnswers: SelectedAnswers
}

export interface QuizAnswersState {
    readonly quizAnswers: QuizAnswers
    readonly answerQuestion: (questionIdx: number, answerIdxs: AnswerIdxs) => void
}

export const useQuizAnswersState = (): QuizAnswersState => {
    const [firstAnswers, setFirstAnswers] = useState<SelectedAnswers>([])
    const [finalAnswers, setFinalAnswers] = useState<SelectedAnswers>([])

    const answerQuestion = (questionIdx: number, answerIdxs: AnswerIdxs) => {
        if (firstAnswers[questionIdx] === undefined) setFirstAnswers(updated(firstAnswers, questionIdx, answerIdxs))

        setFinalAnswers(updated(finalAnswers, questionIdx, answerIdxs))
    }

    return { quizAnswers: { firstAnswers, finalAnswers }, answerQuestion }
}

export interface QuizNavigationState {
    readonly currentQuestionIdx: number
    readonly isFirstQuestion: boolean
    readonly isLastQuestion: boolean
    readonly skippedQuestions: ReadonlySet<number>
    readonly goto: (questionIdx: number) => void
    readonly canBack: boolean
    readonly canNext: boolean
    readonly canSkip: boolean
    readonly next: () => void
    readonly back: () => void
    readonly skip: () => void
    readonly unskip: () => void
}

export const useQuizNavigationState = (quiz: Quiz): QuizNavigationState => {
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
    const [skippedQuestions, , addSkippedQuestion, removeSkippedQuestion] = useStateSet<number>()

    const isFirstQuestion = currentQuestionIdx === 0
    const isLastQuestion = currentQuestionIdx === quiz.questions.length - 1

    const next = () => {
        if (isLastQuestion) {
            const firstSkippedQuestion = Array.from(skippedQuestions).sort()[0]
            setCurrentQuestionIdx(firstSkippedQuestion)
        } else {
            setCurrentQuestionIdx(prev => prev + 1)
        }
    }

    const canNext = !isLastQuestion || skippedQuestions.size > 0
    const canSkip = !isLastQuestion

    const skip = () => {
        addSkippedQuestion(currentQuestionIdx)
        next()
    }

    const unskip = () => {
        removeSkippedQuestion(currentQuestionIdx)
    }

    const canBack = currentQuestionIdx > 0

    const back = () => setCurrentQuestionIdx(prev => prev - 1)

    return {
        currentQuestionIdx,
        isFirstQuestion,
        isLastQuestion,
        skippedQuestions,
        goto: setCurrentQuestionIdx,
        canNext,
        canSkip,
        canBack,
        next,
        back,
        skip,
        unskip,
    }
}
