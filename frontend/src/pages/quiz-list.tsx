import { useEffect, useState } from 'react'
import { getQuizList } from '../api/quiz'
import type { QuizListResponse } from '../model/quiz-list-response'
import { QuizTable } from '../components/QuizTable'

export const QuizListPage = () => {
    const [quizList, setQuizList] = useState<QuizListResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                setLoading(true)
                const response = await getQuizList()
                setQuizList(response)
            } catch (err) {
                setError('Failed to fetch quizzes')
                console.error('Error fetching quizzes:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchQuizzes()
    }, [])

    return (
        <div>
            <h1>Quiz List</h1>
            <QuizTable quizList={quizList} loading={loading} error={error} />
        </div>
    )
}
