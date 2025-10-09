import type { Page } from '@playwright/test'

export class QuestionListPage {
    constructor(private page: Page) {}

    goto = (guid: string) => this.page.goto(`/q-list/${guid}`)

    private questionListNameLocator = () => this.page.getByTestId('question-list-title')
    questionListNameValue = () => this.questionListNameLocator().textContent()

    createNewQuestion = async () => this.page.locator('#create-question').click()
    addExistingQuestion = async () => this.page.locator('#add-existing-question').click()
    fillInQuestion = async (question: string) => this.page.locator('#question-input-field').fill(question)
    errorMessageLabel = () => this.page.locator('#error-message-label')

    createNewQuiz = () => this.page.locator('#create-quiz').click()
}
