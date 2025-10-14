import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { useApi } from 'api/hooks'
import { fetchListQuestions } from 'api/question-list'

import type { QuizQuestion } from 'model/quiz-question'
import { postQuiz } from 'api/quiz'
import { QuizCreateForm, type QuizCreateFormData } from './quiz-create-form'
import { tryCatch } from 'helpers'
import { Alert, Page } from 'pages/components'
import { QuizUrl } from './components/quiz-url'
import { QuizInfoUrl } from './components/quiz-info-url'

export const QuizCreatePage = () => {
    const [searchParams] = useSearchParams()
    const listGuid = searchParams.get('listguid')

    const [questionList, setQuestionList] = useState<readonly QuizQuestion[]>([])
    const [quizId, setQuizId] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string>('')

    useApi(listGuid || '', fetchListQuestions, setQuestionList)

    const onSubmit = (data: QuizCreateFormData) =>
        tryCatch(setErrorMessage, async () => {
            const quizId = await postQuiz(data)
            setQuizId(quizId)
        })

    return (
        <Page title="Create Quiz">
            <QuizCreateForm questions={questionList} onSubmit={onSubmit} />

            {errorMessage && <Alert type="error">{errorMessage}</Alert>}
            {quizId && <><QuizUrl quizId={quizId} /> <QuizInfoUrl quizId={quizId} /></>}
        </Page>
    )
}
