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

            <div className="navigation-links">
                <a href="/question/new">Create a new question</a>
                <a href="/q-list/new">Create a new question list</a>
            </div>

            <QuizList onQuizSelect={handleQuizSelect} />
        </div>
    )
}
