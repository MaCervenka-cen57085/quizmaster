import { Given, When } from '../fixture.ts'
import type { QuizmasterWorld } from '../world/world.ts'

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
})
