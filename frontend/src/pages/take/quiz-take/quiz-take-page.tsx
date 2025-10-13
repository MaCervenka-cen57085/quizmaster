import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { useApi } from 'api/hooks.ts'
import { getQuiz } from 'api/quiz.ts'
import { isAnsweredCorrectly, type Quiz } from 'model/quiz-question.ts'

import { QuizScore } from './quiz-score.tsx'
import { QuizQuestionForm, type QuizState } from './quiz.tsx'

export const QuizTakePage = () => {
    const params = useParams()
    const quizId = params.id
    const [quizScore, setQuizScore] = useState<QuizScore | null>(null)
    const isEvaluated = quizScore !== null
    const [quizState, setQuizState] = useState<QuizState>([])
    const [firstQuizState, setFirstQuizState] = useState<QuizState>([])

    const [quiz, setQuiz] = useState<Quiz>()

    const onEvaluate = () => {
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

    useApi(quizId, getQuiz, setQuiz)

    if (quiz) {
        return isEvaluated ? (
            <QuizScore
                score={quizScore}
                questions={quiz.questions}
                passScore={quiz.passScore}
                showFirstAnwers={quiz.afterEach}
            />
        ) : (
            <QuizQuestionForm
                setFirstQuizState={setFirstQuizState}
                setQuizState={setQuizState}
                firstQuizState={firstQuizState}
                quizState={quizState}
                onEvaluate={onEvaluate}
                quiz={quiz}
            />
        )
    }
}
