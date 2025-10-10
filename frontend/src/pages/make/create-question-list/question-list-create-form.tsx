import { useState } from 'react'
import { preventDefault } from 'helpers.ts'
import { Field, SubmitButton, TextInput } from 'pages/components'

export interface QuestionListFormData {
    readonly title: string
}

interface QuestionListCreateProps {
    readonly onSubmit: (data: QuestionListFormData) => void
}

export const QuestionListCreateForm = ({ onSubmit }: QuestionListCreateProps) => {
    const [title, setTitle] = useState<string>('')

    const toFormData = (title: string): QuestionListFormData => ({ title })

    return (
        <form onSubmit={preventDefault(() => onSubmit(toFormData(title)))}>
            <Field label="Question List Title">
                <TextInput id="question-list-title" value={title} onChange={setTitle} />
            </Field>
            <div>
                <SubmitButton />
            </div>
        </form>
    )
}
