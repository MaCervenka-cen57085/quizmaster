import './create-question.scss'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { type QuestionApiData, saveQuestion } from 'api/quiz-question.ts'

import { emptyQuestionFormData, toQuestionApiData } from './form'
import { CreateQuestionForm } from './create-question'
import type { ErrorCode, ErrorCodes } from './form/error-message'

export function CreateQuestionContainer() {
    const [searchParams] = useSearchParams()
    const questionListGuid = searchParams.get('listguid') ? searchParams.get('listguid') : ''
    const navigate = useNavigate()

    const [questionData, setQuestionData] = useState(emptyQuestionFormData())
    const [linkToQuestion, setLinkToQuestion] = useState<string>('')
    const [linkToEditQuestion, setLinkToEditQuestion] = useState<string>('')
    const [errorMessage, setErrorMessage] = useState<string>('')

    const [errors, setErrors] = useState<ErrorCodes>(new Set())

    const postData = async (formData: QuestionApiData) => {
        await saveQuestion(formData)
            .then(response => {
                setLinkToQuestion(`${location.origin}/question/${response.id}`)
                setLinkToEditQuestion(`${location.origin}/question/${response.hash}/edit`)
            })
            .catch(error => setLinkToQuestion(error.message))
    }

    const handleSubmit = () => {
        const errors: Set<ErrorCode> = new Set()
        const addError = (error: ErrorCode) => errors.add(error)

        setErrorMessage('')
        const apiData = toQuestionApiData(questionData)

        if (apiData.correctAnswers.length === 0) {
            setErrorMessage('At least one correct answer must be selected')
            addError('no-correct-answer')
        }

        const answersCount = apiData.answers.length
        for (let i = 0; i < answersCount; i++) {
            if (apiData.answers[i] === '') {
                setErrorMessage('All answers must be filled in')
                addError('empty-answer')
            }
        }

        let explanationNotEmptyCounter = 0
        const explanationCount = apiData.explanations.length

        for (let i = 0; i < explanationCount; i++) {
            if (apiData.explanations[i] !== '') {
                explanationNotEmptyCounter++
            }
        }

        if (explanationNotEmptyCounter !== 0 && explanationNotEmptyCounter !== explanationCount) {
            setErrorMessage('All or none explanation must be filled in.')
            addError('empty-answer-explanation')
        }

        if (apiData.question === '') {
            setErrorMessage('Question must not be empty.')
            addError('empty-question')
        }

        if (errors.size > 0) {
            setErrors(errors)
            return
        }

        if (questionListGuid !== '') {
            apiData.questionListGuid = questionListGuid
        }

        postData(apiData)

        if (questionListGuid !== '') navigate(`/q-list/${questionListGuid}`)
    }

    return (
        <CreateQuestionForm
            errorMessage={errorMessage}
            errors={errors}
            handleSubmit={handleSubmit}
            isLoaded={true}
            linkToEditQuestion={linkToEditQuestion}
            linkToQuestion={linkToQuestion}
            questionData={questionData}
            setQuestionData={setQuestionData}
        />
    )
}
