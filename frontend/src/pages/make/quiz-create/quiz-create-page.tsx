import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { useApi } from 'api/hooks'
import { fetchWorkspaceQuestions } from 'api/workspace'

import type { QuizQuestion } from 'model/quiz-question'
import { postQuiz } from 'api/quiz'
import { QuizCreateForm, type QuizCreateFormData } from './quiz-create-form'
import { tryCatch } from 'helpers'
import { Alert, Page } from 'pages/components'
import { QuizUrl } from './components/quiz-url'
import { QuizInfoUrl } from './components/quiz-info-url'

export const QuizCreatePage = () => {
    const [searchParams] = useSearchParams()
    const workspaceGuid = searchParams.get('workspaceguid')
    const navigate = useNavigate()

    const [workspaceQuestions, setWorkspaceQuestions] = useState<readonly QuizQuestion[]>([])
    const [quizId, setQuizId] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string>('')

    useApi(workspaceGuid || '', fetchWorkspaceQuestions, setWorkspaceQuestions)

    const onSubmit = (data: QuizCreateFormData) =>
        tryCatch(setErrorMessage, async () => {
            const quizId = await postQuiz(data)
            setQuizId(quizId)
            if (workspaceGuid) {
                navigate(`/workspace/${workspaceGuid}`)
            }
        })

    return (
        <Page title="Create Quiz">
            <QuizCreateForm questions={workspaceQuestions} onSubmit={onSubmit} />

            {errorMessage && <Alert type="error">{errorMessage}</Alert>}
            {quizId && (
                <>
                    <QuizUrl quizId={quizId} /> <QuizInfoUrl quizId={quizId} />
                </>
            )}
        </Page>
    )
}
