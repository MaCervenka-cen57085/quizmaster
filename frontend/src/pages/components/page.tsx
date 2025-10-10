import './page.scss'

interface PageProps {
    readonly title: string
    readonly children: React.ReactNode
}

export const Page = ({ title, children }: PageProps) => (
    <div className="page">
        <h1>{title}</h1>
        {children}
    </div>
)
