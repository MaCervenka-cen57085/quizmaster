import { When } from '../fixture.ts'
import type { QuizmasterWorld } from '../world/world.ts'

const answer = async (world: QuizmasterWorld, n: number) => {
    await world.takeQuestionPage.selectAnswerNth(n)
    await world.takeQuestionPage.submit()
}

const answerCorrectly = (world: QuizmasterWorld) => async () => answer(world, 0)
const answerIncorrectly = (world: QuizmasterWorld) => async () => answer(world, 1)

const nTimes = async (n: number, fn: () => Promise<void>) => {
    for (let i = 0; i < n; i++) await fn()
}

When('I answer the question', async function () {
    await answerCorrectly(this)()
})

When('I answer {int} questions correctly', async function (correct: number) {
    await nTimes(correct, answerCorrectly(this))
})

When('I answer {int} questions incorrectly', async function (incorrect: number) {
    await nTimes(incorrect, answerIncorrectly(this))
})

When('I navigate to the next question', async function () {
    await this.quizQuestionPage.next()
})
