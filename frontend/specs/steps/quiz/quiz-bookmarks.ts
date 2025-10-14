import { expect } from '@playwright/test'
import { When, Then } from '../fixture.ts'

Then('I see bookmarked question {string}', async function () {
    expect(await this.quizQuestionPage.isCurrentQuestionBookmarked()).toBe(true)
})

When('I click bookmark {string}', async function (questionTitle: string) {
    await this.quizQuestionPage.gotoBookmark(questionTitle)
})

When('I bookmark question {string}', async function () {
    await this.quizQuestionPage.bookmark()
})

When('I delete bookmark {string}', async function (questionTitle: string) {
    await this.quizQuestionPage.unBookmark(questionTitle)
})

Then('I see bookmark link {string}', async function (questionTitle: string) {
    await expect(this.quizQuestionPage.bookmarkListLocator(questionTitle)).toBeVisible()
})

Then("I don't see bookmark link {string}", async function (questionTitle: string) {
    await expect(this.quizQuestionPage.bookmarkListLocator(questionTitle)).toBeHidden()
})
