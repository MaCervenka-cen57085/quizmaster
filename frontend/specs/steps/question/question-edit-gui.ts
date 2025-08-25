import { expect } from '@playwright/test'
import { Then } from '../fixture.ts'
import type { QuizmasterWorld } from '../world'

Then('I see empty question field', async function () {
    expect(await this.questionEditPage.questionValue()).toBe('')
})

Then(/I see multiple choice is (unchecked|checked)/, async function (checked: string) {
    expect(await this.questionEditPage.isMultipleChoice()).toBe(checked === 'checked')
})

Then(/I see easy mode is (unchecked|checked)/, async function (checked: string) {
    expect(await this.questionEditPage.isEasyMode()).toBe(checked === 'checked')
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
    expect(await this.questionEditPage.answersLocator().count()).toBe(2)

    await expectEmptyAnswers(this, 0)
    await expectEmptyAnswers(this, 1)
})

Then('I see empty question explanation field', async function () {
    await expect(this.questionEditPage.questionExplanationLocator().inputValue()).resolves.toBe('')
})
