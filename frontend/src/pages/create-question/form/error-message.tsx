export type ErrorCode = 'empty-question' | 'empty-answer' | 'no-correct-answer'

export type ErrorCodes = ReadonlySet<ErrorCode>

export const errorMessage: Record<ErrorCode, string> = {
    'empty-question': 'Question must not be empty.',
    'empty-answer': 'Answers must not be empty.',
    'no-correct-answer': 'At least one correct answer must be selected.',
}

interface ErrorMessageProps {
    readonly errorCode: ErrorCode
}

export const ErrorMessage = ({ errorCode }: ErrorMessageProps) =>
    errorMessage[errorCode] && <span className={`error ${errorCode}`}>{errorMessage[errorCode]}</span>

interface ErrorMessagesProps {
    readonly errorCodes: ErrorCodes
}

export const ErrorMessages = ({ errorCodes }: ErrorMessagesProps) =>
    errorCodes.size > 0 && (
        <ul className="errors">
            {Array.from(errorCodes).map(errorCode => (
                <li key={errorCode}>
                    <ErrorMessage errorCode={errorCode} />
                </li>
            ))}
        </ul>
    )
