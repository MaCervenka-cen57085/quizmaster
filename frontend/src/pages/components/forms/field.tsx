import './field.scss'

interface FieldProps {
    readonly label: string
    readonly children: React.ReactNode
}

export const Field = ({ label, children }: FieldProps) => (
    <label className="field">
        <div className="label">{label}</div>
        {children}
    </label>
)
