import { useState } from 'react'

import { preventDefault, useStateArray } from 'helpers'
import type { QuizCreateRequest, QuizQuestion } from 'model/quiz-question.ts'

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
    const [selectedIds, toggleSelectedId] = useStateArray<number>([])
    const [timeLimit, setTimeLimit] = useState<number>(600)
    const [passScore, setPassScore] = useState<number>(80)

    const toFormData = (): QuizCreateFormData => ({
        title,
        description,
        questionIds: selectedIds,
        afterEach: false,
        passScore,
        timeLimit,
    })

    return (
        <form className="create-quiz" onSubmit={preventDefault(() => onSubmit(toFormData()))}>
            <Field label="Quiz title">
                <TextInput id="quiz-title" value={title} onChange={setTitle} />
            </Field>
            <Field label="Quiz description">
                <TextInput id="quiz-description" value={description} onChange={setDescription} />
            </Field>
            <Field label="Time limit (in seconds)">
                <NumberInput id="time-limit" value={timeLimit} onChange={setTimeLimit} />
            </Field>
            <Field label="Required score to pass the quiz (in %)">
                <NumberInput id="pass-score" value={passScore} onChange={setPassScore} />
            </Field>

            <div className="label">Select quiz questions</div>
            <QuestionSelect questions={questions} onSelect={toggleSelectedId} />

            <SubmitButton />
        </form>
    )
}
