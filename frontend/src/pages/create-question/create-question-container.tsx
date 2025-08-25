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

        const correctAnwerCount = questionData.answers.filter(answer => answer.isCorrect).length
        const emptyAnswerCount = questionData.answers.filter(answer => answer.answer.trim() === '').length
        const emptyExplanationCount = questionData.answers.filter(answer => answer.explanation.trim() === '').length
        const nonEmptyExplanationCount = questionData.answers.filter(answer => answer.explanation.trim() !== '').length

        if (questionData.question === '') addError('empty-question')
        if (emptyAnswerCount > 0) addError('empty-answer')
        if (correctAnwerCount === 0) addError('no-correct-answer')
        if (emptyExplanationCount > 0 && nonEmptyExplanationCount > 0) addError('empty-answer-explanation')

        if (errors.size > 0) {
            setErrors(errors)
            return
        }

        const apiData = toQuestionApiData(questionData)

        if (questionListGuid !== '') {
            apiData.questionListGuid = questionListGuid
        }

        postData(apiData)

        if (questionListGuid !== '') navigate(`/q-list/${questionListGuid}`)
    }

    return (
        <CreateQuestionForm
            errorMessage=""
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
