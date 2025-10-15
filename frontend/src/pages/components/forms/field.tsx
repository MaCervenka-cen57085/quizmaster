import './field.scss'
import { FormFieldError, type FormFieldErrorCode } from './form-field-error'

interface FieldProps {
    readonly label: string
    readonly children: React.ReactNode
    readonly isSubmitted?: boolean
    readonly errorCode?: FormFieldErrorCode
}

export const Field = ({ label, children, errorCode, isSubmitted = false }: FieldProps) => (
    <label className="field">
        <div className="label">{label}</div>
        {children}
        {isSubmitted && errorCode && <FormFieldError errorCode={errorCode} />}
    </label>
)
