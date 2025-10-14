import type { AnswerIdxs } from 'model/quiz-question'
import type { Quiz } from 'model/quiz.ts'
import { QuestionForm } from '../question-take/index.ts'
import { ProgressBar } from './components/progress-bar.tsx'
import { EvaluateButton, NextButton, BackButton, SkipButton, BookmarkButton } from './components/buttons.tsx'

import { BookmarkList } from './components/bookmark-list.tsx'
import { useStateSet } from 'helpers.ts'
import { TimeLimit } from './time-limit/with-time-limit.tsx'
import { useQuizAnswersState, type QuizAnswers } from './quiz-answers-state.ts'
import { useQuizNavigationState } from './quiz-navigation-state.ts'

interface QuizQuestionProps {
    readonly quiz: Quiz
    readonly onEvaluate: (quizAnswers: QuizAnswers) => void
}

export type QuizState = readonly AnswerIdxs[]

export const QuizQuestionForm = (props: QuizQuestionProps) => {
    const [bookmarkedQuestions, toggleBookmarkQuestion, , removeBookmarkQuestion] = useStateSet<number>()

    const { quizAnswers, answerQuestion } = useQuizAnswersState()
    const nav = useQuizNavigationState(props.quiz)

    const answer = (selectedAnswerIdxs: AnswerIdxs) => {
        answerQuestion(nav.currentQuestionIdx, selectedAnswerIdxs)
        nav.unskip()
    }

    const answerAndNext = (selectedAnswerIdxs: AnswerIdxs) => {
        answer(selectedAnswerIdxs)
        if (!nav.isLastQuestion) {
            nav.next()
        }
    }

    const onBookmark = () => toggleBookmarkQuestion(nav.currentQuestionIdx)

    // Prepare bookmarks for BookmarkList
    const bookmarks = Array.from(bookmarkedQuestions).map(idx => ({
        title: props.quiz.questions[idx].question,
        onClick: () => nav.goto(idx),
        onDelete: () => removeBookmarkQuestion(idx),
    }))

    const evaluate = () => props.onEvaluate(quizAnswers)

    const currentQuestion = props.quiz.questions[nav.currentQuestionIdx]
    const currentAnswers = quizAnswers.finalAnswers[nav.currentQuestionIdx]
    const isAnswered = currentAnswers !== undefined

    return (
        <div>
            <TimeLimit timeLimit={props.quiz.timeLimit} onConfirm={evaluate} />
            <h2>Quiz</h2>
            <ProgressBar current={nav.currentQuestionIdx + 1} total={props.quiz.questions.length} />

            <div
                className={bookmarkedQuestions.has(nav.currentQuestionIdx) ? 'bookmarked' : ''}
                data-testid="bookmark-toggle"
            >
                <QuestionForm
                    key={currentQuestion.id}
                    question={currentQuestion}
                    selectedAnswerIdxs={quizAnswers.finalAnswers[nav.currentQuestionIdx]}
                    onSubmitted={props.quiz.afterEach ? answer : answerAndNext}
                    afterEach={props.quiz.afterEach}
                />
            </div>
            <div
                style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px', marginBottom: '20px' }}
            >
                {nav.canBack && <BackButton onClick={nav.back} />}
                {isAnswered && nav.canNext && <NextButton onClick={nav.next} />}
                {isAnswered && !nav.canNext && <EvaluateButton onClick={evaluate} />}
                {!isAnswered && nav.canNext && <SkipButton onClick={nav.skip} />}
                <BookmarkButton isBookmarked={bookmarkedQuestions.has(nav.currentQuestionIdx)} onClick={onBookmark} />
            </div>

            {/* Bookmark list visible for tests */}
            <BookmarkList bookmarks={bookmarks} />
        </div>
    )
}
