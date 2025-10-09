import { QuizmasterWorld } from '../world'

export const openCreateQuestionListPage = async (world: QuizmasterWorld) => {
    world.createQuestionListPage.gotoNew()
}
