import type { DataTable } from '@cucumber/cucumber'
import { expect } from '@playwright/test'

import { Then, When } from '../fixture.ts'
import type { QuizmasterWorld } from '../world'
import { enterQuestion } from './ops.ts'

Then('I see empty question field', async function () {
    const question = await this.questionEditPage.questionValue()
    expect(question).toBe('')
})

Then(/I see multiple choice is (unchecked|checked)/, async function (value: string) {
    const isMultipleChoice = await this.questionEditPage.isMultipleChoice()
    expect(isMultipleChoice).toBe(value === 'checked')
})

Then(/I see easy mode is (unchecked|checked)/, async function (value: string) {
    const isEasyMode = await this.questionEditPage.isEasyMode()
    expect(isEasyMode).toBe(value === 'checked')
})

const expectAnswer = async (
    world: QuizmasterWorld,
    index: number,
    answer: string,
    isCorrect: boolean,
    explanation: string,
) => {
    const editPage = world.questionEditPage

    expect(await editPage.answerText(index)).toBe(answer)
    expect(await editPage.markButton(index).isChecked()).toBe(isCorrect)
    expect(await editPage.answerExplanation(index)).toBe(explanation)
}

const expectEmptyAnswers = (world: QuizmasterWorld, index: number) => expectAnswer(world, index, '', false, '')

Then('I see 2 empty answer fields, incorrect, with empty explanations fields', async function () {
    const answerCount = await this.questionEditPage.answersLocator().count()
    expect(answerCount).toBe(2)

    await expectEmptyAnswers(this, 0)
    await expectEmptyAnswers(this, 1)
})

Then('I see empty question explanation field', async function () {
    const explanation = await this.questionEditPage.questionExplanation()
    expect(explanation).toBe('')
})

When('I enter question {string}', async function (question: string) {
    await enterQuestion(this, question)
})

When('I enter answer {int} text {string}', async function (index: number, answer: string) {
    await this.questionEditPage.enterAnswerText(index - 1, answer)
})

When('I mark answer {int} as correct', async function (index: number) {
    await this.questionEditPage.markButton(index - 1).check()
})

When('I enter answer {int} explanation {string}', async function (index: number, explanation: string) {
    await this.questionEditPage.enterAnswerExplanation(index - 1, explanation)
})

When('I enter answer {int} text {string} and mark it as correct', async function (index: number, answer: string) {
    await this.questionEditPage.enterAnswer(index - 1, answer, true, '')
})

When('I add an additional answer', async function () {
    await this.questionEditPage.addAdditionalAnswer()
})

When('I attempt to save the question', async function () {
    await this.questionEditPage.submit()
})

const expectErrorCount = async (world: QuizmasterWorld, n: number) => {
    const errorCount = await world.questionEditPage.errorMessageCount()
    expect(errorCount).toBe(n)
}

Then('I see error messages', async function (table: DataTable) {
    const expectedErrors = table.raw().map(row => row[0])

    await expectErrorCount(this, expectedErrors.length)

    for (const error of expectedErrors) {
        await this.questionEditPage.hasError(error)
    }
})

Then('I see no error messages', async function () {
    await expectErrorCount(this, 0)
})
