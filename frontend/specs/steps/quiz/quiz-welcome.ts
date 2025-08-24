import { expect } from '@playwright/test'
import { Then } from '../fixture.ts'

Then('I see the welcome page', async function () {
    expect(await this.quizWelcomePage.header()).toBe('Welcome to the quiz')
})

Then('I see quiz name {string}', async function (quizName: string) {
    expect(await this.quizWelcomePage.name()).toBe(quizName)
})

Then('I see quiz description', async function () {
    expect(await this.quizWelcomePage.description()).toBe(
        'Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam semper pellentesque leo at porttitor. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam eu massa a neque imperdiet convallis in vel erat.',
    )
})

Then('I see question count {int}', async function (questionCount: number) {
    expect(await this.quizWelcomePage.questionCount()).toBe(questionCount)
})

Then('I see feedback type {string}', async function (feedbackType: string) {
    expect(await this.quizWelcomePage.feedback()).toBe(feedbackType)
})

Then('I see pass score {int}%', async function (passScore: number) {
    expect(await this.quizWelcomePage.passScore()).toBe(passScore)
})
