export interface Quiz {
    url: string
    title: string
    description: string
    mode: string
    passScore: string
}

export const emptyQuiz = (): Quiz => ({ url: '', title: '', description: '', mode: '', passScore: '' })
