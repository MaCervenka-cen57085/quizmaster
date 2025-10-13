import type { AnswerIdxs, Quiz } from 'model/quiz-question'
import { QuestionForm } from '../question-take/index.ts'
import { useState } from 'react'
import { ProgressBar } from './components/progress-bar.tsx'
import { EvaluateButton, NextButton, BackButton, SkipButton, BookmarkButton } from './components/buttons.tsx'

import { BookmarkList } from './components/bookmark-list.tsx'
import { useStateSet } from 'helpers.ts'
import { Countdown } from './components/countdown.tsx'
import { TimeOutReachedModal } from './components/timeout-reached-modal.tsx'

interface QuizQuestionProps {
    readonly onEvaluate: () => void
    readonly quiz: Quiz
    firstQuizState: QuizState
    quizState: QuizState
    setFirstQuizState: (firstQuizState: QuizState) => void
    setQuizState: (quizState: QuizState) => void
}

export type QuizState = readonly AnswerIdxs[]

export const QuizQuestionForm = (props: QuizQuestionProps) => {
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
    const [skippedQuestions, , addSkippedQuestion, removeSkippedQuestion] = useStateSet<number>()
    const [bookmarkedQuestions, toggleBookmarkQuestion, , removeBookmarkQuestion] = useStateSet<number>()
    const currentQuestion = props.quiz.questions[currentQuestionIdx]
    const isLastQuestion = currentQuestionIdx === props.quiz.questions.length - 1
    const isFirstQuestion = currentQuestionIdx === 0
    const [timeoutReached, setTimeoutReached] = useState(false)

    const isAnswered = props.quizState[currentQuestionIdx] !== undefined

    const onSubmitted = (selectedAnswerIdxs: AnswerIdxs) => {
        const newQuizState = Array.from(props.quizState)
        newQuizState[currentQuestionIdx] = selectedAnswerIdxs
        props.setQuizState(newQuizState)

        if (props.firstQuizState[currentQuestionIdx] === undefined) {
            const newFirstQuizState = Array.from(props.firstQuizState)
            newFirstQuizState[currentQuestionIdx] = selectedAnswerIdxs
            props.setFirstQuizState(newFirstQuizState)
        }

        removeSkippedQuestion(currentQuestionIdx)
        props.quiz.questions[currentQuestionIdx].userInput = selectedAnswerIdxs
    }

    const onNext = () => {
        if (isLastQuestion) {
            const firstSkippedQuestion = Array.from(skippedQuestions).sort()[0]
            setCurrentQuestionIdx(firstSkippedQuestion)
        } else {
            setCurrentQuestionIdx(prev => prev + 1)
        }
    }
    const onSkip = () => {
        addSkippedQuestion(currentQuestionIdx)
        onNext()
    }
    const onBack = () => setCurrentQuestionIdx(prev => prev - 1)
    const onSubmittedAndNext = (selectedAnswerIdxs: AnswerIdxs) => {
        onSubmitted(selectedAnswerIdxs)
        if (!isLastQuestion) {
            onNext()
        }
    }
    const onBookmark = () => toggleBookmarkQuestion(currentQuestionIdx)

    const handleBookmarkClick = (idx: number) => {
        setCurrentQuestionIdx(idx)
    }

    // Prepare bookmarks for BookmarkList
    const bookmarks = Array.from(bookmarkedQuestions).map(idx => ({
        title: props.quiz.questions[idx].question,
        onClick: () => handleBookmarkClick(idx),
        onDelete: () => removeBookmarkQuestion(idx),
    }))

    const anySkippedQuestions = skippedQuestions.size > 0
    const isQuestionSkipable = !isAnswered && (!isLastQuestion || anySkippedQuestions)

    return (
        <div>
            <Countdown setTimeoutReached={setTimeoutReached} timeLimit={props.quiz.timeLimit} />
            {timeoutReached && <TimeOutReachedModal onEvaluate={props.onEvaluate} timeoutReached={timeoutReached} />}
            <h2>Quiz</h2>
            <ProgressBar current={currentQuestionIdx + 1} total={props.quiz.questions.length} />

            <div
                className={bookmarkedQuestions.has(currentQuestionIdx) ? 'bookmarked' : ''}
                data-testid="bookmark-toggle"
            >
                <QuestionForm
                    key={currentQuestion.id}
                    question={currentQuestion}
                    onSubmitted={props.quiz.afterEach ? onSubmitted : onSubmittedAndNext}
                    afterEach={props.quiz.afterEach}
                />
            </div>
            <div
                style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px', marginBottom: '20px' }}
            >
                {!isFirstQuestion && <BackButton onClick={onBack} />}
                {isAnswered &&
                    (!isLastQuestion || anySkippedQuestions ? (
                        <NextButton onClick={onNext} />
                    ) : (
                        <EvaluateButton onClick={props.onEvaluate} />
                    ))}
                {isQuestionSkipable && <SkipButton onClick={onSkip} />}
                <BookmarkButton isBookmarked={bookmarkedQuestions.has(currentQuestionIdx)} onClick={onBookmark} />
            </div>

            {/* Bookmark list visible for tests */}
            <BookmarkList bookmarks={bookmarks} />
        </div>
    )
}
