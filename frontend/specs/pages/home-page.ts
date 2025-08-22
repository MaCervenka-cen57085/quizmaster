import type { Page } from '@playwright/test'

export class HomePage {
    constructor(private page: Page) {}

    // Navigate to the home page
    goto = () => this.page.goto('/')

    // Wait for the home page to load
    waitForLoaded = () => this.page.waitForSelector('h1:has-text("Welcome to Quizmaster! You rock.")')

    // Locators for the links
    createQuestionLink = () => this.page.locator('a[href="/question/new"]')
    createQuestionListLink = () => this.page.locator('a[href="/q-list/new"]')

    // Methods to check if links exist and have correct href
    hasCreateQuestionLink = async () => {
        const link = this.createQuestionLink()
        await link.waitFor({ state: 'visible' })
        return link.isVisible()
    }

    hasCreateQuestionListLink = async () => {
        const link = this.createQuestionListLink()
        await link.waitFor({ state: 'visible' })
        return link.isVisible()
    }

    // Get the href attributes to validate they are correct
    getCreateQuestionHref = () => this.createQuestionLink().getAttribute('href')
    getCreateQuestionListHref = () => this.createQuestionListLink().getAttribute('href')

    // Check if both links have the expected href values
    validateLinks = async () => {
        const questionHref = await this.getCreateQuestionHref()
        const questionListHref = await this.getCreateQuestionListHref()

        return questionHref === '/question/new' && questionListHref === '/q-list/new'
    }
}
