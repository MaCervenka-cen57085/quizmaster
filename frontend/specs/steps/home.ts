import { Given, Then } from './fixture.ts'
import { expect } from '@playwright/test'
import type { QuizmasterWorld } from './world/world.ts'

// Given step: Navigate to the home page
Given('I am on the home page', async function (this: QuizmasterWorld) {
    await this.homePage.goto()
    await this.homePage.waitForLoaded()
})

// Then step: Check if the create question link exists
Then('I should see a link to create a new question', async function (this: QuizmasterWorld) {
    const hasLink = await this.homePage.hasCreateQuestionLink()
    expect(hasLink).toBeTruthy()
})

// Then step: Check if the create question list link exists
Then('I should see a link to create a new question list', async function (this: QuizmasterWorld) {
    const hasLink = await this.homePage.hasCreateQuestionListLink()
    expect(hasLink).toBeTruthy()
})

// Then step: Check if the create quiz link exists
Then('I should see a link to create a new quiz', async function (this: QuizmasterWorld) {
    const hasLink = await this.homePage.hasCreateQuizLink()
    expect(hasLink).toBeTruthy()
})

// Then step: Validate all links have correct href attributes
Then('all links should have correct href attributes', async function (this: QuizmasterWorld) {
    const linksValid = await this.homePage.validateLinks()
    expect(linksValid).toBeTruthy()

    // Additional validation: check individual href values
    const questionHref = await this.homePage.getCreateQuestionHref()
    const questionListHref = await this.homePage.getCreateQuestionListHref()
    const quizHref = await this.homePage.getCreateQuizHref()

    expect(questionHref).toBe('/question/new')
    expect(questionListHref).toBe('/q-list/new')
    expect(quizHref).toBe('/quiz/new')
})
