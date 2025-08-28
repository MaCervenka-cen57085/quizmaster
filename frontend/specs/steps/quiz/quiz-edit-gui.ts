//import type { DataTable } from '@cucumber/cucumber'
import { expect } from '@playwright/test'

import { /*Given,*/ Then, When } from '../fixture.ts'
//import type { QuizmasterWorld } from '../world'
import {
    // enterTitle,
    // enterDescription,
    // enterQuestionList,
    // enterTimeLimit,
    // enterPassScore,
    openCreatePage,
    // openEditPage,
    // saveQuiz,
    // submitQuiz,
} from './ops.ts'
//import type { TableOf } from '../common.ts'

When('I start creating a quiz', async function () {
    await openCreatePage(this)
})

// Given('I start editing quiz {string}', async function (bookmark: string) {
//     await openEditPage(this, bookmark)
// })

// // Field assertions

Then('I see empty title field', async function () {
    const title = await this.quizEditPage.titleValue()
    expect(title).toBe('')
})

Then('I see empty description field', async function () {
    const description = await this.quizEditPage.descriptionValue()
    expect(description).toBe('')
})

Then('I see empty question list field', async function () {
    const questionList = await this.quizEditPage.questionListValue()
    expect(questionList).toBe('')
})

Then('I see empty pass score field', async function () {
    const passScore = await this.quizEditPage.passScoreValue()
    expect(passScore).toBe('')
})

Then('I see empty time limit field', async function () {
    const timeLimit = await this.quizEditPage.timeLimitValue()
    expect(timeLimit).toBe('')
})

Then('I see the quiz submit button as active', async function () {
    const isSubmitButtonActive = await this.quizEditPage.isSubmitButtonActive()
    expect(isSubmitButtonActive).toBe(true)
})

//  Then('I see {string} in the quiz field', async function (quiz: string) {
//      const quizValue = await this.quizEditPage.quizValue()
//      expect(quizValue).toBe(quiz)
//  })

// Then(/I see multiple choice is (unchecked|checked)/, async function (value: string) {
//     const isMultipleChoice = await this.quizEditPage.isMultipleChoice()
//     expect(isMultipleChoice).toBe(value === 'checked')
// })

// Then(/I see easy mode is (unchecked|checked)/, async function (value: string) {
//     const isEasyMode = await this.quizEditPage.isEasyMode()
//     expect(isEasyMode).toBe(value === 'checked')
// })

// const expectAnswer = async (
//     world: QuizmasterWorld,
//     index: number,
//     answer: string,
//     isCorrect: boolean,
//     explanation: string,
// ) => {
//     const editPage = world.quizEditPage

//     expect(await editPage.answerText(index)).toBe(answer)
//     expect(await editPage.isAnswerCorrect(index)).toBe(isCorrect)
//     expect(await editPage.answerExplanation(index)).toBe(explanation)
// }

// const expectEmptyAnswers = (world: QuizmasterWorld, index: number) => expectAnswer(world, index, '', false, '')

// Then('I see 2 empty answer fields, incorrect, with empty explanations fields', async function () {
//     const answerCount = await this.quizEditPage.answerRowCount()
//     expect(answerCount).toBe(2)

//     await expectEmptyAnswers(this, 0)
//     await expectEmptyAnswers(this, 1)
// })

// Then(/I see answer (\d+) as (correct|incorrect)/, async function (index: number, correctness: string) {
//     const isCorrect = correctness === 'correct'
//     expect(await this.quizEditPage.isAnswerCorrect(index - 1)).toBe(isCorrect)
// })

// Then(
//     /I see answer (\d+) text "([^"]*)", (correct|incorrect), with explanation "([^"]*)"/,
//     async function (index: number, answer: string, correctness: string, explanation: string) {
//         await expectAnswer(this, index - 1, answer, correctness === 'correct', explanation)
//     },
// )

// Then(/^I see the answers fields$/, async function (data: TableOf<AnswerRaw>) {
//     const answers = data.raw()
//     let i = 0

//     for (const [answer, star, explanation] of answers) {
//         await expectAnswer(this, i++, answer, star === '*', explanation || '')
//     }
// })

// Then('I see empty quiz explanation field', async function () {
//     const explanation = await this.quizEditPage.quizExplanation()
//     expect(explanation).toBe('')
// })

// Then('I see {string} in the quiz explanation field', async function (explanation: string) {
//     const explanationValue = await this.quizEditPage.quizExplanation()
//     expect(explanationValue).toBe(explanation)
// })

// // Field edits

// When('I enter quiz {string}', async function (quiz: string) {
//     await enterQuiz(this, quiz)
// })

// When(/I mark the quiz as (single|multiple) choice/, async function (choice: string) {
//     if (choice === 'single') {
//         await this.quizEditPage.setSingleChoice()
//     } else {
//         await this.quizEditPage.setMultipleChoice()
//     }
// })

// When('I enter answer {int} text {string}', async function (index: number, answer: string) {
//     await enterAnswerText(this, index - 1, answer)
// })

// When('I mark answer {int} as correct', async function (index: number) {
//     await markAnswerCorrectness(this, index - 1, true)
// })

// When('I enter answer {int} explanation {string}', async function (index: number, explanation: string) {
//     await enterAnswerExplanation(this, index - 1, explanation)
// })

// When('I enter answer {int} text {string} and mark it as correct', async function (index: number, answer: string) {
//     await enterAnswer(this, index - 1, answer, true, '')
// })

// When(
//     /I enter answer (\d+) text "([^"]*)", (correct|incorrect), with explanation "([^"]*)"/,
//     async function (index: number, answer: string, correctness: string, explanation: string) {
//         await enterAnswer(this, index - 1, answer, correctness === 'correct', explanation)
//     },
// )

// Given('I enter answers', async function (answerRawTable: TableOf<AnswerRaw>) {
//     await addAnswers(this, answerRawTable)
// })

// When('I add an additional answer', async function () {
//     await this.quizEditPage.addAdditionalAnswer()
// })

// When('I enter quiz explanation {string}', async function (explanation: string) {
//     await enterQuizExplanation(this, explanation)
// })

// // Save quiz

// When('I attempt to save the quiz', submitQuiz)
// When('I submit the quiz', submitQuiz)

// When('I save the quiz', async function () {
//     await saveQuiz(this, 'manual')
// })

// Then('I see quiz-take URL and quiz-edit URL', async function () {
//     const takeUrl = await this.quizEditPage.quizUrl()
//     const editUrl = await this.quizEditPage.quizEditUrl()

//     expect(takeUrl).toBeDefined()
//     expect(editUrl).toBeDefined()
// })

// // Error messages assertions

// const expectErrorCount = async (world: QuizmasterWorld, n: number) => {
//     const errorCount = await world.quizEditPage.errorMessageCount()
//     expect(errorCount).toBe(n)
// }

// Then('I see error messages', async function (table: DataTable) {
//     const expectedErrors = table.raw().map(row => row[0])

//     await expectErrorCount(this, expectedErrors.length)

//     for (const error of expectedErrors) {
//         await this.quizEditPage.hasError(error)
//     }
// })

// Then('I see no error messages', async function () {
//     await expectErrorCount(this, 0)
// })
