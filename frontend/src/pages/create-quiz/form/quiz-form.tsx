import { SubmitButton } from 'pages/components/submit-button.tsx'
import { preventDefault } from 'helpers.ts'
import type { QuizFormData } from 'pages/create-quiz/form/quiz-form-data.ts'

interface QuizEditProps {
    readonly onSubmit: () => void
    readonly quizData: QuizFormData
    readonly setQuizData: (quizData: QuizFormData) => void
}

export const QuizEditForm = ({ onSubmit }: QuizEditProps) => {
    return (
        <form id="quiz-create-form" onSubmit={preventDefault(onSubmit)}>
            <div>
                <SubmitButton />
            </div>
        </form>
    )
}
