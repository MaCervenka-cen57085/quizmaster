export interface QuestionListFormData {
    readonly title: string
}

export const emptyQuestionListFormData = (): QuestionListFormData => ({
    title: '',
})
