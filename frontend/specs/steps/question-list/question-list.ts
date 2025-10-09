import type { DataTable } from '@cucumber/cucumber'
import { expect, type Dialog } from '@playwright/test'
import { expectedNumberOfChildrenToBe, expectTextToBe, expectTextToContain, type TableOf } from '../common.ts'
import { Given, Then, When } from '../fixture.ts'
import type { AnswerRaw } from '../question/ops.ts'
import { createQuestionInList } from './ops.ts'
import type { QuizmasterWorld } from '../world'

const createQuestionToList = async (world: QuizmasterWorld, question: string) => {
    await world.questionListPage.createNewQuestion()
    await world.questionEditPage.enterQuestion(question)
    world.questionWip.question = question
    await world.questionEditPage.enterAnswer(0, 'Ne', true, '')
    world.questionWip.answers[0] = { answer: 'Ne', isCorrect: true, explanation: 'ne' }
    await world.questionEditPage.enterAnswer(1, 'Ano', false, '')
    world.questionWip.answers[1] = { answer: 'Ano', isCorrect: false, explanation: 'jo' }
    await world.questionEditPage.submit()
}

const createQuestionList = async (world: QuizmasterWorld, title: string) => {
    await world.questionListCreatePage.gotoNew()
    await world.questionListCreatePage.enterQuestionListName(title)
    await world.questionListCreatePage.submit()
}

Given('I saved the question list {string}', async function (questionListTitle: string) {
    await createQuestionList(this, questionListTitle)
})

When('I create new question to list {string}', async function (question: string) {
    await createQuestionToList(this, question)
})

When('I create questions within the list', async function (data: DataTable) {
    for (const row of data.rows()) {
        const [question, answers] = row
        const answerRawTable = {
            raw: () =>
                answers.split(',').map(a => {
                    const [answer, correct] = a.trim().split(' ')
                    return [answer, correct === '(*)' ? '*' : '', '']
                }),
        } as TableOf<AnswerRaw>

        await createQuestionInList(this, question, answerRawTable)
    }
})

Then('I see question {string} in the list', async function (question: string) {
    await expect(this.page.getByText(question)).toBeVisible()
})

When('I click {string} button', async function (buttonLabel: string) {
    await this.page.locator('button', { hasText: buttonLabel }).click()
})

Then('I see the {string} question list page', async function (name: string) {
    expect(await this.questionListPage.questionListNameValue()).toBe(name)
})

Then('I see a blank page', async function () {
    await expectedNumberOfChildrenToBe(this.page.getByTestId('question-holder'), 0)
})

Then('I see an empty question list', async function () {
    await expectedNumberOfChildrenToBe(this.page.getByTestId('question-holder'), 0)
})

Then('I see question in list {string}', async function (question: string) {
    await expectTextToContain(this.page.getByText(question), question)
    await expectedNumberOfChildrenToBe(this.page.locator('.edit-button'), 1)
})

Then('I see question list title {string}', async function (title: string) {
    await expectTextToBe(this.page.getByTestId('question-list-title'), title)
})

Then('I see {string} form', async function (title: string) {
    await expectTextToContain(this.page.getByText(title), title)
})

When('I take question {string} from the list', async function (question: string) {
    const takeButton = this.page.locator('.question-item', { hasText: question }).locator('.take-button button')
    this.activeQuestionBookmark = question
    await takeButton.click()
})

When('I edit question {string} from the list', async function (question: string) {
    const editButton = this.page.locator('.question-item', { hasText: question }).locator('.edit-button button')
    this.activeQuestionBookmark = question
    await editButton.click()
})

Then('I can copy the link to the take question {string}', async function (question: string) {
    const copyButton = this.page.locator('.question-item', { hasText: question }).locator('.copy-take-button button')
    await copyButton.click()
})

Then('I can copy the link to the edit question {string}', async function (question: string) {
    const copyButton = this.page.locator('.question-item', { hasText: question }).locator('.copy-edit-button button')
    await copyButton.click()
})

Then('I am notified about the copied link', async function () {
    this.page.once('dialog', async (dialog: Dialog) => {
        // You can check the alert message here
        expect(dialog.message()).toContain('Link copied') // or your expected message
        await dialog.accept()
    })
})

When('I add an existing question {string} to the list', async function (questionBookmark: string) {
    const question = this.questionBookmarks[questionBookmark]
    const questionId = question.url.split('/').at(-1)
    this.questionListPage.fillInQuestion(`${questionId}`)
    this.questionListPage.addExistingQuestion()
})

When('I add an invalid question to the list', async function () {
    await this.questionListPage.fillInQuestion('qsdhsqfhdshfdsq')
    await this.questionListPage.addExistingQuestion()
})

Then('I see an error message invalid question format', async function () {
    await expectTextToContain(this.questionListPage.errorMessageLabel(), 'Invalid question format')
})
