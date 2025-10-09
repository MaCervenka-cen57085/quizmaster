import { expect } from '@playwright/test'
import { Given, When, Then } from '../fixture.ts'
import { openCreateQuestionListPage } from './ops.ts'
import type { QuizmasterWorld } from '../world'

const createQuestionList = async (world: QuizmasterWorld, title: string) => {
    world.createQuestionListPage.enterQuestionListName(title)
    await world.createQuestionListPage.submit()
}

Given('I start creating a question list', async function () {
    await openCreateQuestionListPage(this)
})

When('I enter question list name {string}', async function (name: string) {
    await this.createQuestionListPage.enterQuestionListName(name)
})

When('I submit the question list', async function () {
    await this.createQuestionListPage.submit()
})

When('I save the question list {string}', async function (questionListTitle: string) {
    await createQuestionList(this, questionListTitle)
    await this.questionListPage.waitForLoadedTitle()
})

Then('I see an error message on question list page stating title must be mandatory', async function () {
    const errorMessage = await this.createQuestionListPage.errorMessage()
    expect(errorMessage).not.toBe('')
})
