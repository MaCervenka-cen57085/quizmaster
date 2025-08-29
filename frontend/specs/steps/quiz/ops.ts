import { emptyQuiz, type QuizmasterWorld } from '../world'

export const openCreatePage = async (world: QuizmasterWorld) => {
    await world.quizEditPage.gotoNew()
    world.quizWip = emptyQuiz()
}

export const enterPassScore = async (world: QuizmasterWorld, passScore: number) => {
    await world.quizEditPage.enterPassScore(passScore)
    world.quizWip.passScore = passScore
}
