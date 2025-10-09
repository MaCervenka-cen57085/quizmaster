import { useApi } from 'api/hooks'
import { getListQuestions } from 'api/question-list'
import { postQuiz } from 'api/quiz'
import type { QuizQuestion } from 'model/quiz-question'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import './createQiuz.scss'
import { Field, NumberInput, Page, TextInput } from 'pages/components'

export const QuizCreatePage = () => {
    const [searchParams] = useSearchParams()
    const listGuid = searchParams.get('listguid')
    const [title, setTitle] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [questionList, setQuestionList] = useState<readonly QuizQuestion[]>([])
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const [timeLimit, setTimeLimit] = useState<number>(600)
    const [passScore, setPassScore] = useState<number>(80)
    const [quizId, setQuizId] = useState<string | undefined>(undefined)
    const [formError, setFormError] = useState<string | undefined>(undefined)

    useApi(listGuid || '', getListQuestions, setQuestionList)

    const handleSelect = (id: number) => {
        setFormError(undefined)
        setSelectedIds(prev => (prev.includes(id) ? prev.filter(prevId => prevId !== id) : [...prev, id]))
    }

    const handleCreateQuiz = async (e: React.FormEvent<HTMLFormElement>) => {
        setFormError(undefined)
        e.preventDefault()

        if (!title.length) {
            setFormError('Title is required')
            return
        }
        if (!description.length) {
            setFormError('Description is required')
            return
        }

        if (!timeLimit) {
            setFormError('Time limit is required')
            return
        }

        if (selectedIds.length < 2) {
            setFormError('Select at least 2 questions')
            return
        }

        const quizId = await postQuiz({
            title,
            description,
            timeLimit,
            questionIds: selectedIds,
            afterEach: false,
            passScore,
        })

        setQuizId(quizId)
    }

    return (
        <Page>
            <form className="create-quiz" onSubmit={handleCreateQuiz}>
                <h2>Create Quiz</h2>
                <Field label="Quiz title">
                    <TextInput id="quiz-title" value={title} onChange={setTitle} />
                </Field>
                <Field label="Quiz description">
                    <TextInput id="quiz-description" value={description} onChange={setDescription} />
                </Field>
                <Field label="Time limit (in seconds)">
                    <NumberInput id="time-limit" value={timeLimit} onChange={setTimeLimit} />
                </Field>
                <Field label="Required score to pass the quiz (in %)">
                    <NumberInput id="pass-score" value={passScore} onChange={setPassScore} />
                </Field>
                <div className="label">Select quiz questions</div>
                {questionList.map(item => (
                    <div key={item.id} className="question-item">
                        <input id={String(item.id)} type="checkbox" onChange={() => handleSelect(item.id)} />
                        <label htmlFor={String(item.id)}>{item.question}</label>
                    </div>
                ))}
                {formError && <div className="alert error">{formError}</div>}

                {!quizId && <button type="submit">Create quiz</button>}

                {quizId && (
                    <div className="alert success">
                        Quiz url:{' '}
                        <a href={`${location.origin}/quiz/${quizId}`}>{`${location.origin}/quiz/${quizId}`}</a>
                    </div>
                )}
            </form>
        </Page>
    )
}
