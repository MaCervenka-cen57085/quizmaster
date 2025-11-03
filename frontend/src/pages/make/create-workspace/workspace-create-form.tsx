import { useState } from 'react'
import { preventDefault } from 'helpers.ts'
import { Field, SubmitButton, TextInput } from 'pages/components'

export interface WorkspaceFormData {
    readonly title: string
}

interface WorkspaceCreateProps {
    readonly onSubmit: (data: WorkspaceFormData) => void
}

export const WorkspaceCreateForm = ({ onSubmit }: WorkspaceCreateProps) => {
    const [title, setTitle] = useState<string>('')

    const toFormData = (title: string): WorkspaceFormData => ({ title })

    return (
        <form onSubmit={preventDefault(() => onSubmit(toFormData(title)))}>
            <Field label="Workspace Title">
                <TextInput id="workspace-title" value={title} onChange={setTitle} />
            </Field>
            <div>
                <SubmitButton />
            </div>
        </form>
    )
}
