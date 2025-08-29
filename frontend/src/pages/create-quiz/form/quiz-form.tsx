import { SubmitButton } from 'pages/components/submit-button.tsx'
import { preventDefault } from 'helpers.ts'
import type { QuizFormData } from 'pages/create-quiz/form/quiz-form-data.ts'
import { CreatedQuizLink } from '../components'

interface QuizEditProps {
    readonly handleSubmit: () => void
    readonly quizData: QuizFormData
    readonly setQuizData: (data: QuizFormData) => void
    readonly linkToTakeQuiz: string
    readonly quizCreateError: string
}

export const QuizEditForm = ({
    handleSubmit,
    quizData,
    setQuizData,
    linkToTakeQuiz,
    quizCreateError,
}: QuizEditProps) => {
    return (
        <form id="quiz-create-form" onSubmit={preventDefault(handleSubmit)}>
            <div className="quiz-form-fields">
                <h1 id="quiz-page-title">Quiz</h1>
                <div className="form-group">
                    <label htmlFor="title-text">Title</label>
                    <input
                        id="title-text"
                        className="text"
                        type="text"
                        placeholder="Title"
                        value={quizData.title}
                        onChange={e => setQuizData({ ...quizData, title: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description-text">Description</label>
                    <textarea
                        id="description-text"
                        className="textarea"
                        rows={4}
                        placeholder="Description"
                        value={quizData.description}
                        onChange={e => setQuizData({ ...quizData, description: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="question-list-text">Question List</label>
                    <input
                        id="question-list-text"
                        className="text"
                        type="text"
                        placeholder="Question List"
                        value={quizData.questionList}
                        onChange={e => setQuizData({ ...quizData, questionList: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="pass-score-text">Pass Score</label>
                    <input
                        id="pass-score-text"
                        className="number"
                        type="number"
                        min={0}
                        max={100}
                        placeholder="Pass Score"
                        value={quizData.passScore}
                        onChange={e => setQuizData({ ...quizData, passScore: Number(e.target.value) })}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="time-limit-text">Time Limit</label>
                    <input
                        id="time-limit-text"
                        className="time"
                        type="number"
                        placeholder="Time Limit"
                        value={quizData.timeLimit}
                        onChange={e => setQuizData({ ...quizData, timeLimit: Number(e.target.value) })}
                    />
                </div>
                <div className="form-group">
                    <SubmitButton />
                </div>
                {quizCreateError && <div id="take-quiz-error">{quizCreateError}</div>}
                {linkToTakeQuiz && (
                    <>
                        <p>Your quiz has been created successfully!</p>
                        <CreatedQuizLink url={linkToTakeQuiz} />
                    </>
                )}
            </div>
        </form>
    )
}
