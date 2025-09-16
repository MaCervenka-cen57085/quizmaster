export type AnswerIdxs = readonly number[]

export interface QuizQuestion {
    readonly id: number
    readonly hash: string
    readonly question: string
    readonly answers: string[]
    readonly explanations: string[]
    readonly questionExplanation: string
    readonly correctAnswers: AnswerIdxs
    readonly isDeletable?: boolean
    questionListGuid: string | null
    userInput?: AnswerIdxs
    easyMode: boolean
}

export interface Answers {
    readonly correctAnswers: AnswerIdxs
    readonly explanations: readonly string[]
    readonly questionExplanation: string
}

export interface Quiz {
    readonly id: number
    readonly title: string
    readonly description: string
    readonly questions: QuizQuestion[]
    readonly afterEach: boolean
    readonly passScore: number
    readonly timeLimit: number
}

export interface QuizCreateRequest {
    id: number
    title: string
    description: string
    questionIds: number[]
    afterEach: boolean
    passScore: number
    timeLimit: number
}

export interface QuizLinkRequest {
    listGuid: string
}

export const isAnsweredCorrectly = (selectedAnswerIdxs: AnswerIdxs, correctAnswers: AnswerIdxs): boolean => {
    if (selectedAnswerIdxs) {
        return (
            selectedAnswerIdxs.length === correctAnswers.length &&
            selectedAnswerIdxs.every(answerIndex => correctAnswers.includes(answerIndex))
        )
    }
    return false
}
