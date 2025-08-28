import { SubmitButton } from 'pages/components/submit-button.tsx'
import { preventDefault } from 'helpers.ts'
import type { QuizFormData } from 'pages/create-quiz/form/quiz-form-data.ts'

interface QuizEditProps {
    readonly onSubmit: () => void
    readonly quizData: QuizFormData
    readonly setQuizData: (data: QuizFormData) => void
}

export const QuizEditForm = ({ onSubmit, quizData, setQuizData }: QuizEditProps) => {
    return (
        <form id="quiz-create-form" onSubmit={preventDefault(onSubmit)}>
            <div>
                <h1 id="quiz-page-title">Quiz</h1>
                <input
                    id="title-text"
                    className="text"
                    type="text"
                    placeholder="Title"
                    value={quizData.title}
                    onChange={e => setQuizData({ ...quizData, title: e.target.value })}
                />
                <br />
                <textarea
                    id="description-text"
                    className="textarea"
                    rows={4}
                    placeholder="Description"
                    value={quizData.description}
                    onChange={e => setQuizData({ ...quizData, description: e.target.value })}
                />
                <br />
                <input
                    id="question-list-text"
                    className="text"
                    type="text"
                    placeholder="Question List"
                    value={quizData.questionList}
                    onChange={e => setQuizData({ ...quizData, questionList: e.target.value })}
                />
                <br />
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
                <br />
                <input
                    id="time-limit-text"
                    className="time"
                    type="number"
                    placeholder="Time Limit"
                    value={quizData.timeLimit}
                    onChange={e => setQuizData({ ...quizData, timeLimit: Number(e.target.value) })}
                />
                <br />
                <SubmitButton />
            </div>
        </form>
    )
}
