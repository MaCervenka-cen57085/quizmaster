import './page.scss'

interface PageProps {
    readonly children: React.ReactNode
}

export const Page = ({ children }: PageProps) => <div className="page">{children}</div>
