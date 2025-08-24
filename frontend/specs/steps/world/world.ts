import type { Page, TestInfo } from '@playwright/test'

import {
    CreateQuestionPage,
    CreateQuestionListPage,
    QuizQuestionPage,
    TakeQuestionPage,
    QuizScorePage,
    CreateQuizPage,
    QuizWelcomePage,
    QuestionListPage,
    HomePage,
} from '../../pages'
import { emptyQuestion, type Question } from './question.ts'
import { type QuizBookmark } from './quiz.ts'

export class QuizmasterWorld {
    constructor(
        public page: Page,
        public testInfo: TestInfo,
    ) {
        this.createQuestionPage = new CreateQuestionPage(this.page)
        this.createQuestionListPage = new CreateQuestionListPage(this.page)
        this.takeQuestionPage = new TakeQuestionPage(this.page)
        this.quizQuestionPage = new QuizQuestionPage(this.page)
        this.quizWelcomePage = new QuizWelcomePage(this.page)
        this.quizScorePage = new QuizScorePage(this.page)
        this.createQuizPage = new CreateQuizPage(this.page)
        this.questionListPage = new QuestionListPage(this.page)
        this.homePage = new HomePage(this.page)
    }

    readonly createQuizPage: CreateQuizPage
    readonly createQuestionPage: CreateQuestionPage
    readonly createQuestionListPage: CreateQuestionListPage
    readonly takeQuestionPage: TakeQuestionPage
    readonly quizQuestionPage: QuizQuestionPage
    readonly quizWelcomePage: QuizWelcomePage
    readonly quizScorePage: QuizScorePage
    readonly questionListPage: QuestionListPage
    readonly homePage: HomePage
    quizId = ''

    questionWip: Question = emptyQuestion()
    questionListWipGuid = ''
    nextAnswerIdx = 0
    questionBookmarks: Record<string, Question> = {}
    activeQuestionBookmark = ''
    get activeQuestion() {
        return this.questionBookmarks[this.activeQuestionBookmark]
    }

    quizBookmarks: Record<string, QuizBookmark> = {}

    parseAnswers(answersString: string) {
        return answersString.split(',').map(answer => answer.trim())
    }
}
