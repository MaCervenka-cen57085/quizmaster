import './create-question.scss'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useApi } from 'api/hooks'
import { type QuestionApiData, getQuestionByHash, updateQuestion } from 'api/quiz-question.ts'

import { emptyQuestionFormData, toQuestionApiData, toQuestionFormData } from './form'
import { CreateQuestionForm } from './create-question'
import { validateQuestionFormData } from './validators'
import { ErrorCodes } from './form/error-message'

export function EditQuestionContainer() {
    const params = useParams()
    const questionHash = params.id

    const [questionData, setQuestionData] = useState(emptyQuestionFormData())

    const [isLoaded, setIsLoaded] = useState<boolean>(false)
    const [linkToQuestion, setLinkToQuestion] = useState<string>('')
    const [errors, setErrors] = useState<ErrorCodes>(new Set())

    useApi(questionHash, getQuestionByHash, quizQuestion => {
        setQuestionData(toQuestionFormData(quizQuestion))
        setIsLoaded(true)
    })

    const patchData = async (formData: QuestionApiData) => {
        if (!questionHash) {
            throw new Error('Question hash is not defined')
        }

        updateQuestion(formData, questionHash)
            .then(response => {
                setLinkToQuestion(`${location.origin}/question/${response}`)
            })
            .catch(error => setLinkToQuestion(error.message))
    }

    const handleSubmit = () => {
        let errors = validateQuestionFormData(questionData);

        if (errors.size > 0) {
            setErrors(errors)
            return
        } else {
            const apiData = toQuestionApiData(questionData)
            patchData(apiData)
        }

    }

    return (
        <CreateQuestionForm
            title="Quiz Question Edit Page"
            errors={errors}
            handleSubmit={handleSubmit}
            isLoaded={isLoaded}
            linkToEditQuestion=""
            linkToQuestion={linkToQuestion}
            questionData={questionData}
            setQuestionData={setQuestionData}
        />
    )
}
