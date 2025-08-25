import type { TableOf } from '../common.ts'
import { emptyQuestion, type QuizmasterWorld } from '../world'

export type AnswerRaw = [string, '*' | '', string]

// if change this value, also change in frontend/src/pages/create-question/create-question.tsx
const NUM_ANSWERS = 2

export const openCreatePage = async (world: QuizmasterWorld) => {
    world.questionEditPage.gotoNew()
    world.questionWip = emptyQuestion()
}

export const enterQuestion = async (world: QuizmasterWorld, question: string) => {
    await world.questionEditPage.enterQuestion(question)
    world.questionWip.question = question
}

export const enterAnswer = async (
    world: QuizmasterWorld,
    index: number,
    answer: string,
    isCorrect: boolean,
    explanation: string,
) => {
    await world.questionEditPage.enterAnswer(index, answer, isCorrect, explanation)
    world.questionWip.answers[index] = { answer, isCorrect, explanation }
}

export const saveQuestion = async (world: QuizmasterWorld, bookmark: string) => {
    await world.questionEditPage.submit()
    world.questionWip.url = (await world.questionEditPage.questionUrl()) || ''
    world.questionWip.editUrl = (await world.questionEditPage.questionEditUrl()) || ''
    world.questionBookmarks[bookmark] = world.questionWip
}

export const addAnswer = async (world: QuizmasterWorld, i: number) => {
    await world.questionEditPage.addAnswer(i)
}

export const addAnswers = async (world: QuizmasterWorld, answerRawTable: TableOf<AnswerRaw>) => {
    const raw = answerRawTable.raw()

    const isMultipleChoice = raw.filter(([_, correct]) => correct === '*').length > 1
    if (isMultipleChoice) await world.questionEditPage.setMultipleChoice()

    for (let i = 0; i < raw.length; i++) {
        if (i >= NUM_ANSWERS) await addAnswer(world, i)
        const [answer, correct, explanation] = raw[i]
        const isCorrect = correct === '*'
        await enterAnswer(world, i, answer, isCorrect, explanation || '')
    }
}

export const createQuestion = async (
    world: QuizmasterWorld,
    bookmark: string,
    question: string,
    answerRawTable: TableOf<AnswerRaw>,
) => {
    await openCreatePage(world)
    await enterQuestion(world, question)
    await addAnswers(world, answerRawTable)
    await saveQuestion(world, bookmark)
}
