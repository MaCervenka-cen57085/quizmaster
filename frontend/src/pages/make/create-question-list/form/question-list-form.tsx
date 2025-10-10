import { SubmitButton } from 'pages/components'
import { preventDefault } from 'helpers.ts'
import { type QuestionListFormData, TitleEdit } from 'pages/make/create-question-list/form'

interface QuestionListEditProps {
    readonly questionListData: QuestionListFormData
    readonly setQuestionListData: (questionData: QuestionListFormData) => void
    readonly onSubmit: () => void
}

export const QuestionListEditForm = ({ questionListData, setQuestionListData, onSubmit }: QuestionListEditProps) => {
    const setTitle = (title: string) => setQuestionListData({ ...questionListData, title })
    return (
        <form id="question-list-create-form" onSubmit={preventDefault(onSubmit)}>
            <TitleEdit title={questionListData.title} setTitle={setTitle} />
            <div>
                <SubmitButton />
            </div>
        </form>
    )
}
