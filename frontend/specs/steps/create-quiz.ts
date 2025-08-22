import { Given, Then, When, After } from './fixture.ts'
import { expect } from '@playwright/test'
import type { QuizmasterWorld } from './world/world.ts'

const openCreateQuizPage = async (world: QuizmasterWorld) => {
    await world.createQuizPage.gotoNew()
    world.quizWip = { url: '', title: '', description: '', mode: '', passscore: '' }
}

const enterQuizTitle = async (world: QuizmasterWorld, title: string) => {
    await world.createQuizPage.enterTitle(title)
    world.quizWip.title = title
}

const enterQuizDescription = async (world: QuizmasterWorld, description: string) => {
    await world.createQuizPage.enterDescription(description)
    world.quizWip.description = description
}

const enterQuizPassscore = async (world: QuizmasterWorld, passscore: string) => {
    await world.createQuizPage.enterPassscore(passscore)
    world.quizWip.passscore = passscore
}

const saveQuiz = async (world: QuizmasterWorld) => {
    await world.createQuizPage.submit()
    world.quizWip.url = (await world.createQuizPage.quizUrl()) || ''
}

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

When('I enter quiz passscore {string}', async function (passscore: string) {
    await enterQuizPassscore(this, passscore)
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

        const testQuizzes = quizzes.quizzes.filter((q: Quiz) =>
            q.title === 'Math Quiz' && q.description === 'Lorem ipsum dolor sit amet'
        )

        for (const quiz of testQuizzes) {
            await this.page.request.delete(`/api/quiz/${quiz.id}`)
        }
    } catch (error) {
        console.log('Failed to clean up test quizzes:', error)
    }
})
