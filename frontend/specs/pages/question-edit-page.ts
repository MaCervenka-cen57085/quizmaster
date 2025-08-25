import type { Page } from '@playwright/test'

export class QuestionEditPage {
    constructor(private page: Page) {}

    gotoNew = () => this.page.goto('/question/new')
    gotoNewToList = (listguid: string) => this.page.goto(`/question/new?listguid=${listguid}`)

    gotoEdit = (url: string) => this.page.goto(url, { waitUntil: 'networkidle' })

    waitForLoaded = () => this.page.isHidden('#is-loaded[value="loaded"]')

    private questionLocator = () => this.page.locator('#question-text')
    enterQuestion = (question: string) => this.questionLocator().fill(question)
    questionValue = () => this.questionLocator().inputValue()

    multipleChoiceLocator = () => this.page.locator('#is-multiple-choice')
    isMultipleChoice = () => this.multipleChoiceLocator().isChecked()
    setMultipleChoice = () => this.multipleChoiceLocator().check()
    setSingleChoice = () => this.multipleChoiceLocator().uncheck()

    private easyModeLocator = () => this.page.locator('#is-easy-mode-choice')
    isEasyMode = () => this.easyModeLocator().isChecked()
    setEasyModeChecked = () => this.easyModeLocator().check()
    setEasyModeUnchecked = () => this.easyModeLocator().uncheck()

    isCorrectCheckboxLocator = (answerText: string) =>
        this.page.locator(`[id^=answer-text-][value="${answerText}"]+[id^=answer-checkbox-]`)

    isCorrectCheckboxesLocator = () => this.page.locator('[id^=answer-checkbox-]')

    answersLocator = () => this.page.locator('[id^=answer-text-]')

    answerTextLocator = (index: number) => this.page.locator(`#answer-text-${index}`)
    enterAnswerText = (index: number, value: string) => this.answerTextLocator(index).fill(value)
    answerText = (index: number) => this.answerTextLocator(index).inputValue()

    markButton = (value: number) => this.page.locator(`#answer-checkbox-${value}`)
    isAnswerCorrect = (index: number) => this.markButton(index).isChecked()
    setAnswerCorrectness = (index: number, isCorrect: boolean) => this.markButton(index).setChecked(isCorrect)

    clearExplanation = async () => {
        const getExplanation = await this.page.locator('[id^=answer-explanation-]').all()
        for (const li of getExplanation) await li.clear()
    }

    enterAnswer = async (index: number, value: string, correct: boolean, explanation: string) => {
        await this.enterAnswerText(index, value)

        if (explanation) await this.page.fill(`#answer-explanation-${index}`, explanation)

        if (correct) await this.page.check(`#answer-checkbox-${index}`)
    }

    questionExplanationLocator = () => this.page.locator('#question-explanation')
    enterQuestionExplanation = (question: string) => this.questionExplanationLocator().fill(question)
    questionExplanation = () => this.questionExplanationLocator().inputValue()

    addAnswer = async (idx: number) => {
        await this.page.locator('button#add-answer').click()
        await this.page.waitForSelector(`#answer-text-${idx}`)
    }

    addAdditionalAnswer = async () => {
        const idx = await this.answersLocator().count()
        await this.addAnswer(idx)
    }

    submit = () => this.page.locator('button[type="submit"]').click()

    private questionUrlLocator = () => this.page.locator('#question-link')
    questionUrl = () => this.questionUrlLocator().textContent()
    followQuestionUrl = () => this.questionUrlLocator().click()

    private questionEditUrlLocator = () => this.page.locator('#question-edit-link')
    questionEditUrl = () => this.questionEditUrlLocator().textContent()

    errorMessage = () => this.page.textContent('#error-message')

    getExplanationLocator = (id: number) => this.page.locator(`#answer-explanation-${id}`)
    answerExplanation = (index: number) => this.getExplanationLocator(index).inputValue()
    enterAnswerExplanation = (index: number, explanation: string) => this.getExplanationLocator(index).fill(explanation)

    hasError = (error: string) => this.page.locator(`.errors .${error}`).waitFor({ state: 'visible' })
    errorMessageCount = () => this.page.locator('.errors > li').count()
}
