import { expect } from '@playwright/test'
import { Then, When } from '../fixture.ts'
import { enterPassScore, openCreatePage } from './ops.ts'

When('I start creating a quiz', async function () {
    await openCreatePage(this)
})

When('I attempt to save the quiz', async function () {
    await this.quizEditPage.clickSubmitButton()
})

When('I enter a pass score {int}', async function (passScore: number) {
    await enterPassScore(this, passScore)
})

When('the backend fails with error message {string}', async function (message: string) {
    await this.page.route('**/api/quiz-with-list', route => {
        route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({ message }),
        })
    })
})

// Field assertions

Then('I see empty title field', async function () {
    const title = await this.quizEditPage.titleValue()
    expect(title).toBe('')
})

Then('I see empty description field', async function () {
    const description = await this.quizEditPage.descriptionValue()
    expect(description).toBe('')
})

Then('I see empty question list field', async function () {
    const questionList = await this.quizEditPage.questionListValue()
    expect(questionList).toBe('')
})

Then('I see empty pass score field', async function () {
    const passScore = await this.quizEditPage.passScoreValue()
    expect(passScore).toBe('')
})

Then('I see empty time limit field', async function () {
    const timeLimit = await this.quizEditPage.timeLimitValue()
    expect(timeLimit).toBe('')
})

Then('I see the quiz submit button as active', async function () {
    const isSubmitButtonActive = await this.quizEditPage.isSubmitButtonActive()
    expect(isSubmitButtonActive).toBe(true)
})

Then('I see a link to the take quiz page', async function () {
    const takeQuizPageLink = this.quizEditPage.quizTakeLink()
    await expect(takeQuizPageLink).toContainText(/\/quiz\/\d+/)
    await expect(takeQuizPageLink).toBeVisible()
})

Then('I see the error message {string}', async function (message: string) {
    const errorMessage = this.quizEditPage.createQuizErrorMessage()
    await expect(errorMessage).toHaveText(message)
})
