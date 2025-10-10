import './alert.scss'

type AlertType = 'success' | 'error' | 'info'

interface AlertProps {
    readonly type: AlertType
    readonly children: React.ReactNode
}

export const Alert = ({ type, children }: AlertProps) => <div className={`alert ${type}`}>{children}</div>
