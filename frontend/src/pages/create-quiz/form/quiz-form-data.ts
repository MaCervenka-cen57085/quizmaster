export interface QuizFormData {
    readonly title: string
    readonly description?: string
    readonly questionList?: string
    readonly passScore?: number
    readonly timeLimit?: number
}

export const emptyQuizFormData = (): QuizFormData => ({
    title: '',
    description: undefined,
    questionList: undefined,
    passScore: undefined,
    timeLimit: undefined,
})
