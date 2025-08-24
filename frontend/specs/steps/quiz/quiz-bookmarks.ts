import { expect } from '@playwright/test'
import { When, Then } from '../fixture.ts'

Then('I see bookmarked question {string}', async function () {
    const indicator = this.quizQuestionPage.bookmarkIndicator()
    await indicator.waitFor({ state: 'attached' })
    await expect(indicator).toHaveClass(/bookmarked/)
})

When('I click bookmark {string}', async function (questionTitle: string) {
    await this.quizQuestionPage.clickBookmark(questionTitle)
})

When('I bookmark question {string}', async function (questionTitle: string) {
    await this.quizQuestionPage.clickAddQuestionToBookmark(questionTitle)
})

When('I remove bookmark {string}', async function (questionTitle: string) {
    // Klikne na bookmark toggle pro odebrání záložky
    await this.quizQuestionPage.clickAddQuestionToBookmark(questionTitle)
})

When('I delete bookmark {string}', async function (questionTitle: string) {
    await this.quizQuestionPage.deleteBookmark(questionTitle)
})

Then('I see bookmark link {string}', async function (questionTitle: string) {
    await expect(this.quizQuestionPage.bookmarkLink(questionTitle)).toBeVisible()
})

Then("I don't see bookmark link {string}", async function (questionTitle: string) {
    await expect(this.quizQuestionPage.bookmarkLink(questionTitle)).toBeHidden()
})
