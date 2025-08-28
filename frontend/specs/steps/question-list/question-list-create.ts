import { Given, When, Then } from '../fixture.ts'
import type { QuizmasterWorld } from '../world'
import { expect } from '@playwright/test'

const openCreateQuestionListPage = async (world: QuizmasterWorld) => {
    world.createQuestionListPage.gotoNew()
}

const createQuestionList = async (world: QuizmasterWorld, title: string) => {
    world.createQuestionListPage.enterQuestionListTitle(title)
    await world.createQuestionListPage.submit()
}

Given('I start creating question list', async function () {
    await openCreateQuestionListPage(this)
})

When('I save the question list {string}', async function (questionListTitle: string) {
    await createQuestionList(this, questionListTitle)
    await this.questionListPage.waitForLoadedTitle()
})

Then('I see an error message on question list page stating title must be mandatory', async function () {
    const errorMessage = await this.createQuestionListPage.errorMessage()
    expect(errorMessage).not.toBe('')
})
