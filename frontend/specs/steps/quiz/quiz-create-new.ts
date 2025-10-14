import { expect } from '@playwright/test'
import { expectedNumberOfChildrenToBe } from '../common.ts'
import { Then, When } from '../fixture.ts'

When('I start creating a new quiz', async function () {
    await this.questionListPage.createNewQuiz()
})

When('I enter quiz name {string}', async function (title: string) {
    await this.quizCreatePage.enterQuizName(title)
})

When('I see empty quiz title', async function () {
    await this.quizCreatePage.getQuizTitleValue().then(value => expect(value).toBe(''))
})

When('I see empty quiz description', async function () {
    await this.quizCreatePage.getQuizDescriptionValue().then(value => expect(value).toBe(''))
})

When('I see time limit 600 seconds', async function () {
    await this.quizCreatePage
        .timeLimitInput()
        .inputValue()
        .then(value => expect(value).toBe('600'))
})

When('I see pass score 80', async function () {
    await this.quizCreatePage
        .passScoreInput()
        .inputValue()
        .then(value => expect(value).toBe('80'))
})

When('I see quiz question {string}', async function (title: string) {
    await this.quizCreatePage
        .getQuestion(title)
        .first()
        .isVisible()
        .then(visible => expect(visible).toEqual(true))
})

When('I enter quiz description {string}', async function (title: string) {
    await this.quizCreatePage.enterDescription(title)
})

When('I select question {string}', async function (question: string) {
    await this.quizCreatePage.selectQuestion(question)
})

When('I submit the quiz', async function () {
    await this.quizCreatePage.submit()
})

When('I take the quiz', async function () {
    await this.quizCreatePage.takeQuiz()
})

Then('I see question list with {int} available questions', async function (count: number) {
    await expectedNumberOfChildrenToBe(this.quizCreatePage.questionsInList(), count)
})

Then('I see error message {string}', async function (message: string) {
    await expect(this.quizCreatePage.errorMessageLocator()).toContainText(message)
})
