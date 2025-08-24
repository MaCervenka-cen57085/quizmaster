import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import type { Quiz } from 'model/quiz-question.ts'
import { useApi } from 'api/hooks.ts'
import { getQuiz } from 'api/quiz.ts'
import { QuizDetails } from './quiz-details.tsx'

export const QuizWelcomePage = () => {
    const navigate = useNavigate()
    const params = useParams()
    const [quiz, setQuiz] = useState<Quiz>()

    useApi(params.id, getQuiz, setQuiz)

    const onStart = () => navigate(`/quiz/${params.id}/questions`)

    return quiz && <QuizDetails quiz={quiz} onStart={onStart} />
}
