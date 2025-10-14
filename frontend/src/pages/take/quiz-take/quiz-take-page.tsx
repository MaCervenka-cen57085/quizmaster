import { useState } from 'react'

import { useQuizApi } from './hooks.ts'

import { QuizScorePage } from './quiz-score-page.tsx'
import { QuizQuestionForm } from './quiz.tsx'
import type { QuizAnswers } from './quiz-answers-state.ts'

export const QuizTakePage = () => {
    const quiz = useQuizApi()
    const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null)

    if (quiz) {
        return quizAnswers ? (
            <QuizScorePage quiz={quiz} quizAnswers={quizAnswers} />
        ) : (
            <QuizQuestionForm quiz={quiz} onEvaluate={setQuizAnswers} />
        )
    }
}
