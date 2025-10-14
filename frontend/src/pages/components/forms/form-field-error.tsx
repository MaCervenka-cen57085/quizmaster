import { FC } from 'react'
import { Alert } from '../alert'

const errorMessages = {
    required: 'This field is required.',
}

export type FormFieldErrorCode = keyof typeof errorMessages
interface FormFieldErrorProps {
    errorCode: FormFieldErrorCode
}

export const FormFieldError: FC<FormFieldErrorProps> = ({ errorCode }) => {
    return (
        <Alert type="error" dataTestId={errorCode}>
            {errorMessages[errorCode]}
        </Alert>
    )
}
