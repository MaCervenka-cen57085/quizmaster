import type { AnswerIdxs } from 'model/quiz-question'
import type { Quiz } from 'model/quiz.ts'
import { QuestionForm } from '../question-take/index.ts'
import { useState } from 'react'
import { ProgressBar } from './components/progress-bar.tsx'
import { EvaluateButton, NextButton, BackButton, SkipButton, BookmarkButton } from './components/buttons.tsx'

import { BookmarkList } from './components/bookmark-list.tsx'
import { useStateSet } from 'helpers.ts'
import { TimeLimit } from './time-limit/with-time-limit.tsx'
import { useQuizAnswersState, type QuizAnswers } from './quiz-take-state.ts'

interface QuizQuestionProps {
    readonly quiz: Quiz
    readonly onEvaluate: (quizAnswers: QuizAnswers) => void
}

export type QuizState = readonly AnswerIdxs[]

export const QuizQuestionForm = (props: QuizQuestionProps) => {
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
    const [skippedQuestions, , addSkippedQuestion, removeSkippedQuestion] = useStateSet<number>()
    const [bookmarkedQuestions, toggleBookmarkQuestion, , removeBookmarkQuestion] = useStateSet<number>()
    const currentQuestion = props.quiz.questions[currentQuestionIdx]
    const isLastQuestion = currentQuestionIdx === props.quiz.questions.length - 1
    const isFirstQuestion = currentQuestionIdx === 0

    const { quizAnswers, answerQuestion } = useQuizAnswersState()

    const isAnswered = quizAnswers.finalAnswers[currentQuestionIdx] !== undefined

    const onSubmitted = (selectedAnswerIdxs: AnswerIdxs) => {
        answerQuestion(currentQuestionIdx, selectedAnswerIdxs)
        removeSkippedQuestion(currentQuestionIdx)
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

    const onEvaluate = () => props.onEvaluate(quizAnswers)

    const anySkippedQuestions = skippedQuestions.size > 0
    const isQuestionSkipable = !isAnswered && (!isLastQuestion || anySkippedQuestions)

    return (
        <div>
            <TimeLimit timeLimit={props.quiz.timeLimit} onConfirm={onEvaluate} />
            <h2>Quiz</h2>
            <ProgressBar current={currentQuestionIdx + 1} total={props.quiz.questions.length} />

            <div
                className={bookmarkedQuestions.has(currentQuestionIdx) ? 'bookmarked' : ''}
                data-testid="bookmark-toggle"
            >
                <QuestionForm
                    key={currentQuestion.id}
                    question={currentQuestion}
                    selectedAnswerIdxs={quizAnswers.finalAnswers[currentQuestionIdx]}
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
                        <EvaluateButton onClick={onEvaluate} />
                    ))}
                {isQuestionSkipable && <SkipButton onClick={onSkip} />}
                <BookmarkButton isBookmarked={bookmarkedQuestions.has(currentQuestionIdx)} onClick={onBookmark} />
            </div>

            {/* Bookmark list visible for tests */}
            <BookmarkList bookmarks={bookmarks} />
        </div>
    )
}
