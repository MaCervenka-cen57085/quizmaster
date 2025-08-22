import { QuizList } from '../components/QuizList'
import { useNavigate } from 'react-router-dom'
import './home.css'

export const HomePage = () => {
    const navigate = useNavigate()

    const handleQuizSelect = (quiz: { id: number }) => {
        navigate(`/quiz/${quiz.id}`)
    }

    return (
        <div className="home-page">
            <h1>Welcome to Quizmaster! You rock.</h1>
            <Link to="/question/new">Create new question</Link>
            <br />
            <Link to="/q-list/new">Create new question list</Link>

            <div style={{ marginTop: '2rem' }}>
                <h2>Existing Quizzes</h2>
                {loading && <p>Loading quizzes...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {quizList?.quizzes && quizList.quizzes.length > 0 && (
                    <table
                        style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            marginTop: '1rem',
                            border: '1px solid #ddd'
                        }}
                    >
                        <thead>
                            <tr style={{ backgroundColor: '#f2f2f2' }}>
                                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>ID</th>
                                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Title</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quizList.quizzes.map((quiz: QuizListItem) => (
                                <tr key={quiz.id} style={{ borderBottom: '1px solid #ddd' }}>
                                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                        {quiz.id}
                                    </td>
                                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                        {quiz.title || 'No title'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {quizList?.quizzes && quizList.quizzes.length === 0 && <p>No quizzes found.</p>}
            </div>

            <QuizList onQuizSelect={handleQuizSelect} />
        </div>
    )
}
