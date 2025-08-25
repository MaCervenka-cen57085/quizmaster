import './create-question.scss'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useApi } from 'api/hooks'
import { type QuestionApiData, getQuestionByHash, updateQuestion } from 'api/quiz-question.ts'

import { emptyQuestionFormData, toQuestionApiData, toQuestionFormData } from './form'
import { CreateQuestionForm } from './create-question'

export function EditQuestionContainer() {
    const params = useParams()
    const questionHash = params.id

    const [questionData, setQuestionData] = useState(emptyQuestionFormData())

    const [isLoaded, setIsLoaded] = useState<boolean>(false)
    const [linkToQuestion, setLinkToQuestion] = useState<string>('')
    const [errorMessage, setErrorMessage] = useState<string>('')

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
        setErrorMessage('')

        const apiData = toQuestionApiData(questionData)

        if (apiData.correctAnswers.length === 0) {
            setErrorMessage('At least one correct answer must be selected')
            return
        }

        const answersCount = apiData.answers.length

        for (let i = 0; i < answersCount; i++) {
            if (apiData.answers[i] === '') {
                setErrorMessage('All answers must be filled in')
                return
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
            return
        }

        if (apiData.question === '') {
            setErrorMessage('Question must not be empty.')
            return
        }

        patchData(apiData)
    }

    return (
        <CreateQuestionForm
            errorMessage={errorMessage}
            errors={new Set()}
            handleSubmit={handleSubmit}
            isLoaded={isLoaded}
            linkToEditQuestion=""
            linkToQuestion={linkToQuestion}
            questionData={questionData}
            setQuestionData={setQuestionData}
        />
    )
}
