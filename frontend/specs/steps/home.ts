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

// Then step: Validate both links have correct href attributes
Then('both links should have correct href attributes', async function (this: QuizmasterWorld) {
    const linksValid = await this.homePage.validateLinks()
    expect(linksValid).toBeTruthy()

    // Additional validation: check individual href values
    const questionHref = await this.homePage.getCreateQuestionHref()
    const questionListHref = await this.homePage.getCreateQuestionListHref()

    expect(questionHref).toBe('/question/new')
    expect(questionListHref).toBe('/q-list/new')
})

// Temporarily simplify this step to debug
Then('I should see a grid of existing quizzes', async function (this: QuizmasterWorld) {
    const hasGrid = await this.homePage.hasQuizGrid()
    expect(hasGrid).toBe(true)

    const cardCount = await this.homePage.getQuizCardCount()
    expect(cardCount).toBeGreaterThan(0)

    // Verify first card structure with specific locators
    await expect(this.homePage.getFirstQuizCardTitle()).toBeVisible()     // Title (h4)
    await expect(this.homePage.getFirstQuizCardDescription()).toBeVisible() // Description (first p)
    await expect(this.homePage.getFirstQuizCardPassScore()).toBeVisible()  // Pass Score (second p)
    await expect(this.homePage.getFirstQuizCardButton()).toBeVisible()    // Button
})
