import type { DataTable } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { Then, When } from '../fixture.ts'
import type { QuizmasterWorld } from '../world'

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

When('I attempt to save the question', async function () {
    await this.questionEditPage.submit()
})

const expectError = async (world: QuizmasterWorld, error: string) => {
    const editPage = world.questionEditPage

    const errors: Record<string, () => Promise<void>> = {
        'empty-question': editPage.hasErrorEmptyQuestion,
        'empty-answer': editPage.hasErrorEmptyAnswer,
        'no-correct-answer': editPage.hasErrorNoCorrectAnswer,
    }

    await errors[error]()
}

Then('I see error messages', async function (table: DataTable) {
    const expectedErrors = table.raw().map(row => row[0])

    for (const error of expectedErrors) {
        await expectError(this, error)
    }
})
