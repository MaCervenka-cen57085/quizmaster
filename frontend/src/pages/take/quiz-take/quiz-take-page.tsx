import { useState } from 'react'

import { useQuizApi } from './hooks.ts'
import { evaluate, type QuizScore } from './quiz-score.ts'

import { QuizScorePage } from './quiz-score-page.tsx'
import { QuizQuestionForm, type QuizState } from './quiz.tsx'

export const QuizTakePage = () => {
    const quiz = useQuizApi()
    const [quizScore, setQuizScore] = useState<QuizScore | null>(null)
    const isEvaluated = quizScore !== null

    const onEvaluate = (quizState: QuizState, firstQuizState: QuizState) => {
        if (!quiz) return

        setQuizScore(evaluate(quiz, firstQuizState, quizState))
        // TODO wtf?
        quiz.questions.forEach((question, idx) => {
            question.userInput = quizState[idx]
        })
    }

    if (quiz) {
        return isEvaluated ? (
            <QuizScorePage quiz={quiz} score={quizScore} />
        ) : (
            <QuizQuestionForm quiz={quiz} onEvaluate={onEvaluate} />
        )
    }
}
