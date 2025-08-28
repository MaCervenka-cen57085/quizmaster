import './question-list.scss'
import { Button, type WithOnClick } from 'pages/components/button'
import { useParams, useNavigate } from 'react-router-dom'
import type { QuestionListData } from '.'
import { QuestionItem } from './question-item'

type Props = {
    questionListData?: QuestionListData
}

type EditQuestionButtonProps = { id: string; hash: string; onClick: () => void }

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

export const AddExistingQuestion = ({ onClick }: WithOnClick) => (
    <Button onClick={onClick}>Add Existing Question</Button>
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

    return questionListData ? (
        <div className="question-list-page">
            <h1 id="question-title-header" data-testid="question-list-title">
                {questionListData.title}
            </h1>
            <div className="create-button">
                <CreateQuestionButton onClick={onCreateNewQuestion} />
                <div style={{ marginLeft: '20px' }}>
                    <input placeholder="Enter question id" />
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
                    />
                ))}
            </div>
        </div>
    ) : null
}
