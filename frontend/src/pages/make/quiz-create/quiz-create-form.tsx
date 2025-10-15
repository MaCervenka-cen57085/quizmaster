import { useState } from 'react'

import { preventDefault, useStateSet } from 'helpers'
import type { QuizQuestion } from 'model/quiz-question.ts'
import type { QuizCreateRequest } from 'api/quiz.ts'

import { Field, NumberInput, SubmitButton, TextInput } from 'pages/components'
import { QuestionSelect } from './components/question-select.tsx'

export type QuizCreateFormData = QuizCreateRequest

interface QuizCreateProps {
    readonly questions: readonly QuizQuestion[]
    readonly onSubmit: (data: QuizCreateFormData) => void
}

export const QuizCreateForm = ({ questions, onSubmit }: QuizCreateProps) => {
    const [title, setTitle] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [selectedIds, toggleSelectedId] = useStateSet<number>()
    const [timeLimit, setTimeLimit] = useState<number>(600)
    const [passScore, setPassScore] = useState<number>(80)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const toFormData = (): QuizCreateFormData => ({
        title,
        description,
        questionIds: Array.from(selectedIds),
        afterEach: false,
        passScore,
        timeLimit,
    })

    return (
        <form
            className="create-quiz"
            onSubmit={preventDefault(() => {
                setIsSubmitted(true)
                onSubmit(toFormData())
            })}
        >
            <Field label="Quiz title" isSubmitted={isSubmitted} errorCode={!title ? 'titleRequired' : undefined}>
                <TextInput id="quiz-title" value={title} onChange={setTitle} />
            </Field>
            <Field
                label="Quiz description"
                isSubmitted={isSubmitted}
                errorCode={!description ? 'descriptionRequired' : undefined}
            >
                <TextInput id="quiz-description" value={description} onChange={setDescription} />
            </Field>
            <Field
                label="Time limit (in seconds)"
                isSubmitted={isSubmitted}
                errorCode={timeLimit < 0 ? 'negativeTimeLimit' : undefined}
            >
                <NumberInput id="time-limit" value={timeLimit} onChange={setTimeLimit} />
            </Field>
            <Field
                label="Required score to pass the quiz (in %)"
                isSubmitted={isSubmitted}
                errorCode={passScore > 100 ? 'scoreAboveMax' : undefined}
            >
                <NumberInput id="pass-score" value={passScore} onChange={setPassScore} />
            </Field>

            <div className="label">Select quiz questions</div>
            <QuestionSelect questions={questions} onSelect={toggleSelectedId} />

            <SubmitButton />
        </form>
    )
}
