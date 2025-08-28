import './question.scss'

import type { QuizQuestion } from 'model/quiz-question'
import { AnswerFeedback } from 'pages/question-take'
import { QuestionExplanation } from 'pages/question-take'
import type { FC } from 'react'

interface QuestionProps {
    question: QuizQuestion
    isMultipleChoice: boolean
}

export const Question: FC<QuestionProps> = ({ question, isMultipleChoice }) => {
    const checkType = isMultipleChoice ? 'checkbox' : 'radio'

    const isAnswerCorrect = (idx: number) =>
        (question.correctAnswers.includes(idx) && question.userInput?.includes(idx)) ||
        (!question.correctAnswers.includes(idx) && !question.userInput?.includes(idx))

    return (
        <div key={question.id} id={`question-${question.id}`} className="">
            <strong id={`question-${question.id}-name`}>{question.question}</strong>
            <ul id={`question-${question.id}-answers`} style={{ width: '100%' }}>
                {question.answers.map((answer, idx) => (
                    <li
                        key={`answer-${answer}`}
                        id={`answers-${idx}-question-${question.id}`}
                        style={{ position: 'relative', width: '100%' }}
                    >
                        <div id={`answer-wrapper-${answer}`} className="answer-wrapper">
                            <span className="answer-label">
                                <input
                                    type={checkType}
                                    disabled
                                    id={`answers-${idx}-question-${question.id}-input`}
                                    value={answer}
                                    checked={question.userInput?.includes(idx)}
                                />
                                <span id={`answers-${idx}-question-${question.id}-label`}>{answer}</span>
                            </span>
                            <AnswerFeedback
                                isCorrect={isAnswerCorrect(idx)}
                                explanation={question.explanations[idx]}
                                isMultipleChoice={isMultipleChoice}
                                showFeedback={question.userInput !== undefined}
                                isUserSelected={question.userInput?.includes(idx) ?? false}
                                answer={answer}
                            />
                        </div>
                    </li>
                ))}
            </ul>
            {question.questionExplanation && (
                <div className="row">
                    Question explanation:{'\u00A0'}
                    <QuestionExplanation text={question.questionExplanation} />
                </div>
            )}
            <br />
        </div>
    )
}
