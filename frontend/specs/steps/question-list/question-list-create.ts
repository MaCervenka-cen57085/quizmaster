import { expect } from '@playwright/test'
import { Given, When, Then } from '../fixture.ts'
import { createQuestionInList, createQuestionList, openCreateQuestionListPage } from './ops.ts'
import type { AnswerRaw } from '../question/ops.ts'
import type { TableOf } from '../common.ts'
import type { DataTable } from '@cucumber/cucumber'

Given('I start creating a question list', async function () {
    await openCreateQuestionListPage(this)
})

Given('a question list with questions and answers', async function (data: DataTable) {
    await createQuestionList(this, 'My List')

    for (const row of data.rows()) {
        const [question, answers] = row
        const answerRawTable = {
            raw: () =>
                answers.split(',').map(a => {
                    const [answer, correct] = a.trim().split(' ')
                    return [answer, correct === '(*)' ? '*' : '', '']
                }),
        } as TableOf<AnswerRaw>

        await createQuestionInList(this, question, answerRawTable)
    }
})

When('I enter question list name {string}', async function (name: string) {
    await this.questionListCreatePage.enterQuestionListName(name)
})

When('I submit the question list', async function () {
    await this.questionListCreatePage.submit()
})

Then('I see an error message on question list page stating title must be mandatory', async function () {
    const errorMessage = await this.questionListCreatePage.errorMessage()
    expect(errorMessage).not.toBe('')
})
