interface TitleEditProps {
    readonly title: string
    readonly setTitle: (title: string) => void
}

export const TitleEdit = ({ title, setTitle }: TitleEditProps) => (
    <>
        <label htmlFor="question-text">Enter list title:</label>
        <textarea
            id="question-list-title"
            data-testId="question-list-title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            rows={1}
        />
    </>
)
