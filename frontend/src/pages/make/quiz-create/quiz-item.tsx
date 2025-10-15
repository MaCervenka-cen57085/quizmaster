import type React from 'react'
import type { Quiz } from 'model/quiz'
import { Button } from 'pages/components/button'
import copyClipboardIcon from 'assets/icons/copy-clipboard.svg'
interface Props {
    quiz: Quiz
}

export const QuizItem: React.FC<Props> = ({ quiz }) => {

    const onTakeQuiz = () => {
        const takeUrl = `${window.location.origin}/quiz/${quiz.id}`
        window.open(takeUrl, '_self')
    }

    const copyQuizLink = () => {
        const takeUrl = `${window.location.origin}/quiz/${quiz.id}`
        navigator.clipboard.writeText(takeUrl);
    }

    return (
        <div className="quiz-item question-item">
            <span id="quiz-text">
                {quiz.title}
                <span className="take-quiz-button take-button">
                    <Button className="take-quiz" onClick={onTakeQuiz}>Take</Button>
                </span>
                <span className="copy-take-button copy-button">
                    <Button className="copy-take" onClick={copyQuizLink}>
                        <img
                            id={quiz.id.toString()}
                            src={copyClipboardIcon}
                            alt={`Copy the quiz url to clipboard`}
                            title={`Copy the quiz url to clipboard`}
                            style={{ width: '1em', height: '1em', verticalAlign: 'middle' }}
                            onError={e => {e.currentTarget.style.display = 'none'}}
                        />
                    </Button>
                </span>
            </span>
        </div>
    )
}
