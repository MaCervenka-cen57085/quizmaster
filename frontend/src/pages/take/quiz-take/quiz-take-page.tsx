import { useState } from 'react'

import { useQuizApi } from './hooks.ts'
import { isAnsweredCorrectly } from 'model/quiz-question.ts'

import { QuizScore } from './quiz-score.tsx'
import { QuizQuestionForm, type QuizState } from './quiz.tsx'

export const QuizTakePage = () => {
    const quiz = useQuizApi()
    const [quizScore, setQuizScore] = useState<QuizScore | null>(null)
    const isEvaluated = quizScore !== null

    const onEvaluate = (quizState: QuizState, firstQuizState: QuizState) => {
        if (quiz) {
            setQuizScore({
                correct: quiz.questions.filter((question, idx) =>
                    isAnsweredCorrectly(quizState[idx], question.correctAnswers),
                ).length,
                firstCorrect: quiz.questions.filter((question, idx) =>
                    isAnsweredCorrectly(firstQuizState[idx], question.correctAnswers),
                ).length,
                total: quiz.questions.length,
            })
            quiz.questions.forEach((question, idx) => {
                question.userInput = quizState[idx]
            })
        }
    }

    if (quiz) {
        return isEvaluated ? (
            <QuizScore
                score={quizScore}
                questions={quiz.questions}
                passScore={quiz.passScore}
                showFirstAnwers={quiz.afterEach}
            />
        ) : (
            <QuizQuestionForm quiz={quiz} onEvaluate={onEvaluate} />
        )
    }
}
