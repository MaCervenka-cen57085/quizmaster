import './question-list.scss'
import { Button, type WithOnClick } from 'pages/components/button'
import { useParams, useNavigate } from 'react-router-dom'
import type { QuestionListData } from '.'
import { QuestionItem } from './question-item'

type Props = {
    questionListData?: QuestionListData
}

type EditQuestionButtonProps = { id: string; hash: string; onClick: () => void }
type TakeQuestionButtonProps = { id: string; hash: string; onClick: () => void }
type CopyQuestionButtonProps = { id: string; hash: string; onClick: () => void }

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

export const CopyQuestionButton = ({ id, onClick }: CopyQuestionButtonProps) => (
    <Button id={id} className="copy-question" onClick={onClick}>
        Copy to clipboard
    </Button>
)

export const AddExistingQuestion = ({ onClick }: WithOnClick) => (
    <Button id="add-existing-question" onClick={onClick}>
        Add Existing Question
    </Button>
)

export function QuestionList({ questionListData }: Props) {
    const params = useParams()
    const navigate = useNavigate()

    const questionListId = params.id

    const onCreateNewQuestion = () => {
        navigate(`/question/new?listguid=${questionListId}`)
    }

    const onEditQuestion = (hash: string) => {
        navigate(`/question/${hash}/edit`)
    }

    const onTakeQuestion = (id: number) => {
        navigate(`/question/${id}`)
    }

    const onCopyQuestion = async (id: number) => {
        const link = `${window.location.origin}/question/${id}`;
        try {
            await navigator.clipboard.writeText(link);
            window.alert('link copied');
        } catch (err) {
            window.alert('Failed to copy link');
        }
    }

    return questionListData ? (
        <div className="question-list-page">
            <h1 id="question-title-header" data-testid="question-list-title">
                {questionListData.title}
            </h1>
            <div className="create-button">
                <CreateQuestionButton onClick={onCreateNewQuestion} />
                <div style={{ marginLeft: '20px' }}>
                    <input id="question-input-field" placeholder="Enter question id" />
                    <AddExistingQuestion onClick={() => console.log('Button clicked')} />
                </div>
            </div>
            <div className="question-holder">
                {questionListData.questions.map((q, index) => (
                    <QuestionItem
                        key={q.id || index}
                        question={q}
                        index={index}
                        onEditQuestion={() => onEditQuestion(q.hash)}
                        onTakeQuestion={() => onTakeQuestion(q.id)}
                        onCopyQuestion={() => onCopyQuestion(q.id)}
                    />
                ))}
            </div>
        </div>
    ) : null
}
