export interface WithOnClick {
    readonly onClick: () => void
}

interface ButtonProps extends WithOnClick {
    readonly id?: string
    readonly className?: string
    readonly type?: 'button' | 'submit'
    readonly children: React.ReactNode
    readonly disabled?: boolean
    readonly title?: string
    readonly dataTestId?: string
}

export const Button = ({ id, className, type = 'button', onClick, children, disabled, title, dataTestId }: ButtonProps) => (
    <button id={id} type={type} className={`${className}`} onClick={onClick} disabled={disabled} title={title} data-testid={dataTestId}>
        {children}
    </button>
)
