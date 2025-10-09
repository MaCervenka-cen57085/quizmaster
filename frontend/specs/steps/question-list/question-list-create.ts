import { expect } from '@playwright/test'
import { Given, When, Then } from '../fixture.ts'
import { createQuestionList, openCreateQuestionListPage } from './ops.ts'

Given('I start creating a question list', async function () {
    await openCreateQuestionListPage(this)
})

Given('a question list {string}', async function (name: string) {
    await createQuestionList(this, name)
})

When('I enter question list name {string}', async function (name: string) {
    await this.questionListCreatePage.enterQuestionListName(name)
})

When('I submit the question list', async function () {
    await this.questionListCreatePage.submit()
})

Then('I see an error message on question list page stating title must be mandatory', async function () {
    const errorMessage = await this.questionListCreatePage.errorMessage()
    expect(errorMessage).not.toBe('')
})
