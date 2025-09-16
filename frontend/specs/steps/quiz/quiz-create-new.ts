import { expect } from '@playwright/test'
import { expectedNumberOfChildrenToBe } from '../common.ts'
import { Then, When } from '../fixture.ts'

When('I start creating a quiz', async function () {
    await this.quizCreatePage.gotoNew()
    // TODO await expect(page).toHaveURL('/quiz-create/new')
})

Then('I see question list with {int} available questions', async function (count: number) {
    await expectedNumberOfChildrenToBe(this.quizCreatePage.questionsInList(), count)
})

When('I select questions {string}', async (ids: string) => {
    const idsList = ids?.trim().split(',')
    expect(idsList).toBeTruthy
    // assert elements with id
})

Then('I submit new quiz', async () => {
    // TODO click on button submit
})
