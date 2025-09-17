import { expect } from '@playwright/test'
import { expectedNumberOfChildrenToBe } from '../common.ts'
import { Then, When } from '../fixture.ts'

When('I click on Create New Quiz', async function () {
    await this.quizCreatePage.createNewQuiz()
})

Then('I see question list with {int} available questions', async function (count: number) {
    await expectedNumberOfChildrenToBe(this.quizCreatePage.questionsInList(), count)
})

When('I select questions {string}', async function (ids: string) {
    const idsList = ids?.trim().split(',')
    expect(idsList).toBeTruthy
    for (const id of idsList) {
        this.quizCreatePage.selectQuestion(id)
    }
})

Then('I submit new quiz', async () => {
    // TODO click on button submit
})

Then('I see time limit set to {int} seconds', async function (timeLimit: number) {
    const value = await this.quizCreatePage.timeLimitInput().inputValue()
    expect(Number.parseInt(value)).toBe(timeLimit)
})
