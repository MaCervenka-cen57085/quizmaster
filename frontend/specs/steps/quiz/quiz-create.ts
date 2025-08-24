import type { DataTable } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { Given, Then, When } from '../fixture.ts'
import type { QuizmasterWorld } from '../world/world.ts'
import type { Quiz, QuizMode } from '../world/quiz.ts'
import { parseKey } from '../world/helpers.ts'
import { Question } from '../world/question.ts'

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

const postQuiz = async (world: QuizmasterWorld, quiz: Quiz) => {
    const questionIds = quiz.questionIds

    const quizPayload = {
        title: quiz.title,
        description: quiz.description,
        questionIds,
        afterEach: quiz.mode === 'learn',
        passScore: quiz.passScore,
    }

    const response = await world.page.request.post('/api/quiz', { data: quizPayload })
    const quizId = await response.json()
    const quizUrl = `/quiz/${quizId}`

    world.quizBookmarks[quiz.title] = { url: quizUrl, ...quiz }
}

const toQuiz = (questionBookmarks: Record<string, Question>, row: Record<string, string>): Quiz => {
    return {
        title: row.title || row.bookmark,
        description: row.description || row.bookmark,
        questionIds: parseKey(row.questions)
            .map(bookmark => questionBookmarks[bookmark])
            .map(question => Number.parseInt(question.url.split('/').pop() || '0')),
        mode: row.mode as QuizMode,
        passScore: Number.parseInt(row['pass score']),
    }
}

Given('quizes', async function (data: DataTable) {
    for (const row of data.hashes()) {
        await postQuiz(this, toQuiz(this.questionBookmarks, row))
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
