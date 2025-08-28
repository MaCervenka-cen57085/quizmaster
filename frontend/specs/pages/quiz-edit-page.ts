import type { Page } from '@playwright/test'

export class QuizEditPage {
    constructor(private page: Page) {}

    gotoNew = () => this.page.goto('/quiz/new')
    gotoEdit = (url: string) => this.page.goto(url, { waitUntil: 'networkidle' })

    waitForLoaded = () => this.page.isHidden('#is-loaded[value="loaded"]')

    private titleLocator = () => this.page.locator('#title-text')
    enterTitle = (title: string) => this.titleLocator().fill(title)
    titleValue = () => this.titleLocator().inputValue()

    private descriptionLocator = () => this.page.locator('#description-text')
    enterDescription = (description: string) => this.descriptionLocator().fill(description)
    descriptionValue = () => this.descriptionLocator().inputValue()

    private questionListLocator = () => this.page.locator('#question-list-text')
    enterQuestionList = (questionList: string) => this.questionListLocator().fill(questionList)
    questionListValue = () => this.questionListLocator().inputValue()

    private passScoreLocator = () => this.page.locator('#pass-score-text')
    enterPassScore = (passScore: string) => this.passScoreLocator().fill(passScore)
    passScoreValue = () => this.passScoreLocator().inputValue()

    private timeLimitLocator = () => this.page.locator('#time-limit-text')
    enterTimeLimit = (timeLimit: string) => this.timeLimitLocator().fill(timeLimit)
    timeLimitValue = () => this.timeLimitLocator().inputValue()

    isSubmitButtonActive = () => this.page.locator('button[type="submit"]:not([disabled])').count().then(count => count > 0)
}
