import type { DataTable } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { Given, Then, When, After } from './fixture.ts'
import type { QuizmasterWorld } from './world/world.ts'
import { emptyQuiz, type QuizMode } from './world/quiz.ts'

const openCreateQuizPage = async (world: QuizmasterWorld) => {
    await world.createQuizPage.gotoNew()
    world.quizWip = emptyQuiz()
}

const enterQuizTitle = async (world: QuizmasterWorld, title: string) => {
    await world.createQuizPage.enterTitle(title)
    world.quizWip.title = title
}

const enterQuizDescription = async (world: QuizmasterWorld, description: string) => {
    await world.createQuizPage.enterDescription(description)
    world.quizWip.description = description
}

const enterQuizPassScore = async (world: QuizmasterWorld, passScore: string) => {
    await world.createQuizPage.enterPassscore(passScore)
    world.quizWip.passScore = passScore
}

const saveQuiz = async (world: QuizmasterWorld) => {
    await world.createQuizPage.submit()
    world.quizWip.url = (await world.createQuizPage.quizUrl()) || ''
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

After(async function () {
    // Clean up the created quiz
    if (this.quizWip.url) {
        const quizId = this.quizWip.url.split('/').pop()
        if (quizId) {
            try {
                await this.page.request.delete(`/api/quiz/${quizId}`)
            } catch (error) {
                console.log('Failed to delete quiz:', error)
            }
        }
    }

    // Also clean up any other test quizzes that might have been created
    try {
        const response = await this.page.request.get('/api/quiz/list')
        const quizzes = await response.json()
        interface Quiz {
            id: number
            title: string
            description: string
        }

        const testQuizzes = quizzes.quizzes.filter(
            (q: Quiz) => q.title === 'Math Quiz' && q.description === 'Lorem ipsum dolor sit amet',
        )

        for (const quiz of testQuizzes) {
            await this.page.request.delete(`/api/quiz/${quiz.id}`)
        }
    } catch (error) {
        console.log('Failed to clean up test quizzes:', error)
    }
})
