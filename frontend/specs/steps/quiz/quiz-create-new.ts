import { expect } from '@playwright/test'
import { expectedNumberOfChildrenToBe } from '../common.ts'
import { Then, When } from '../fixture.ts'

When('I start creating a new quiz', async function () {
    await this.questionListPage.createNewQuiz()
})

When('I enter quiz name {string}', async function (title: string) {
    await this.quizCreatePage.enterQuizName(title)
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
