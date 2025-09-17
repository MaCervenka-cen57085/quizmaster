import './create-question.scss'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useApi } from 'api/hooks'
import { useNavigate } from 'react-router-dom'
import { type QuestionApiData, getQuestionByHash, updateQuestion, deleteQuestion } from 'api/quiz-question.ts'

import { emptyQuestionFormData, toQuestionApiData, toQuestionFormData } from './form'
import { CreateQuestionForm } from './create-question'
import { validateQuestionFormData } from './validators'
import type { ErrorCodes } from './form/error-message'

export function EditQuestionContainer() {
    const params = useParams()
    const questionHash = params.id
    const navigate = useNavigate()

    const [questionData, setQuestionData] = useState(emptyQuestionFormData())

    const [isLoaded, setIsLoaded] = useState<boolean>(false)
    const [linkToQuestion, setLinkToQuestion] = useState<string>('')
    const [linkToEditQuestion, setLinkToEditQuestion] = useState<string>('')
    const [errors, setErrors] = useState<ErrorCodes>(new Set())
    const [questionId, setQuestionId] = useState<number>(0)

    useApi(questionHash, getQuestionByHash, quizQuestion => {
        setQuestionData(toQuestionFormData(quizQuestion))
        setLinkToQuestion(`${location.origin}/question/${quizQuestion.id}`)
        setLinkToEditQuestion(`${location.origin}/question/${questionHash}/edit`)
        setQuestionId(quizQuestion.id)
        setIsLoaded(true)
    })

    const patchData = async (formData: QuestionApiData) => {
        if (!questionHash) {
            throw new Error('Question hash is not defined')
        }

        updateQuestion(formData, questionHash).catch(error => setLinkToQuestion(error.message))
    }

    const handleSubmit = () => {
        const errors = validateQuestionFormData(questionData)

        if (errors.size > 0) {
            setErrors(errors)
        } else {
            const apiData = toQuestionApiData(questionData)
            patchData(apiData)
        }
    }

    const handleQuestionDelete = () => {
        deleteQuestion(questionId)
        navigate('/')
    }

    return (
        <CreateQuestionForm
            title="Quiz Question Edit Page"
            errors={errors}
            handleSubmit={handleSubmit}
            isLoaded={isLoaded}
            linkToEditQuestion={linkToEditQuestion}
            linkToQuestion={linkToQuestion}
            questionData={questionData}
            setQuestionData={setQuestionData}
            isEdit={true}
            handleQuestionDelete={handleQuestionDelete}
        />
    )
}
