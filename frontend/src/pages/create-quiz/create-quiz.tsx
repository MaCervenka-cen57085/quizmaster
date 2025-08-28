import './create-quiz.scss'

//import { description, pass-score, question-list, time-limit, title} from './components'
import { type QuizFormData, QuizEditForm } from './form'

type Props = {
    quizData: QuizFormData
    setQuizData: (data: QuizFormData) => void
    handleSubmit: () => void
}

export function CreateQuizForm({ handleSubmit, quizData, setQuizData }: Props) {
    return (
        <div className="quiz-page">
            <QuizEditForm quizData={quizData} setQuizData={setQuizData} onSubmit={handleSubmit} />
            <br />
            <p style={{ textAlign: 'right', fontSize: '11px' }}>Powered by Kiwi</p>
        </div>
    )
}
