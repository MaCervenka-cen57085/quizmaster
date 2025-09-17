import './quiz-create.scss'
import { useSearchParams } from 'react-router-dom'
import { useApi } from 'api/hooks'
import { useState } from 'react'
import type { QuizQuestion } from 'model/quiz-question'
import { getListQuestions } from 'api/question-list'
import { postQuiz } from 'api/quiz'

export const QuizCreatePage = () => {
    const [searchParams] = useSearchParams()
    const listGuid = searchParams.get('listguid')
    const [questionList, setQuestionList] = useState<QuizQuestion[]>([])
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const [timeLimit, setTimeLimit] = useState<number>(600)
    const [quizId, setQuizId] = useState<string | undefined>(undefined)

    useApi(listGuid || '', getListQuestions, setQuestionList)

    const handleSelect = (id: number) => {
        setSelectedIds(prev => (prev.includes(id) ? prev.filter(prevId => prevId !== id) : [...prev, id]))
    }

    const handleCreateQuiz = async () => {
        const quizId = await postQuiz({
            title: 'TOOD',
            description: 'TODO',
            timeLimit: timeLimit,
            questionIds: selectedIds,
            afterEach: false,
            passScore: 0,
        })

        setQuizId(quizId)
    }
    const handleChangeTimeLimit = (newValue: string) => {
        // Only allow positive integers or empty string
        if (/^[1-9]\d*$/.test(newValue) || newValue === '') {
            setTimeLimit(newValue as unknown as number)
        }
    }

    return (
        <div>
            <h2>Create Quiz</h2>
            <div>
                <label htmlFor="time-limit">Time limit (seconds): </label>
                <input
                    id="time-limit"
                    type="string"
                    min="1"
                    step="0"
                    value={timeLimit}
                    placeholder="Time limit in seconds"
                    onChange={e => handleChangeTimeLimit(e.target.value)}
                />
            </div>
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
