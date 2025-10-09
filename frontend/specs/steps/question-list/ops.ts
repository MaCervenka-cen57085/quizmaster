import type { TableOf } from '../common'
import { addAnswers, type AnswerRaw, enterQuestion } from '../question/ops'
import type { QuizmasterWorld } from '../world'

export const openCreateQuestionListPage = async (world: QuizmasterWorld) => {
    world.questionListCreatePage.gotoNew()
}

export const createQuestionList = async (world: QuizmasterWorld, name: string) => {
    await openCreateQuestionListPage(world)
    await world.questionListCreatePage.enterQuestionListName(name)
    await world.questionListCreatePage.submit()
}

export const createQuestionInList = async (
    world: QuizmasterWorld,
    question: string,
    answerRawTable: TableOf<AnswerRaw>,
) => {
    await world.questionListPage.createNewQuestion()
    await enterQuestion(world, question)
    await addAnswers(world, answerRawTable)
    await world.questionEditPage.submit()
}
