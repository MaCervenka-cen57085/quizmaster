interface CreatedQuizLinkProps {
    readonly url: string
}

export const CreatedQuizLink = ({ url }: CreatedQuizLinkProps) =>
    url && (
        <>
            <h3>Link to see the quiz:</h3>
            <a id="take-quiz-link" href={url}>
                {url}
            </a>
        </>
    )
