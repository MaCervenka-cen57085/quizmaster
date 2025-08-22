import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getQuizList } from '../api/quiz'
import type { QuizListResponse } from '../model/quiz-list-response'
import { QuizGrid } from '../components/QuizGrid'

export const HomePage = () => {
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
        <>
            <h1>Welcome to Quizmaster! You rock.</h1>
            <Link to="/question/new">Create new question</Link>
            <br />
            <Link to="/q-list/new">Create new question list</Link>

            <div style={{ marginTop: '2rem' }}>
                <h2>Existing Quizzes</h2>
                <QuizGrid quizList={quizList} loading={loading} error={error} />
            </div>
        </>
    )
}
