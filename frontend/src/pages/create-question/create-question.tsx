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
}: Props) {
    return (
        <div className="question-page">
            <h1 id="question-page-title">{title}</h1>
            <QuestionEditForm questionData={questionData} setQuestionData={setQuestionData} onSubmit={handleSubmit} />
            <ErrorMessages errorCodes={errors} />
            <QuestionLink url={linkToQuestion} />
            <QuestionEditLink editUrl={linkToEditQuestion} />
            <LoadedIndicator isLoaded={isLoaded} />
            <br />
            <p style={{ textAlign: 'right', fontSize: '11px' }} id="powered-by-label">
                Powered by Charles
            </p>
        </div>
    )
}
