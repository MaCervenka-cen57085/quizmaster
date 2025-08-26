import type { DataTable } from '@cucumber/cucumber'
import { expect } from '@playwright/test'

import type { TableOf } from '../common.ts'
import { Given, Then } from '../fixture.ts'
import { addAnswers, createQuestion, enterQuestion, openCreatePage, saveQuestion, type AnswerRaw } from './ops.ts'

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

Given('with answers:', async function (answerRawTable: TableOf<AnswerRaw>) {
    await addAnswers(this, answerRawTable)
})

Given('with explanation {string}', async function (explanation: string) {
    await this.questionEditPage.enterQuestionExplanation(explanation)
    this.questionWip.explanation = explanation
})

Given('saved and bookmarked as {string}', async function (bookmark) {
    await saveQuestion(this, bookmark)
})

Then('I see an error message', async function () {
    const errorMessage = await this.questionEditPage.errorMessage()
    expect(errorMessage).not.toBe('')
})
