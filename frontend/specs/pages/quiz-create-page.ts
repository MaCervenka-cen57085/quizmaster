import type { Page } from '@playwright/test'

export class QuizCreatePage {
    constructor(private page: Page) {}
    createNewQuiz = () => this.page.locator('#create-quiz').click()
    timeLimitInput = () => this.page.locator('#time-limit')
    questionsInList = () => this.page.locator('.create-quiz > .question-item')
    selectQuestion = (question: string) => this.page.locator('label', { hasText: question }).click()

    submitNewQuizLocator = () => this.page.locator('button[type="submit"]')
    submitNewQuiz = () => this.submitNewQuizLocator().click()

    fillTitle = (title: string) => this.page.locator('#quiz-title').fill(title)
    fillDescription = (description: string) => this.page.locator('#quiz-description').fill(description)

    quizUrlLocator = () => this.page.locator('.alert.success a')
}
