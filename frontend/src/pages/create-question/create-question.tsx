import './create-question.scss'

import { ErrorMessage, LoadedIndicator, QuestionEditLink, QuestionLink } from './components'
import { type QuestionFormData, QuestionEditForm } from './form'
import { type ErrorCodes, ErrorMessages } from './form/error-message'

type Props = {
    questionData: QuestionFormData
    setQuestionData: (data: QuestionFormData) => void
    handleSubmit: () => void
    errorMessage: string
    readonly errors: ErrorCodes
    linkToQuestion: string
    linkToEditQuestion: string
    isLoaded: boolean
}

export function CreateQuestionForm({
    errorMessage,
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
            <h1>Quiz Question Creation Page</h1>
            <h2>If you're happy and you know it create the question</h2>
            <QuestionEditForm questionData={questionData} setQuestionData={setQuestionData} onSubmit={handleSubmit} />
            <ErrorMessage errorMessage={errorMessage} />
            <ErrorMessages errorCodes={errors} />
            <QuestionLink url={linkToQuestion} />
            <QuestionEditLink editUrl={linkToEditQuestion} />
            <LoadedIndicator isLoaded={isLoaded} />
            <br />
            <p style={{ textAlign: 'right', fontSize: '11px' }}>Powered by MFČR</p>
        </div>
    )
}
