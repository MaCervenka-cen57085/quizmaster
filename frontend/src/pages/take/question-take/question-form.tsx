import './question-form.scss'
import type { AnswerIdxs, QuizQuestion } from 'model/quiz-question.ts'
import {
    Answer,
    useQuestionFeedbackState,
    useQuestionTakeState,
    QuestionCorrectness,
    QuestionExplanation,
} from 'pages/take/question-take'
import { QuestionScore } from './components/question-score'

export interface QuestionFormProps {
    readonly question: QuizQuestion
    readonly selectedAnswerIdxs?: AnswerIdxs
    readonly onSubmitted?: (selectedAnswerIdxs: AnswerIdxs) => void
    readonly afterEach: boolean
}

export const QuestionForm = (props: QuestionFormProps) => {
    const { correctAnswers, easyMode, answers, questionExplanation } = props.question

    const state = useQuestionTakeState(props)
    const feedback = useQuestionFeedbackState(state, props.question)

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (state.selectedAnswerIdxs.length > 0) {
            state.submit()
            props.onSubmitted?.(state.selectedAnswerIdxs)
        }
    }

    const isAnswerChecked = state.selectedAnswerIdxs.length > 0

    const correctAnswersCount = correctAnswers.length

    return (
        <form onSubmit={handleSubmit} id="question-form">
            <fieldset className="question-fieldset" name={`question-${props.question.id}`}>
                <legend>
                    <h1 id="question">{props.question.question}</h1>
                </legend>

                {easyMode && (
                    <div>
                        Correct answers count is{' '}
                        <strong className="correct-answers-count">{correctAnswersCount}</strong>
                    </div>
                )}

                <ul className="answers">
                    {answers.map((answer, idx) => (
                        <Answer
                            key={answer}
                            isMultipleChoice={state.isMultipleChoice}
                            idx={idx}
                            questionId={props.question.id}
                            answer={answer}
                            isCorrect={feedback.isAnswerCorrect(idx)}
                            isUserSelected={feedback.isUserSelected(idx)}
                            explanation={props.question.explanations ? props.question.explanations[idx] : 'not defined'}
                            showFeedback={state.submitted && feedback.showFeedback(idx) && props.afterEach}
                            onAnswerChange={state.onSelectedAnswerChange}
                            isAnswerChecked={state.isAnswerChecked}
                        />
                    ))}
                </ul>

                {!state.submitted && (
                    <input type="submit" value="Submit" className="submit-btn" disabled={!isAnswerChecked} />
                )}
                {state.submitted && props.afterEach && (
                    <>
                        <QuestionCorrectness
                            score={feedback.score.score}
                            errorCount={feedback.score.errorsCount}
                            isPartialCorrectnessEnabled={props.question.question.includes('(Partial Score)')}
                        />
                        <QuestionScore score={feedback.score.score} />
                        <QuestionExplanation text={questionExplanation} />
                    </>
                )}
            </fieldset>
        </form>
    )
}
