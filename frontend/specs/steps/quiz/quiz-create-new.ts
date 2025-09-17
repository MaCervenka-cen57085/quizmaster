import { expect } from '@playwright/test'
import { expectedNumberOfChildrenToBe } from '../common.ts'
import { Then, When } from '../fixture.ts'

When('I click on Create New Quiz', async function () {
    await this.quizCreatePage.createNewQuiz()
})

Then('I see question list with {int} available questions', async function (count: number) {
    await expectedNumberOfChildrenToBe(this.quizCreatePage.questionsInList(), count)
})

When('I select question {string}', async function (questionBookmark: string) {
    const questionText = this.questionBookmarks[questionBookmark].question
    await this.quizCreatePage.selectQuestion(questionText)
})

Then('I submit new quiz', async () => {
    // TODO click on button submit
})

Then('I see time limit set to {int} seconds', async function (timeLimit: number) {
    const value = await this.quizCreatePage.timeLimitInput().inputValue()
    expect(Number.parseInt(value)).toBe(timeLimit)
})
