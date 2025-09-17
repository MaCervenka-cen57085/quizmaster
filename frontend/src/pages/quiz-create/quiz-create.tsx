import { useParams } from 'react-router-dom'
import { useApi } from 'api/hooks'
import { useState } from 'react'
import type { QuizQuestion } from 'model/quiz-question'
import { getListQuestions } from 'api/question-list'
import { postQuiz } from 'api/quiz'

export const QuizCreatePage = () => {
    const params = useParams()
    const listId = params.listguid
    const [questionList, setQuestionList] = useState<QuizQuestion[]>([])
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const [quizId, setQuizId] = useState<string | undefined>(undefined)

    useApi(listId, getListQuestions, setQuestionList)

    const handleSelect = (id: number) => {
        setSelectedIds(prev => (prev.includes(id) ? prev.filter(prevId => prevId !== id) : [...prev, id]))
    }

    const handleCreateQuiz = async () => {
        const quizId = await postQuiz({
            title: 'TOOD',
            description: 'TODO',
            timeLimit: 0,
            questionIds: selectedIds,
            afterEach: false,
            passScore: 0,
        })

        setQuizId(quizId)
    }

    return (
        <div>
            <h2>Create Quiz</h2>
            {questionList.map(item => (
                <div key={String(item.id)}>
                    <input id={String(item.id)} type="checkbox" onChange={() => handleSelect(item.id)} />
                    <label htmlFor={item.hash}>{item.question}</label>
                </div>
            ))}

            <button onClick={handleCreateQuiz} type="button">
                Create quiz
            </button>
            {quizId && (
                <>
                    Quiz url: <a href={`${location.origin}/quiz/${quizId}`}>{`${location.origin}/quiz/${quizId}`}</a>
                </>
            )}
        </div>
    )
}
