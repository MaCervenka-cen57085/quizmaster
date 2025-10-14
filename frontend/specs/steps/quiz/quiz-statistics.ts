import { expect } from '@playwright/test'
import { Then } from '../fixture.ts'

Then('I see the quiz statistics page', async function () {
    expect(await this.quizStatisticsPage.header()).toBe('Quiz statistics')
})

Then('I see quiz name on stats page {string}', async function (quizName: string) {
    expect(await this.quizStatisticsPage.name()).toBe(quizName)
})

Then('I see quiz description on stats page {string}', async function (description: string) {
    expect(await this.quizStatisticsPage.description()).toBe(description)
})

Then('I see times taken {int}', async function (timesTaken: number) {
    expect(await this.quizStatisticsPage.timesTaken()).toBe(timesTaken)
})

Then('I see times finished {int}', async function (timesFinished: number) {
    expect(await this.quizStatisticsPage.timesFinished()).toBe(timesFinished)
})

Then('I see average score {int} %', async function (averageScore: number) {
    expect(await this.quizStatisticsPage.averageScore()).toBe(averageScore)
})




