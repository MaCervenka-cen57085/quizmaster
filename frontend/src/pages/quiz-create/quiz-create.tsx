import { useSearchParams } from 'react-router-dom'
import { useApi } from 'api/hooks'
import { useState } from 'react'
import type { QuizQuestion } from 'model/quiz-question'
import { getListQuestions } from 'api/question-list'
import { postQuiz } from 'api/quiz'
import './createQiuz.scss'

export const QuizCreatePage = () => {
    const [searchParams] = useSearchParams()
    const listGuid = searchParams.get('listguid')
    const [questionList, setQuestionList] = useState<QuizQuestion[]>([])
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const [timeLimit, setTimeLimit] = useState<number>(600)
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

        const form = e.currentTarget
        const title = (form.querySelector<HTMLInputElement>('#quiz-title')?.value ?? '').trim()
        if (!title.length) {
            setFormError('Title is required')
            return
        }
        const description = (form.querySelector<HTMLTextAreaElement>('#quiz-description')?.value ?? '').trim()

        if (!description.length) {
            setFormError('Description is required')
            return
        }

        console.log(timeLimit, !timeLimit)

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
            passScore: 0,
        })

        setQuizId(quizId)
    }
    const handleChangeTimeLimit = (newValue: string) => {
        // Only allow positive integers or empty string
        if (/^[1-9]\d*$/.test(newValue) || newValue === '') {
            setTimeLimit(newValue as unknown as number)
        } else {
            setFormError('Time limit must be a number')
        }
    }

    return (
        <form className="create-quiz" onSubmit={handleCreateQuiz}>
            <h2>Create Quiz</h2>
            <label className="form-label">
                <div className="form-label__item">Quiz title</div>
                <input type="text" id="quiz-title" className="form-element" />
            </label>
            <label className="form-label">
                <div className="form-label__item">Quiz description</div>
                <textarea id="quiz-description" className="form-element" />
            </label>
            <label className="form-label">
                <div className="form-label__item">Time limit (in seconds)</div>
                <input
                    type="text"
                    id="time-limit"
                    value={timeLimit}
                    onChange={ev => handleChangeTimeLimit(ev.target.value)}
                    className="form-element"
                />
            </label>
            <div className="form-label__item">Select quiz questions</div>
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
                    Quiz url: <a href={`${location.origin}/quiz/${quizId}`}>{`${location.origin}/quiz/${quizId}`}</a>
                </div>
            )}
        </form>
    )
}
