import type { DataTable } from '@cucumber/cucumber'
import { expect } from '@playwright/test'

import type { TableOf } from '../common.ts'
import { Given, When, Then } from '../fixture.ts'
import {
    addAnswers,
    createQuestion,
    enterQuestion,
    openCreatePage,
    saveQuestion,
    submitQuestion,
    type AnswerRaw,
} from './ops.ts'

Given('I created a question {string}', async function (question: string) {
    await openCreatePage(this)
    await enterQuestion(this, question)
    await submitQuestion.bind(this)()
})

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
        const [bookmark, question, answers, questionExplanation] = row
        const answerRawTable = {
            raw: () =>
                answers.split(',').map(a => {
                    const [answer, correct] = a.trim().split(' ')
                    return [answer, correct === '(*)' ? '*' : '', '']
                }),
        } as TableOf<AnswerRaw>

        await createQuestion(this, bookmark, question, answerRawTable, questionExplanation)
    }
})

Given('with answers:', async function (answerRawTable: TableOf<AnswerRaw>) {
    await addAnswers(this, answerRawTable)
})

Given('with explanation {string}', async function (explanation: string) {
    await this.questionEditPage.enterQuestionExplanation(explanation)
    this.questionWip.explanation = explanation
})

Given('marked as easy mode', async () => {})

Given('saved and bookmarked as {string}', async function (bookmark) {
    await saveQuestion(this, bookmark)
})

Then('I see an error message', async function () {
    const errorMessage = await this.questionEditPage.errorMessage()
    expect(errorMessage).not.toBe('')
})

When('I wait for {int} ms', async (milliseconds: number) => {
    await new Promise(resolve => setTimeout(resolve, milliseconds))
})
