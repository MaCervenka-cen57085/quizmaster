import type { Page } from '@playwright/test'

export class QuizCreatePage {
    constructor(private page: Page) {}

    gotoNew = () => this.page.goto('/quiz-create/new?listGuid=d64155ee-9fb9-47ad-9ac3-3befd1dfc0c4')
    questionsInList = () => this.page.locator('#question-list > .question')
    timeLimitInput = () => this.page.locator('#time-limit')
}
