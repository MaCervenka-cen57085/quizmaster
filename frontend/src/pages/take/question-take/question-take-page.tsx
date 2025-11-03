import './question-take-page.scss'

import { useState } from 'react'
import { useParams } from 'react-router-dom'

import type { QuizQuestion } from 'model/quiz-question.ts'
import { useApi } from 'api/hooks'
import { fetchQuestion } from 'api/quiz-question.ts'
import { QuestionForm } from 'pages/take/question-take'

export const QuestionTakePage = () => {
    const params = useParams()

    const [quizQuestion, setQuizQuestion] = useState<QuizQuestion | null>(null)

    useApi(params.id, fetchQuestion, setQuizQuestion)

    return quizQuestion ? <QuestionForm question={quizQuestion} mode={'LEARN' as const} /> : null
}
