import './create-question.scss'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { type QuestionApiData, saveQuestion } from 'api/quiz-question.ts'

import { emptyQuestionFormData, toQuestionApiData } from './form'
import { CreateQuestionForm } from './create-question'
import type { ErrorCodes } from './form/error-message'
import { validateQuestionFormData } from './validators'

export function CreateQuestionContainer() {
    const [searchParams] = useSearchParams()
    const questionListGuid = searchParams.get('listguid') ? searchParams.get('listguid') : ''
    const navigate = useNavigate()

    const [questionData, setQuestionData] = useState(emptyQuestionFormData())
    const [linkToQuestion, setLinkToQuestion] = useState<string>('')
    const [linkToEditQuestion, setLinkToEditQuestion] = useState<string>('')

    const [errors, setErrors] = useState<ErrorCodes>(new Set())
    let editUrl = ''

    const postData = async (formData: QuestionApiData) => {
        await saveQuestion(formData)
            .then(response => {
                setLinkToQuestion(`${location.origin}/question/${response.id}`)
                setLinkToEditQuestion(`${location.origin}/question/${response.hash}/edit`)
                editUrl = `/question/${response.hash}/edit`
            })
            .catch(error => setLinkToQuestion(error.message))
    }

    const handleSubmit = () => {
        const errors = validateQuestionFormData(questionData)
        setErrors(errors)
        if (errors.size > 0) {
            return
        }
        const apiData = toQuestionApiData(questionData)

        if (questionListGuid !== '') {
            apiData.questionListGuid = questionListGuid
        }

        postData(apiData).then(() => {
            if (questionListGuid !== '') {
                //to be refactored we should not wait post data to finish
                navigate(`/q-list/${questionListGuid}`)
            } else {
                navigate(editUrl)
            }
        })
    }

    const handleQuestionDelete = () => ({})

    return (
        <>
            <h1>Create Question</h1>
            <CreateQuestionForm
                errors={errors}
                handleSubmit={handleSubmit}
                isLoaded={true}
                linkToEditQuestion={linkToEditQuestion}
                linkToQuestion={linkToQuestion}
                questionData={questionData}
                setQuestionData={setQuestionData}
                isEdit={false}
                handleQuestionDelete={handleQuestionDelete}
            />
        </>
    )
}
