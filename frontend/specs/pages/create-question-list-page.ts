import type { Page } from '@playwright/test'

export class CreateQuestionListPage {
    constructor(private page: Page) {}

    gotoNew = () => this.page.goto('/q-list/new')

    private questionListTitleLocator = () => this.page.locator('#question-list-title')
    enterQuestionListName = (title: string) => this.questionListTitleLocator().fill(title)
    questionListTitleValue = () => this.questionListTitleLocator().inputValue()

    submit = () => this.page.locator('button[type="submit"]').click()

    errorMessage = () => this.page.textContent('#error-message')
}
