import { emptyQuiz, type QuizmasterWorld } from '../world'

export const openCreatePage = async (world: QuizmasterWorld) => {
    await world.quizEditPage.gotoNew()
    world.quizWip = emptyQuiz()
}
