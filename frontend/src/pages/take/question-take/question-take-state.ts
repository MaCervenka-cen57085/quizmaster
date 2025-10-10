import { useState, useEffect } from 'react'
import type { AnswerIdxs } from 'model/quiz-question'
import type { QuestionFormProps } from './question-form'

export interface QuestionTakeState {
    readonly isMultipleChoice: boolean
    readonly selectedAnswerIdxs: AnswerIdxs
    readonly submitted: boolean
    readonly submit: () => void
    readonly onSelectedAnswerChange: (idx: number, selected: boolean) => void
    readonly isAnswerChecked: (idx: number) => boolean
}

export const useQuestionTakeState = (props: QuestionFormProps): QuestionTakeState => {
    const question = props.question
    const isMultipleChoice = question.correctAnswers.length > 1

    const [selectedAnswerIdxs, setSelectedAnswerIdxs] = useState<AnswerIdxs>([])

    const setSelectedAnswerIdx = (idx: number) => setSelectedAnswerIdxs([idx])
    const addSelectedAnswerIdx = (idx: number) => setSelectedAnswerIdxs(prev => [...prev, idx])
    const removeSelectedAnswerIdx = (idx: number) => setSelectedAnswerIdxs(prev => prev.filter(i => i !== idx))

    const [submitted, setSubmitted] = useState(false)

    useEffect(() => {
        if (props.question.userInput && props.question.userInput.length > 0)
            setSelectedAnswerIdxs(props.question.userInput)
    }, [props.question.userInput])

    const submit = () => setSubmitted(true)

    const onSelectedAnswerChange = (idx: number, selected: boolean) => {
        setSubmitted(false)
        if (!isMultipleChoice) setSelectedAnswerIdx(idx)
        else if (selected) addSelectedAnswerIdx(idx)
        else removeSelectedAnswerIdx(idx)
    }

    const isAnswerChecked = (idx: number) => {
        return selectedAnswerIdxs.includes(idx)
    }

    return {
        isMultipleChoice,
        selectedAnswerIdxs,
        submitted,
        submit,
        onSelectedAnswerChange,
        isAnswerChecked,
    }
}
