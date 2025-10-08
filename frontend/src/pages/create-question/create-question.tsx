import './create-question.scss'

import { LoadedIndicator, QuestionEditLink, QuestionLink } from './components'
import { type QuestionFormData, QuestionEditForm } from './form'
import { type ErrorCodes, ErrorMessages } from './form/error-message'

type Props = {
    questionData: QuestionFormData
    setQuestionData: (data: QuestionFormData) => void
    handleSubmit: () => void
    readonly errors: ErrorCodes
    linkToQuestion: string
    linkToEditQuestion: string
    isLoaded: boolean
    isEdit: boolean
    handleQuestionDelete: () => void
}

export function CreateQuestionForm({
    errors,
    isLoaded,
    handleSubmit,
    linkToEditQuestion,
    linkToQuestion,
    questionData,
    setQuestionData,
    isEdit,
    handleQuestionDelete,
}: Props) {
    return (
        <div className="question-page">
            <QuestionEditForm
                questionData={questionData}
                setQuestionData={setQuestionData}
                onSubmit={handleSubmit}
                isEdit={isEdit}
                handleQuestionDelete={handleQuestionDelete}
            />
            <ErrorMessages errorCodes={errors} />
            <QuestionLink url={linkToQuestion} />
            <QuestionEditLink editUrl={linkToEditQuestion} />
            <LoadedIndicator isLoaded={isLoaded} />
        </div>
    )
}
