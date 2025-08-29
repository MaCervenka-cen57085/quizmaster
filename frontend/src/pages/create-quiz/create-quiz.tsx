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
    const { quizCreateError, linkToTakeQuiz } = props
    return (
        <div className="quiz-form-modern">
            <h2>Create a New Quiz</h2>
            {quizCreateError && <div className="error">{quizCreateError}</div>}
            {linkToTakeQuiz && (
                <div className="success">
                    Quiz created! <a href={linkToTakeQuiz}>Take your quiz</a>
                </div>
            )}
            <QuizEditForm {...props} />
            <p style={{ textAlign: 'right', fontSize: '11px', marginTop: '1.5rem', color: '#a0aec0' }}>
                Powered by FluxByExample
            </p>
        </div>
    )
}
