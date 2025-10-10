import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { tryCatch } from 'helpers.ts'
import { postQuestionList } from 'api/question-list.ts'

import { Alert, Page } from 'pages/components'
import { QuestionListCreateForm, type QuestionListFormData } from './question-list-create-form.tsx'

export function QuestionListCreatePage() {
    const [errorMessage, setErrorMessage] = useState<string>('')

    const navigate = useNavigate()

    const onSubmit = async (data: QuestionListFormData) =>
        await tryCatch(setErrorMessage, async () => {
            const response = await postQuestionList(data)
            navigate(`/q-list/${response.guid}`)
        })

    return (
        <Page title="Create Question List">
            <QuestionListCreateForm onSubmit={onSubmit} />
            {errorMessage && <Alert type="error">{errorMessage}</Alert>}
        </Page>
    )
}
