export interface Answer {
    answer: string
    isCorrect: boolean
    explanation: string
}

export interface Question {
    url: string
    editUrl: string
    question: string
    answers: Answer[]
    explanation: string
}

export const emptyQuestion = (): Question => ({ url: '', editUrl: '', question: '', answers: [], explanation: '' })
