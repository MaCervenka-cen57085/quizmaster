import type { Page } from '@playwright/test'

export class QuizCreatePage {
    constructor(private page: Page) {}
    timeLimitInput = () => this.page.locator('#time-limit')
    passScoreInput = () => this.page.locator('#pass-score')
    questionsInList = () => this.page.locator('.create-quiz > .question-item')
    selectQuestion = (question: string) => this.page.locator('label', { hasText: question }).click()
    private submitLocator = () => this.page.locator('button[type="submit"]')
    submit = () => this.submitLocator().click()
    enterQuizName = (title: string) => this.page.locator('#quiz-title').fill(title)
    enterDescription = (description: string) => this.page.locator('#quiz-description').fill(description)
    private quizUrlLocator = () => this.page.locator('.alert.success a')
    takeQuiz = () => this.quizUrlLocator().click()
    errorMessageLocator = () => this.page.locator('.alert.error')
}
