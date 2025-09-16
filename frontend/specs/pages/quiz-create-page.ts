import type { Page } from '@playwright/test'

export class QuizCreatePage {
    constructor(private page: Page) {}

    gotoNew = () => this.page.goto('/quiz-create/new')

    //private questionListLocator = () => this.page.locator('#question-list')
}
