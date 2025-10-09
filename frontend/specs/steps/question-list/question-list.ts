import { expect } from '@playwright/test'
import { expectedNumberOfChildrenToBe, expectTextToBe, expectTextToContain } from '../common.ts'
import { Given, Then, When } from '../fixture.ts'
import type { QuizmasterWorld } from '../world'

const createQuestionList = async (world: QuizmasterWorld, title: string) => {
    await world.questionListCreatePage.gotoNew()
    await world.questionListCreatePage.enterQuestionListName(title)
    await world.questionListCreatePage.submit()
}

Given('I saved the question list {string}', async function (questionListTitle: string) {
    await createQuestionList(this, questionListTitle)
})

Then('I see the {string} question list page', async function (name: string) {
    expect(await this.questionListPage.questionListNameValue()).toBe(name)
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

Then(/I copy the (take|edit) question URL "(.+)" from the list/, async function (page: string, question: string) {
    const copyButton = this.page.locator('.question-item', { hasText: question }).locator(`.copy-${page}-button button`)
    this.activeQuestionBookmark = question
    await copyButton.click()
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
