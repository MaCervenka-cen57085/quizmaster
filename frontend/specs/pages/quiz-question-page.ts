import type { Page, Locator } from '@playwright/test'

export class QuizQuestionPage {
    constructor(private page: Page) {}

    goto = (quizId: string) => this.page.goto(`/quiz/${quizId}`)

    backButtonLocator = () => this.page.locator('button#back')
    nextButtonLocator = () => this.page.locator('button#next')
    skipButtonLocator = () => this.page.locator('button#skip')
    evaluateButtonLocator = () => this.page.locator('button#evaluate')
    evaluateModalButtonLocator = () => this.page.locator('dialog #evaluate')
    addQuestionToBookmarkButtonLocator = () => this.page.locator('button#add-question-to-bookmark')

    private progressBarLocator = () => this.page.locator('#progress-bar')
    progressCurrent = async () => Number.parseInt((await this.progressBarLocator().getAttribute('value')) ?? '')
    progressMax = async () => Number.parseInt((await this.progressBarLocator().getAttribute('max')) ?? '')

    back = () => this.backButtonLocator().click()
    bookmark = () => this.addQuestionToBookmarkButtonLocator().click()
    next = () => this.nextButtonLocator().click()
    skip = () => this.skipButtonLocator().click()
    evaluate = () => this.evaluateButtonLocator().click()

    // --- Bookmark funkcionalita ---

    /** Text aktuální otázky (používaný ve Then I see question ...) */
    currentQuestionText = async (): Promise<string> => {
        return (await this.page.locator('[data-testid="question-text"]').textContent()) ?? ''
    }

    /** Klikne na hvězdičku pro přidání/odebrání záložky */
    toggleBookmark = async (): Promise<void> => {
        await this.page.locator('[data-testid="bookmark-toggle"]').click()
    }

    /** Lokátor na samotný bookmark indikátor (např. pro kontrolu .active třídy) */
    bookmarkIndicator = (): Locator => {
        return this.page.locator('[data-testid="bookmark-toggle"]')
    }

    // /** Lokátor pro položky v seznamu záložek */
    // bookmarkListItems = (): Locator => {
    //     return this.page.locator('[data-testid="bookmark-list"] li')
    // }

    // /** Vrací texty všech položek ze seznamu záložek */
    // bookmarkListItemsText = async (): Promise<string[]> => {
    //     return await this.bookmarkListItems().allTextContents()
    // }

    // /** Vrací počet aktivních bookmark indikátorů (např. `[data-testid^="bookmark-"].active`) */
    // activeBookmarksCount = async (): Promise<number> => {
    //     return await this.page.locator('[data-testid^="bookmark-"].active').count()
    // }

    /** Klikne na záložku s daným názvem v seznamu záložek */
    clickBookmark = async (title: string): Promise<void> => {
        await this.page.locator('[data-testid="bookmark-list"] button', { hasText: title }).click()
    }

    /** Klikne na záložku s daným názvem v seznamu záložek */
    clickAddQuestionToBookmark = async (): Promise<void> => {
        await this.addQuestionToBookmarkButtonLocator().click()
    }

    deleteBookmark = async (title: string): Promise<void> => {
        await this.page.locator(`[data-testid="delete-bookmark-${title}"]`).click()
    }

    bookmarkLink = (title: string): Locator => {
        return this.page.locator('[data-testid="bookmark-list"] button', { hasText: title })
    }
}
