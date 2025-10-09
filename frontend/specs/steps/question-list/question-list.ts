import { expect } from '@playwright/test'
import { expectTextToContain } from '../common.ts'
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
    expect(await this.questionListPage.questionCount()).toBe(0)
})

Then('I see question in list {string}', async function (question: string) {
    await expectTextToContain(this.page.getByText(question), question)
})

Then('I see question list title {string}', async function (title: string) {
    expect(await this.questionListPage.questionListNameValue()).toBe(title)
})

When('I take question {string} from the list', async function (question: string) {
    this.activeQuestionBookmark = question
    await this.questionListPage.takeQuestion(question)
})

When('I edit question {string} from the list', async function (question: string) {
    this.activeQuestionBookmark = question
    await this.questionListPage.editQuestion(question)
})

Then(/I copy the (take|edit) question URL "(.+)" from the list/, async function (page: string, question: string) {
    this.activeQuestionBookmark = question

    if (page === 'take') await this.questionListPage.copyTakeQuestion(question)
    else if (page === 'edit') await this.questionListPage.copyEditQuestion(question)
})
