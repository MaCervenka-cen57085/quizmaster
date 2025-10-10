import { useApi } from 'api/hooks'
import { getListQuestions } from 'api/question-list'
import { postQuiz } from 'api/quiz'
import type { QuizQuestion } from 'model/quiz-question'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import './createQiuz.scss'
import { Field, NumberInput, Page, SubmitButton, TextInput } from 'pages/components'
import { preventDefault } from 'helpers'
import { QuestionSelect } from './components/question-select'
import { QuizUrl } from './components/quiz-url'

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

    useApi(listGuid || '', getListQuestions, setQuestionList)

    const handleSelect = (id: number) => {
        setSelectedIds(prev => (prev.includes(id) ? prev.filter(prevId => prevId !== id) : [...prev, id]))
    }

    const handleCreateQuiz = preventDefault(async () => {
        const quizId = await postQuiz({
            title,
            description,
            timeLimit,
            questionIds: selectedIds,
            afterEach: false,
            passScore,
        })

        setQuizId(quizId)
    })

    return (
        <Page title="Create Quiz">
            <form className="create-quiz" onSubmit={handleCreateQuiz}>
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
                <QuestionSelect questions={questionList} onSelect={handleSelect} />

                {quizId ? <QuizUrl quizId={quizId} /> : <SubmitButton />}
            </form>
        </Page>
    )
}
