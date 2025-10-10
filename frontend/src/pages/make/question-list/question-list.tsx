import { Button, type WithOnClick } from 'pages/components/button'
import { useNavigate } from 'react-router-dom'
import copyClipboardIcon from 'assets/icons/copy-clipboard.svg'
import { QuestionItem } from './question-item'
import './question-list.scss'
import type { QuizQuestion } from 'model/quiz-question'
import type { QuestionList } from 'model/question-list'

interface QuestionListProps {
    readonly questionList: QuestionList
    readonly questions: readonly QuizQuestion[]
}

type EditQuestionButtonProps = { id: string; hash: string; onClick: () => void }
type TakeQuestionButtonProps = { id: string; hash: string; onClick: () => void }
type CopyQuestionButtonProps = { id: string; kind: string; hash: string; onClick: () => void }

export const CreateQuestionButton = ({ onClick }: WithOnClick) => (
    <Button id="create-question" onClick={onClick}>
        Create New Question
    </Button>
)

export const EditQuestionButton = ({ id, onClick }: EditQuestionButtonProps) => (
    <Button id={id} className="edit-question" onClick={onClick}>
        Edit
    </Button>
)

export const TakeQuestionButton = ({ id, onClick }: TakeQuestionButtonProps) => (
    <Button id={id} className="take-question" onClick={onClick}>
        Take
    </Button>
)

export const CopyQuestionButton = ({ id, kind, onClick }: CopyQuestionButtonProps) => (
    <Button id={id} className="copy-question" onClick={onClick}>
        <img
            id={`image${kind}${id}`}
            src={copyClipboardIcon}
            alt={`Copy the ${kind} url to clipboard`}
            title={`Copy the ${kind} url to clipboard`}
            style={{ width: '1em', height: '1em', verticalAlign: 'middle' }}
            onError={e => {
                e.currentTarget.style.display = 'none'
            }}
        />
    </Button>
)

export const CreateQuizButton = ({ onClick }: WithOnClick) => (
    <Button id="create-quiz" onClick={onClick} className="primary button">
        Create Quiz
    </Button>
)

export function QuestionListComponent({ questionList, questions }: QuestionListProps) {
    const navigate = useNavigate()

    const onCreateNewQuestion = () => {
        navigate(`/question/new?listguid=${questionList?.guid}`)
    }

    const onEditQuestion = (hash: string) => {
        navigate(`/question/${hash}/edit`)
    }

    const onTakeQuestion = (id: number) => {
        navigate(`/question/${id}`)
    }

    const onCopyTakeQuestion = async (id: number) => {
        const link = `${window.location.origin}/question/${id}`
        await navigator.clipboard.writeText(link)
    }

    const onCopyEditQuestion = async (hash: string) => {
        const link = `${window.location.origin}/question/${hash}/edit`
        try {
            await navigator.clipboard.writeText(link)
            window.alert('link copied')
        } catch (err) {
            window.alert('Failed to copy link')
        }
    }

    const onCreateQuiz = () => {
        navigate(`/quiz-create/new?listguid=${questionList.guid}`)
    }

    return (
        <div className="question-list-page">
            <h1 id="question-title-header" data-testid="question-list-title">
                {questionList.title}
            </h1>
            <div className="create-button">
                <CreateQuestionButton onClick={onCreateNewQuestion} />
            </div>
            <div className="question-holder">
                {questions.map((q, index) => (
                    <QuestionItem
                        key={q.id || index}
                        question={q}
                        index={index}
                        onEditQuestion={() => onEditQuestion(q.hash)}
                        onCopyEditQuestion={() => onCopyEditQuestion(q.hash)}
                        onTakeQuestion={() => onTakeQuestion(q.id)}
                        onCopyTakeQuestion={() => onCopyTakeQuestion(q.id)}
                    />
                ))}
            </div>
            <CreateQuizButton onClick={onCreateQuiz} />
        </div>
    )
}
