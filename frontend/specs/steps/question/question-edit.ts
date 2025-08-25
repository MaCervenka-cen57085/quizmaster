import { expect } from '@playwright/test'
import { Then, When } from '../fixture.ts'

When('I start editing question {string}', async function (bookmark: string) {
    await this.questionEditPage.gotoEdit(this.questionBookmarks[bookmark].editUrl)
    this.activeQuestionBookmark = bookmark
})

When('I save it', async function () {
    await this.questionEditPage.submit()
})

When('I mark a multiple choice', async function () {
    await this.questionEditPage.setMultipleChoice()
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
