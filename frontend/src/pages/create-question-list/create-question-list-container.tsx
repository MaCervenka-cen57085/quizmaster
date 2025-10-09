import './create-question-list.scss'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { postQuestionList } from 'api/question-list.ts'

import { emptyQuestionListFormData } from './form'
import { CreateQuestionListForm } from './create-question-list'

export function CreateQuestionListContainer() {
    const [errorMessage, setErrorMessage] = useState<string>('')
    const navigate = useNavigate()

    const [questionListData, setQuestionListData] = useState(emptyQuestionListFormData())

    const handleSubmit = async () => {
        try {
            setErrorMessage('')

            if (questionListData.title.length === 0) {
                setErrorMessage('Title must be filled')
                return
            }

            const response = await postQuestionList(questionListData)
            if (!response.guid) {
                throw new Error('GUID is missing')
            }
            navigate(`/q-list/${response.guid}`)
        } catch (err) {
            setErrorMessage('Failed to create list')
            console.error(err)
        }
    }

    return (
        <CreateQuestionListForm
            errorMessage={errorMessage}
            handleSubmit={handleSubmit}
            questionListData={questionListData}
            setQuestionListData={setQuestionListData}
        />
    )
}
