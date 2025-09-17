import type { Page } from '@playwright/test'

export class QuizCreatePage {
    constructor(private page: Page) {}
    createNewQuiz = () => this.page.locator('#create-quiz').click()
    timeLimitInput = () => this.page.locator('#time-limit')
    questionsInList = () => this.page.locator('.create-quiz > .question-item')
    selectQuestion = (question: string) => this.page.locator('label', { hasText: question }).click()
}
