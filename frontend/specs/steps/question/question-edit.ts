import { expect } from '@playwright/test'
import { Then, When } from '../fixture.ts'

When('I start editing question {string}', async function (bookmark: string) {
    await this.questionEditPage.gotoEdit(this.questionBookmarks[bookmark].editUrl)
    this.activeQuestionBookmark = bookmark
})

Then('I see the question, answers and explanations', async function () {
    await this.questionEditPage.waitForLoaded()

    const question = await this.questionEditPage.questionValue()
    expect(question).toBe(this.activeQuestion.question)
})

When('I change question to {string}', async function (newQuestion: string) {
    await this.questionEditPage.enterQuestion(newQuestion)
})

When('I save it', async function () {
    await this.questionEditPage.submit()
})

Then('I see unchanged url', async function () {
    const link = await this.questionEditPage.questionUrl()
    expect(link).toBe(this.activeQuestion.url)
})

When('I reload the page', async function () {
    await this.questionEditPage.reloadPage()
})

When('I change the correct answer to {int}', async function (value: number) {
    this.questionEditPage.markButton(value).check()
})

Then('I see the correct answer is {int}', async function (value: number) {
    const markCircle = this.questionEditPage.markButton(value)
    await expect(markCircle).toBeChecked()
})

When('I delete all explanations and delete general explanation', async function () {
    await this.questionEditPage.clearExplanation()
})

When('I change a general explanation to {string}', async function (explanationLabel: string) {
    await this.questionEditPage.enterQuestionExplanation(explanationLabel)
})

Then('I see a general explanation the same as {string}', async function (explanationLabel: string) {
    const resultText = await this.questionEditPage.questionExplanationLocator().textContent()
    expect(resultText).toBe(explanationLabel)
})

When(
    'I change a single answer explanation {int} to {string}',
    async function (answerIndex: number, answerLabel: string) {
        const answer = await this.questionEditPage.getExplanationLocator(answerIndex)
        await answer.fill(answerLabel)
    },
)

Then('I see changed explanation {int} to {string}', async function (answerIndex: number, answerLabel: string) {
    const answer = await this.questionEditPage.getExplanationLocator(answerIndex).inputValue()
    expect(answer).toBe(answerLabel)
})

When('I change of an answer label {int} to {string}', async function (answerIndex: number, answerLabel: string) {
    const answer = await this.questionEditPage.answerTextLocator(answerIndex)
    await answer.fill(answerLabel)
})

Then('I see a changed label {int} to {string}', async function (answerIndex: number, answerLabel: string) {
    const answer = await this.questionEditPage.answerTextLocator(answerIndex).inputValue()
    expect(answer).toBe(answerLabel)
})

When('I mark a multiple choice', async function () {
    await this.questionEditPage.multipleChoiceLocator().click()
})

Then('I see checkboxes for every answer', async function () {
    const getCheckbox = await this.questionEditPage.isCorrectCheckboxesLocator().all()
    for (const li of getCheckbox) expect(await li.getAttribute('class')).toBe('answer-isCorrect-checkbox-multi')
})

When('I mark {int} checkbox', async function (index: number) {
    await this.questionEditPage.markButton(index).click()
})

Then('I see answer {int} with marked checkbox', async function (index: number) {
    await expect(await this.questionEditPage.markButton(index)).toBeChecked()
})
