import type { DataTable } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { Given, Then, When } from '../fixture.ts'
import { type QuizmasterWorld, type Quiz, type QuizMode, type Question, parseKey } from '../world'
import { createQuestion } from '../question/ops.ts'

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

const postQuiz = async (world: QuizmasterWorld, bookmark: string, quiz: Quiz) => {
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

    world.quizBookmarks[bookmark] = { url: quizUrl, ...quiz }
}

const validateQuizRow = (questionBookmarks: Record<string, Question>, row: Record<string, string>) => {
    const hasBookmark = row.bookmark !== ''
    const hasMode = row.mode === 'exam' || row.mode === 'learn'
    const hasPassScore = row['pass score'] !== ''

    const hasValidQuestions =
        !Number.isNaN(Number.parseInt(row.questions)) ||
        parseKey(row.questions).every(bookmark => questionBookmarks[bookmark] !== undefined)

    return hasBookmark && hasMode && hasPassScore && hasValidQuestions
}

const createDummyQuestion = async (world: QuizmasterWorld, bookmark: string) => {
    await createQuestion(world, bookmark, '1 + 1 = ?', {
        raw: () => [
            ['2', '*', ''],
            ['3', '', ''],
        ],
    })
}

const createDummyQuestions = async (world: QuizmasterWorld, quizBookmark: string, count: number) => {
    const questionBookmarks = Array.from({ length: count }, (_, i) => `${quizBookmark} ${i}`)

    for (const bookmark of questionBookmarks) {
        await createDummyQuestion(world, bookmark)
    }

    return questionBookmarks
}

const toQuiz = async (world: QuizmasterWorld, row: Record<string, string>): Promise<Quiz> => {
    if (!validateQuizRow(world.questionBookmarks, row))
        throw new Error(`Invalid quiz row: ${JSON.stringify(row, null, 2)}`)

    const dummyQuestions = Number.parseInt(row.questions)

    const questionBookmarks = Number.isNaN(dummyQuestions)
        ? parseKey(row.questions)
        : await createDummyQuestions(world, row.bookmark, dummyQuestions)

    return {
        title: row.title || row.bookmark,
        description: row.description || row.bookmark,
        questionIds: questionBookmarks
            .map(bookmark => world.questionBookmarks[bookmark])
            .map(question => Number.parseInt(question.url.split('/').pop() || '0')),
        mode: row.mode as QuizMode,
        passScore: Number.parseInt(row['pass score']),
    }
}

Given('quizes', async function (data: DataTable) {
    for (const row of data.hashes()) {
        await postQuiz(this, row.bookmark, await toQuiz(this, row))
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
