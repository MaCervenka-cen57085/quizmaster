import type { Page } from '@playwright/test'

export class QuestionListPage {
    constructor(private page: Page) {}

    goto = (guid: string) => this.page.goto(`/q-list/${guid}`)

    private questionListTitleLocator = () => this.page.locator('#question-list-title')
    enterQuestionListTitle = (title: string) => this.questionListTitleLocator().fill(title)
    questionListTitleValue = () => this.questionListTitleLocator().inputValue()

    waitForLoadedTitle = () => this.page.waitForSelector('#question-list-title')

    createNewQuestion = async () => this.page.locator('#create-question').click()
    addExistingQuestion = async () => this.page.locator('#add-existing-question').click()
    fillInQuestion = async (question: string) => this.page.locator('#question-input-field').fill(question)
}
