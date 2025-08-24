export type QuizMode = 'learn' | 'exam' | ''

export interface Quiz {
    url: string
    title: string
    description: string
    mode: QuizMode
    passScore: string
}

export const emptyQuiz = (): Quiz => ({ url: '', title: '', description: '', mode: '', passScore: '' })
