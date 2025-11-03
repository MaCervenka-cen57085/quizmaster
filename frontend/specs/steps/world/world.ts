import type { Page, TestInfo } from '@playwright/test'

import {
    WorkspaceCreatePage,
    HomePage,
    QuestionEditPage,
    WorkspacePage,
    QuizCreatePage,
    QuizQuestionPage,
    QuizScorePage,
    QuizWelcomePage,
    TakeQuestionPage,
    QuizStatisticsPage,
} from '../../pages'
import { emptyQuestion, type Question } from './question.ts'
import { emptyQuiz, type Quiz, type QuizBookmark } from './quiz.ts'

export class QuizmasterWorld {
    constructor(
        public page: Page,
        public testInfo: TestInfo,
    ) {
        this.questionEditPage = new QuestionEditPage(this.page)
        this.workspaceCreatePage = new WorkspaceCreatePage(this.page)
        this.takeQuestionPage = new TakeQuestionPage(this.page)
        this.quizQuestionPage = new QuizQuestionPage(this.page)
        this.quizWelcomePage = new QuizWelcomePage(this.page)
        this.quizStatisticsPage = new QuizStatisticsPage(this.page)
        this.quizScorePage = new QuizScorePage(this.page)
        this.workspacePage = new WorkspacePage(this.page)
        this.quizCreatePage = new QuizCreatePage(this.page)
        this.homePage = new HomePage(this.page)
    }

    readonly questionEditPage: QuestionEditPage
    readonly workspaceCreatePage: WorkspaceCreatePage
    readonly takeQuestionPage: TakeQuestionPage
    readonly quizQuestionPage: QuizQuestionPage
    readonly quizWelcomePage: QuizWelcomePage
    readonly quizStatisticsPage: QuizStatisticsPage
    readonly quizScorePage: QuizScorePage
    readonly workspacePage: WorkspacePage
    readonly quizCreatePage: QuizCreatePage
    readonly homePage: HomePage
    quizId = ''

    questionWip: Question = emptyQuestion()
    quizWip: Quiz = emptyQuiz()
    nextAnswerIdx = 0
    questionBookmarks: Record<string, Question> = {}
    activeQuestionBookmark = ''
    get activeQuestion() {
        return this.questionBookmarks[this.activeQuestionBookmark]
    }

    quizBookmarks: Record<string, QuizBookmark> = {}
    activeQuizBookmark = ''

    parseAnswers(answersString: string) {
        return answersString.split(',').map(answer => answer.trim())
    }
}
