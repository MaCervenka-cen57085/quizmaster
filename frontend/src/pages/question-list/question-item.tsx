import type { QuizQuestion } from 'model/quiz-question'
import { EditQuestionButton, TakeQuestionButton, CopyQuestionButton } from './question-list.tsx'

interface Props {
    question: QuizQuestion
    index?: number
    onEditQuestion: () => void
    onTakeQuestion: () => void
    onCopyTakeQuestion: () => void
}

export const QuestionItem: React.FC<Props> = ({
    question,
    index,
    onEditQuestion,
    onTakeQuestion,
    onCopyTakeQuestion,
}) => {
    return (
        <div className="question-item">
            {index !== undefined && <span className="question-index">Q{index + 1}. </span>}
            <span id="question-text">{question.question}</span>
            <div className="edit-button">
                <EditQuestionButton id={question.hash} hash={question.hash} onClick={onEditQuestion} />
            </div>
            <div className="take-button">
                <TakeQuestionButton id={question.hash} hash={question.hash} onClick={onTakeQuestion} />
            </div>
            <div className="copy-take-button">
                <CopyQuestionButton id={question.hash} hash={question.hash} onClick={onCopyTakeQuestion} />
            </div>
        </div>
    )
}
