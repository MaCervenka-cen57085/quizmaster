import { expectedNumberOfChildrenToBe } from '../common.ts'
import { Then, When } from '../fixture.ts'

When('I start creating a quiz', async function () {
    await this.quizCreatePage.gotoNew()
    // TODO await expect(page).toHaveURL('/quiz-create/new')
})

Then('I see question list with {int} available questions', async function (count: number) {
    await expectedNumberOfChildrenToBe(this.quizCreatePage.questionsInList(), count)
})
