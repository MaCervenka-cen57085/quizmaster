import './create-quiz.scss'
import { useState } from 'react'
import { emptyQuizFormData } from './form'
import { CreateQuizForm } from './create-quiz'
import type { QuizCreateFromQuestionListRequest } from 'model/quiz-question'
import { postQuizWithQuestionList } from 'api/quiz'

export function CreateQuizContainer() {
    const [quizData, setQuizData] = useState(emptyQuizFormData())
    const [linkToTakeQuiz, setLinkToTakeQuiz] = useState<string>('')
    const [quizCreateError, setQuizCreateError] = useState<string>('')

    const postData = async (formData: QuizCreateFromQuestionListRequest) => {
        await postQuizWithQuestionList(formData)
            .then(response => {
                setLinkToTakeQuiz(`${location.origin}/quiz/${response}`)
            })
            .catch(error => setQuizCreateError(error.message))
    }

    const handleSubmit = () => {
        setQuizCreateError('')

        const apiData: QuizCreateFromQuestionListRequest = {
            title: quizData.title,
            description: quizData.description ?? '',
            questionListIds: quizData.questionList?.split(',').map(id => id.trim()) || [],
            afterEach: false,
            passScore: quizData.passScore || 0,
            timeLimit: quizData.timeLimit || 120,
        }
        postData(apiData)
    }

    return (
        <CreateQuizForm
            handleSubmit={handleSubmit}
            quizData={quizData}
            setQuizData={setQuizData}
            linkToTakeQuiz={linkToTakeQuiz}
            quizCreateError={quizCreateError}
        />
    )
}
