import './question-select.scss'
import type { QuizQuestion } from 'model/quiz-question'

interface QuestionItemProps {
    readonly question: QuizQuestion
    readonly onSelect: (id: number) => void
}

export const QuestionItem = ({ question, onSelect }: QuestionItemProps) => {
    const inputId = `question-select-${question.id}`

    return (
        <div key={question.id} className="question-item">
            <input id={inputId} type="checkbox" onChange={() => onSelect(question.id)} />
            <label htmlFor={inputId}>{question.question}</label>
        </div>
    )
}

interface QuestionSelectProps {
    readonly questions: readonly QuizQuestion[]
    readonly onSelect: (id: number) => void
}

export const QuestionSelect = ({ questions, onSelect }: QuestionSelectProps) => (
    <div className="question-select">
        {questions.map(question => (
            <QuestionItem key={question.id} question={question} onSelect={onSelect} />
        ))}
    </div>
)
