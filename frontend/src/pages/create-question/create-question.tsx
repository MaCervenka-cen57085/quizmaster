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
    title: string
    isEdit: boolean
    handleQuestionDelete: () => void
}

export function CreateQuestionForm({
    title,
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
            <h1 id="question-page-title">{title}</h1>
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
