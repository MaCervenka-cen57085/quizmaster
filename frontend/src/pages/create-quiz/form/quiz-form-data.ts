export interface QuizFormData {
    readonly title: string
}

export const emptyQuizFormData = (): QuizFormData => ({
    title: '',
})
