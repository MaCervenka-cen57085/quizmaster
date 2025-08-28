import type { Quiz } from 'model/quiz-question.ts'
import { StartButton } from 'pages/quiz-take/buttons'

export interface QuizDetailsProps {
    readonly quiz: Quiz
    readonly onStart: () => void
}

export const QuizDetails = ({ quiz, onStart }: QuizDetailsProps) => (
    <>
        <h2>Welcome to the quiz</h2>
        <h3 id="quiz-name">{quiz.title}</h3>
        <p id="quiz-description">{quiz.description}</p>
        <p>
            Question count: <span id="question-count">{quiz.questions.length}</span>
        </p>
        <p id="pass-score">
            Pass score: <span id="pass-score">{quiz.passScore}</span>%
        </p>
        <p id="question-feedback">{quiz.afterEach ? 'Continuous feedback' : 'Feedback at the end'}</p>
        <StartButton onClick={onStart} />
    </>
)
