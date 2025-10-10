import './create-question-list.scss'

import { ErrorMessage } from './components'
import { type QuestionListFormData, QuestionListEditForm } from './form'

type Props = {
    questionListData: QuestionListFormData
    setQuestionListData: (data: QuestionListFormData) => void
    handleSubmit: () => void
    errorMessage: string
}

export function CreateQuestionListForm({ errorMessage, handleSubmit, questionListData, setQuestionListData }: Props) {
    return (
        <div className="question-list-page">
            <h1>Create Question List</h1>
            <QuestionListEditForm
                questionListData={questionListData}
                setQuestionListData={setQuestionListData}
                onSubmit={handleSubmit}
            />
            <ErrorMessage errorMessage={errorMessage} />
        </div>
    )
}
