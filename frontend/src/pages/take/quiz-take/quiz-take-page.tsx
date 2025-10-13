import { useState } from 'react'

import { useQuizApi } from './hooks.ts'

import { QuizScorePage } from './quiz-score-page.tsx'
import { QuizQuestionForm } from './quiz.tsx'
import type { QuizAnswers } from './quiz-take-state.ts'

export const QuizTakePage = () => {
    const quiz = useQuizApi()
    const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null)
    const isEvaluated = quizAnswers !== null

    const onEvaluate = (quizAnswers: QuizAnswers) => {
        if (!quiz) return

        setQuizAnswers(quizAnswers)
        // TODO wtf?
        quiz.questions.forEach((question, idx) => {
            question.userInput = quizAnswers.finalAnswers[idx]
        })
    }

    if (quiz) {
        return isEvaluated ? (
            <QuizScorePage quiz={quiz} quizAnswers={quizAnswers} />
        ) : (
            <QuizQuestionForm quiz={quiz} onEvaluate={onEvaluate} />
        )
    }
}
