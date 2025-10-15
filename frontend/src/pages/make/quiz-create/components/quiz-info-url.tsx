import { Alert } from 'pages/components'

interface QuizInfoUrlProps {
    readonly quizId: string
}

export const QuizInfoUrl = ({ quizId }: QuizInfoUrlProps) => {
    const url = `${location.origin}/quiz/${quizId}/stats`

    return (
        <Alert type="info">
            Quiz info url: <a href={url}>{url}</a>
        </Alert>
    )
}
