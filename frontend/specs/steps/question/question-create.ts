import type { DataTable } from '@cucumber/cucumber'
import { expect } from '@playwright/test'

import type { TableOf } from '../common.ts'
import { Given, Then, When } from '../fixture.ts'
import {
    addAnswer,
    addAnswers,
    createQuestion,
    enterAnswer,
    enterQuestion,
    openCreatePage,
    saveQuestion,
    type AnswerRaw,
} from './ops.ts'

Given('a question {string}', async function (question: string) {
    await openCreatePage(this)
    await enterQuestion(this, question)
})

Given(
    'a question {string} bookmarked as {string}',
    async function (question: string, bookmark: string, answerRawTable: TableOf<AnswerRaw>) {
        await createQuestion(this, bookmark, question, answerRawTable)
    },
)

Given('questions', async function (data: DataTable) {
    for (const row of data.rows()) {
        const [bookmark, question, answers] = row
        const answerRawTable = {
            raw: () =>
                answers.split(',').map(a => {
                    const [answer, correct] = a.trim().split(' ')
                    return [answer, correct === '(*)' ? '*' : '', '']
                }),
        } as TableOf<AnswerRaw>

        await createQuestion(this, bookmark, question, answerRawTable)
    }
})

Given('with multi-choice selected', async function () {
    await this.createQuestionPage.setMultipleChoice()
})

Given('with answers:', async function (answerRawTable: TableOf<AnswerRaw>) {
    await addAnswers(this, answerRawTable)
})

Given('with explanation {string}', async function (explanation: string) {
    await this.createQuestionPage.enterQuestionExplanation(explanation)
    this.questionWip.explanation = explanation
})

Given('saved and bookmarked as {string}', async function (bookmark) {
    await saveQuestion(this, bookmark)
})

Given('I start creating a question', async function () {
    await openCreatePage(this)
})

When('I enter question {string}', async function (question: string) {
    await enterQuestion(this, question)
})

When(/^I add the answer "(.*)" marked as (correct|incorrect)$/, async function (answer: string, correct: string) {
    await enterAnswer(this, this.nextAnswerIdx++, answer, correct === 'correct', '')
})

When(
    /^I add the answer "(.*)" marked as (correct|incorrect) with an explanantion "(.*)"$/,
    async function (answer: string, correct: string, explanation: string) {
        await enterAnswer(this, this.nextAnswerIdx++, answer, correct === 'correct', explanation)
    },
)

When('I add an additional answer field', async function () {
    await addAnswer(this, this.nextAnswerIdx)
})

When('I save the question', async function () {
    await saveQuestion(this, 'manual')
})

When('I take the question', async function () {
    await this.createQuestionPage.followQuestionUrl()
    this.activeQuestionBookmark = 'manual'
})

When('I edit the question', async function () {
    await this.page.goto(this.questionWip.editUrl)
    // this.activeBookmark = 'manual'
})

When('I try saving the question', async function () {
    await this.createQuestionPage.submit()
})

Then('I see a link to take the question', async function () {
    const url = await this.createQuestionPage.questionUrl()
    expect(url).not.toBe('')
})

Then('I see a link to edit the question', async function () {
    const url = await this.createQuestionPage.questionEditUrl()
    expect(url).not.toBe('')
})

Then('I see an error message', async function () {
    const errorMessage = await this.createQuestionPage.errorMessage()
    expect(errorMessage).not.toBe('')
})

Then('I see 2 answers', async function () {
    await expect(this.createQuestionPage.answerTextLocator(0)).toBeVisible()
    await expect(this.createQuestionPage.answerTextLocator(1)).toBeVisible()
})

Then(/^Multiple choice is (checked|unchecked)$/, async function (state: string) {
    const expected = state === 'checked'
    const isChecked = await this.createQuestionPage.isMultipleChoice()
    expect(isChecked).toBe(expected)
})

Then('I see empty question', async function () {
    expect(await this.createQuestionPage.questionValue()).toBe('')
})

When('I click is-correct checkbox for {string}', async function (answer: string) {
    await this.createQuestionPage.isCorrectCheckboxLocator(answer).click()
})

Then(/^I see the answers$/, async function (data: DataTable) {
    for (const row of data.rows()) {
        const answer = row[0]
        const shouldBeChecked = row[1] === '*'

        const checkbox = this.createQuestionPage.isCorrectCheckboxLocator(answer)
        const isChecked = await checkbox.isChecked()

        expect(isChecked, `Answer: ${answer} should be ${shouldBeChecked}`).toBe(shouldBeChecked)
    }
})

Then('Is correct checkboxes look like radio buttons', async function () {
    const checkboxes = this.createQuestionPage.isCorrectCheckboxesLocator()
    const elements = await checkboxes.all()
    for (const element of elements) {
        const className = await element.getAttribute('class')
        expect(className).toBe('answer-isCorrect-checkbox')
    }
})

Then(/^Easy mode checkbox is (checked|unchecked)$/, async function (state: string) {
    const expected = state === 'checked'
    const isChecked = await this.createQuestionPage.isEasyModeChoice()
    expect(isChecked).toBe(expected)
})

When(/^I make the question (single|multi)-choice$/, async function (type: string) {
    if (type === 'single') {
        await this.createQuestionPage.setSingleChoice()
    } else {
        await this.createQuestionPage.setMultipleChoice()
    }
})
