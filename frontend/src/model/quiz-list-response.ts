export interface QuizListItem {
    id: number
    title: string
}

export interface QuizListResponse {
    readonly quizzes: QuizListItem[]
}
