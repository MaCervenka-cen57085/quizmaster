import { useEffect, useState } from 'react'

interface Quiz {
    id: number
    title: string
    description: string
    passScore: number
}

interface QuizListProps {
    onQuizSelect?: (quiz: Quiz) => void
}

export const QuizList = ({ onQuizSelect }: QuizListProps) => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await fetch('/api/quiz/list')
                if (!response.ok) {
                    throw new Error('Failed to fetch quizzes')
                }
                const data = await response.json()
                setQuizzes(data.quizzes || [])
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error')
            } finally {
                setLoading(false)
            }
        }

        fetchQuizzes()
    }, [])

    if (loading) return <div>Loading quizzes...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <div className="quiz-list">
            <h3>Available Quizzes</h3>
            {quizzes.length === 0 ? (
                <p>No quizzes available.</p>
            ) : (
                <div className="quiz-grid">
                    {quizzes.map(quiz => (
                        <div key={quiz.id} className="quiz-card">
                            <h4>{quiz.title}</h4>
                            <p>{quiz.description}</p>
                            <p>Pass Score: {quiz.passScore}%</p>
                            <button type="button" onClick={() => onQuizSelect?.(quiz)} className="quiz-button">
                                Take Quiz
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
