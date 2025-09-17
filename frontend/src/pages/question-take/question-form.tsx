import './question-form.scss'
import type { AnswerIdxs, QuizQuestion } from 'model/quiz-question.ts'
import {
    Answer,
    useQuestionFeedbackState,
    useQuestionTakeState,
    QuestionCorrectness,
    QuestionExplanation,
} from 'pages/question-take'
import { QuestionScore } from './components/question-score'

export interface QuestionFormProps {
    readonly question: QuizQuestion
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
            <h1 id="question">{props.question.question}</h1>

            {FEATURE_FLAG_ENABLED && easyMode && (
                <div>
                    Correct answers count is <span className="correct-answers-count">{correctAnswersCount}</span>
                </div>
            )}

            <ul className="answers">
                {answers.map((answer, idx) => (
                    <Answer
                        key={answer}
                        isMultipleChoice={state.isMultipleChoice}
                        idx={idx}
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
                    <QuestionCorrectness isCorrect={feedback.isQuestionCorrect} />
                    <QuestionScore score={feedback.score} />
                    <QuestionExplanation text={questionExplanation} />
                </>
            )}
        </form>
    )
}
