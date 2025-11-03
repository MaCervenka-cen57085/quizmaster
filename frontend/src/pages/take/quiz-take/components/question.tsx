import './question.scss'

import type { AnswerIdxs, Question } from 'model/question'
import { Answer } from 'pages/take/question-take'
import { QuestionExplanation } from 'pages/take/question-take'

interface QuestionFeedbackProps {
    readonly question: Question
    readonly selectedAnswerIdxs?: AnswerIdxs
}

export const QuestionFeedback = ({ question, selectedAnswerIdxs }: QuestionFeedbackProps) => {
    const isMultipleChoice = question.correctAnswers.length > 1

    const isAnswerCorrect = (idx: number) =>
        (question.correctAnswers.includes(idx) && selectedAnswerIdxs?.includes(idx)) ||
        (!question.correctAnswers.includes(idx) && !selectedAnswerIdxs?.includes(idx))

    return (
        <fieldset
            key={question.id}
            id={`question-${question.id}`}
            className="question-fieldset"
            name={`question-${question.id}`}
        >
            <legend>
                <strong id={`question-name-${question.id}`}>{question.question}</strong>
            </legend>
            <ul id={`question-answers-${question.id}`} className="answers" style={{ width: '100%' }}>
                {question.answers.map((answer, idx) => (
                    <Answer
                        key={answer}
                        isMultipleChoice={isMultipleChoice}
                        idx={idx}
                        questionId={question.id}
                        answer={answer}
                        isCorrect={isAnswerCorrect(idx)}
                        isUserSelected={selectedAnswerIdxs?.includes(idx) ?? false}
                        explanation={question.explanations[idx]}
                        showFeedback={true}
                        onAnswerChange={() => {}}
                        disabled={true}
                        isAnswerChecked={() => selectedAnswerIdxs?.includes(idx) ?? false}
                    />
                ))}
            </ul>
            {question.questionExplanation && (
                <div className="row">
                    Question explanation:{'\u00A0'}
                    <QuestionExplanation text={question.questionExplanation} />
                </div>
            )}
            <br />
        </fieldset>
    )
}
