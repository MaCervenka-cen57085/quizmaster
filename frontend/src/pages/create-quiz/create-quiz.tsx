import './create-quiz.scss'
import { type QuizFormData, QuizEditForm } from './form'

type Props = {
    quizData: QuizFormData
    setQuizData: (data: QuizFormData) => void
    handleSubmit: () => void
    linkToTakeQuiz: string
    quizCreateError: string
}

export function CreateQuizForm(props: Props) {
    return (
        <div className="quiz-page">
            <QuizEditForm {...props} />
            <br />
            <p style={{ textAlign: 'right', fontSize: '11px' }}>Powered by Kiwi</p>
        </div>
    )
}
