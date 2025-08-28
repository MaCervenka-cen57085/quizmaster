export interface QuizFormData {
    readonly title: string
    readonly description?: string
}

export const emptyQuizFormData = (): QuizFormData => ({
    title: '',
    description: undefined,
})
