import './question-list.scss'
import { Button, type WithOnClick } from 'pages/components/button'
import { useParams, useNavigate } from 'react-router-dom'
import type { QuestionListData } from '.'
import { QuestionItem } from './question-item'
import { useState } from 'react'
import { linkQuestionToList } from 'api/quiz-question'

type Props = {
    questionListData?: QuestionListData
    onRefresh?: () => Promise<void>
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
        <img src={require('../../assets/icons/copy-clipboard.svg')} alt="Copy take url to clipboard" style={{ width: '1em', height: '1em', marginRight: '0.5em', verticalAlign: 'middle' }} />
    </Button>
)

export const AddExistingQuestion = ({ onClick }: WithOnClick) => (
    <Button id="add-existing-question" onClick={onClick}>
        Add Existing Question
    </Button>
)

export function QuestionList({ questionListData, onRefresh }: Props) {
    const params = useParams()
    const navigate = useNavigate()
    const [questionId, setQuestionId] = useState<string | undefined>()

    const questionListId = `${params.id}`

    const onCreateNewQuestion = () => {
        navigate(`/question/new?listguid=${questionListId}`)
    }

    const onEditQuestion = (hash: string) => {
        navigate(`/question/${hash}/edit`)
    }

    const onTakeQuestion = (id: number) => {
        navigate(`/question/${id}`)
    }

    const onCopyTakeQuestion = async (id: number) => {
        const link = `${window.location.origin}/question/${id}`
        try {
            await navigator.clipboard.writeText(link)
            window.alert('link copied')
        } catch (err) {
            window.alert('Failed to copy link')
        }
    }
    const onAddExistingQuestion = async () => {
        if (questionId) {
            console.log(`Adding existing question with id: ${questionId}, question list id: ${questionListId}`)
            if (!questionListId) {
                alert('Question list id is missing')
                return
            }
            const result = await linkQuestionToList(Number.parseInt(questionId), questionListId)
            if (result) {
                // Refresh the question list to show the newly added question
                if (onRefresh) {
                    await onRefresh()
                }
                // Clear the input field
                setQuestionId('')
            } else {
                alert(`Failed to add question with id: ${questionId} to list: ${questionListId}`)
            }
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
                    <input
                        value={questionId}
                        onChange={e => setQuestionId(e.target.value)}
                        id="question-input-field"
                        placeholder="Enter question id"
                    />
                    <AddExistingQuestion onClick={onAddExistingQuestion} />
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
                        onCopyTakeQuestion={() => onCopyTakeQuestion(q.id)}
                    />
                ))}
            </div>
        </div>
    ) : null
}
