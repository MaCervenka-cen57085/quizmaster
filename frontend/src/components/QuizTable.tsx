import type { QuizListResponse, QuizListItem } from '../model/quiz-list-response'

interface QuizTableProps {
    quizList: QuizListResponse | null
    loading: boolean
    error: string | null
}

export const QuizTable = ({ quizList, loading, error }: QuizTableProps) => {
    if (loading) {
        return <p>Loading quizzes...</p>
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>
    }

    if (!quizList?.quizzes || quizList.quizzes.length === 0) {
        return <p>No quizzes found.</p>
    }

    return (
        <div className="quiz-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1rem',
            marginTop: '1rem'
        }}>
            {quizList.quizzes.map((quiz: QuizListItem) => (
                <div key={quiz.id} className="quiz-card" style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '1rem',
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
                        {quiz.title || `Quiz ${quiz.id}`}
                    </h4>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#666' }}>
                        Description: This is a quiz with ID {quiz.id}
                    </p>
                    <p style={{ margin: '0 0 1rem 0', color: '#666' }}>
                        Pass Score: 85%
                    </p>
                    <button style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}>
                        Start Quiz
                    </button>
                </div>
            ))}
        </div>
    )
}
