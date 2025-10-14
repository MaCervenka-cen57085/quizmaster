import { useState } from 'react'
import { useStateSet } from 'helpers'
import type { Quiz } from 'model/quiz.ts'

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
