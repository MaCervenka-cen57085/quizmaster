import type { DataTable } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { Given, Then, When } from '../fixture.ts'
import type { QuizmasterWorld } from '../world/world.ts'
import type { QuizMode } from '../world/quiz.ts'

const openCreateQuizPage = async (world: QuizmasterWorld) => {
    await world.createQuizPage.gotoNew()
}

const enterQuizTitle = async (world: QuizmasterWorld, title: string) => {
    await world.createQuizPage.enterTitle(title)
}

const enterQuizDescription = async (world: QuizmasterWorld, description: string) => {
    await world.createQuizPage.enterDescription(description)
}

const enterQuizPassScore = async (world: QuizmasterWorld, passScore: string) => {
    await world.createQuizPage.enterPassscore(passScore)
}

const saveQuiz = async (world: QuizmasterWorld) => {
    await world.createQuizPage.submit()
}

const postQuiz = async (
    world: QuizmasterWorld,
    quizBookmark: string,
    questionBookmarks: string[],
    mode: QuizMode,
    passScore: string,
) => {
    const questionIds = questionBookmarks
        .map(bookmark => world.questionBookmarks[bookmark])
        .map(question => Number.parseInt(question.url.split('/').pop() || '0'))

    const quiz = {
        title: quizBookmark,
        description: quizBookmark,
        questionIds,
        afterEach: mode === 'learn',
        passScore,
    }

    const response = await world.page.request.post('/api/quiz', { data: quiz })
    const quizId = await response.json()
    const quizUrl = `/quiz/${quizId}`

    world.quizBookmarks[quizBookmark] = {
        url: quizUrl,
        title: quizBookmark,
        description: quizBookmark,
        mode,
        passScore,
    }
}

Given('quizes', async function (data: DataTable) {
    for (const row of data.rows()) {
        const [quizBookmark, questionBookmarkList, mode, passScore] = row
        const questionBookmarks = questionBookmarkList.split(',').map(q => q.trim())

        await postQuiz(this, quizBookmark, questionBookmarks, mode as QuizMode, passScore)
    }
})

Given('I start creating a quiz', async function () {
    await openCreateQuizPage(this)
})

When('I enter quiz title {string}', async function (title: string) {
    await enterQuizTitle(this, title)
})

When('I enter quiz description {string}', async function (description: string) {
    await enterQuizDescription(this, description)
})

When('I select quiz mode {string}', async function (mode: string) {
    await this.page.locator(`input[type="radio"][name="quiz-mode"][value="${mode}"]`).check()
})

When('I enter quiz pass score {string}', async function (passScore: string) {
    await enterQuizPassScore(this, passScore)
})

When('I save the quiz', async function () {
    await saveQuiz(this)
})

Then('I see a link to take the quiz', async function () {
    const url = await this.createQuizPage.quizUrl()
    expect(url).not.toBe('')
})
