import { expect, type Dialog } from '@playwright/test'
import { expectedNumberOfChildrenToBe, expectTextToBe, expectTextToContain } from '../common.ts'
import { Given, When, Then } from '../fixture.ts'
import type { QuizmasterWorld } from '../world'

const openQuestionList = async (world: QuizmasterWorld, guid: string) => {
    await world.questionListPage.goto(guid)
    world.questionListWipGuid = guid
}

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
    await world.createQuestionListPage.gotoNew()
    await world.createQuestionListPage.enterQuestionListTitle(title)
    await world.createQuestionListPage.submit()
}

Given('I open question list {string}', async function (guid: string) {
    await openQuestionList(this, guid)
})

Given('I saved the question list {string}', async function (questionListTitle: string) {
    await createQuestionList(this, questionListTitle)
})

When('I create new question to list {string}', async function (question: string) {
    await createQuestionToList(this, question)
})

When('I click {string} button', async function (buttonLabel: string) {
    await this.page.locator('button', { hasText: buttonLabel }).click()
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

When('I click Edit button for question {string}', async function (question: string) {
    await this.questionEditPage.waitForEditButton()
    const editButton = this.page.locator('.question-item', { hasText: question }).locator('.edit-button button')
    await editButton.click()
    await this.questionEditPage.waitForLoadedTitle()
})

Then('I see {string} editable form', async function (title: string) {
    await expectTextToBe(this.page.locator('#question-text'), title)
})

Then('I can take the quiz for question {string}', async function name(question: string) {
    const takeButton = this.page.locator('.question-item', { hasText: question }).locator('.take-button button')
    await takeButton.click()
    await this.takeQuestionPage.waitForLoaded()

    await expectTextToBe(this.page.locator('#question'), question)
})

Then('I can copy the link to question {string}', async function (question: string) {
    const copyButton = this.page.locator('.question-item', { hasText: question }).locator('.copy-button button')
    await copyButton.click()

    this.page.once('dialog', async (dialog: Dialog) => {
        // You can check the alert message here
        expect(dialog.message()).toContain('Link copied') // or your expected message
        await dialog.accept()
    })
})

When('I add an existing question {string} to the list', async function (question: string) {
    this.questionListPage.fillInQuestion(question)
    this.questionListPage.addExistingQuestion()
})
