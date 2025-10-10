import './question-take-page.scss'

import { useState } from 'react'
import { useParams } from 'react-router-dom'

import type { QuizQuestion } from 'model/quiz-question.ts'
import { useApi } from 'api/hooks'
import { getQuestion } from 'api/quiz-question.ts'
import { QuestionForm } from 'pages/take/question-take'

export const QuestionTakePage = () => {
    const params = useParams()

    const [quizQuestion, setQuizQuestion] = useState<QuizQuestion | null>(null)

    useApi(params.id, getQuestion, setQuizQuestion)

    return quizQuestion ? <QuestionForm question={quizQuestion} afterEach={true} /> : null
}
