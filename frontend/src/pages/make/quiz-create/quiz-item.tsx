import type React from 'react'
import type { Quiz } from 'model/quiz'
import { Button } from 'pages/components/button'
interface Props {
    quiz: Quiz
}

export const QuizItem: React.FC<Props> = ({ quiz }) => {

    const onTakeQuiz = () => {
        const takeUrl = `${window.location.origin}/take/${quiz.id}`
        window.open(takeUrl, '_self')
    }

    return  <div className="quiz-item question-item">
                <span id="quiz-text">{quiz.title}
                    <span className="take-quiz-button">
                        <Button onClick={onTakeQuiz}>
                                Take
                            </Button>
                    </span>
                </span>
                {/*<div className="copy-take-button">
                    <CopyQuizButton id={quiz.id} hash={quiz.hash} kind="take" onClick={onCopyTakeQuiz} />
                </div>
                */}
            </div>
}
