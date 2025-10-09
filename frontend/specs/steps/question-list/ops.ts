import type { QuizmasterWorld } from '../world'

export const openCreateQuestionListPage = async (world: QuizmasterWorld) => {
    world.questionListCreatePage.gotoNew()
}
