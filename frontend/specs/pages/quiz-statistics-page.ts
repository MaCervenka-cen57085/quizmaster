import type { Page } from '@playwright/test'

export class QuizStatisticsPage {
    constructor(private page: Page) {}

    header = () => this.page.locator('h2').textContent()
    name = () => this.page.locator('h3#quiz-name').textContent()
    description = () => this.page.locator('p#quiz-description').textContent()
    timesTaken = async () => Number.parseInt((await this.page.locator('span#times-taken').textContent()) ?? '')
    timesFinished = async () => Number.parseInt((await this.page.locator('span#times-finished').textContent()) ?? '')
    averageScore = async () => Number.parseInt((await this.page.locator('span#average-score').textContent()) ?? '')
}
