import './create-quiz.scss'
import { useState } from 'react'

import { emptyQuizFormData } from './form'
import { CreateQuizForm } from './create-quiz'

export function CreateQuizContainer() {
    const [quizData, setQuizData] = useState(emptyQuizFormData())
    const handleSubmit = () => {}

    return <CreateQuizForm handleSubmit={handleSubmit} quizData={quizData} setQuizData={setQuizData} />
}
