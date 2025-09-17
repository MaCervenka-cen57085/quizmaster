import type { Page } from '@playwright/test'

export class QuizCreatePage {
    constructor(private page: Page) {}
    createNewQuiz = () => this.page.locator('#create-quiz').click()
    timeLimitInput = () => this.page.locator('#time-limit')
    questionsInList = () => this.page.locator('#question-list > .question')
    selectQuestion = (id: string) => this.page.locator(`div#${id} label`).click()
}
