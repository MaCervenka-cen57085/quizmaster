import { type AnswerIdxs, isAnsweredCorrectly, type Quiz } from 'model/quiz-question'
import { QuestionForm } from '../question-take/index.ts'
import { useState } from 'react'
import { QuizScore } from './quiz-score.tsx'
import { ProgressBar } from './progress-bar.tsx'
import { EvaluateButton, NextButton, BackButton, SkipButton, BookmarkButton } from './buttons.tsx'
import { useParams } from 'react-router-dom'
import { getQuiz } from '../../../api/quiz.ts'

import { Countdown } from './countdown.tsx'
import { TimeOutReachedModal } from './timeout-reached-modal.tsx'
import { BookmarkList } from '../../components/bookmark-list.tsx'
import { useApi } from 'api/hooks.ts'
import { useStateSet } from 'helpers.ts'

interface QuizQuestionProps {
    readonly onEvaluate: () => void
    readonly quiz: Quiz
    firstQuizState: QuizState
    quizState: QuizState
    setFirstQuizState: (firstQuizState: QuizState) => void
    setQuizState: (quizState: QuizState) => void
}

type QuizState = readonly AnswerIdxs[]

export const QuizQuestionForm = (props: QuizQuestionProps) => {
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
    const [skippedQuestions, setSkippedQuestions] = useState<number[]>([])
    const [bookmarkedQuestions, toggleBookmarkQuestion, , removeBookmarkQuestion] = useStateSet<number>()
    const currentQuestion = props.quiz.questions[currentQuestionIdx]
    const isLastQuestion = currentQuestionIdx === props.quiz.questions.length - 1
    const isFirstQuestion = currentQuestionIdx === 0

    const isAnswered = props.quizState[currentQuestionIdx] !== undefined

    const removeCurrentQuestionFromSkippedQuestions = () => {
        setSkippedQuestions(prev => {
            return prev.filter(skippedQuestionIdx => skippedQuestionIdx !== currentQuestionIdx)
        })
    }

    const onSubmitted = (selectedAnswerIdxs: AnswerIdxs) => {
        const newQuizState = Array.from(props.quizState)
        newQuizState[currentQuestionIdx] = selectedAnswerIdxs
        props.setQuizState(newQuizState)

        if (props.firstQuizState[currentQuestionIdx] === undefined) {
            const newFirstQuizState = Array.from(props.firstQuizState)
            newFirstQuizState[currentQuestionIdx] = selectedAnswerIdxs
            props.setFirstQuizState(newFirstQuizState)
        }

        removeCurrentQuestionFromSkippedQuestions()
        props.quiz.questions[currentQuestionIdx].userInput = selectedAnswerIdxs
    }

    const onNext = () => {
        const shouldGoOnSkippedQuestion = isLastQuestion
        if (shouldGoOnSkippedQuestion) {
            setCurrentQuestionIdx(skippedQuestions[0])
        } else {
            setCurrentQuestionIdx(prev => prev + 1)
        }
    }
    const onSkip = () => {
        setSkippedQuestions(prev => {
            if (!prev.includes(currentQuestionIdx)) {
                return [...prev, currentQuestionIdx]
            }
            return prev
        })
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

    const anySkippedQuestions = skippedQuestions.length > 0
    const isQuestionSkipable = !isAnswered && (!isLastQuestion || anySkippedQuestions)

    return (
        <div>
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

export const QuizPage = () => {
    const params = useParams()
    const quizId = params.id
    const [quizScore, setQuizScore] = useState<QuizScore | null>(null)
    const isEvaluated = quizScore !== null
    const [timeoutReached, setTimeoutReached] = useState(false)
    const [quizState, setQuizState] = useState<QuizState>([])
    const [firstQuizState, setFirstQuizState] = useState<QuizState>([])

    const [quiz, setQuiz] = useState<Quiz>()

    const onEvaluate = () => {
        if (quiz) {
            setQuizScore({
                correct: quiz.questions.filter((question, idx) =>
                    isAnsweredCorrectly(quizState[idx], question.correctAnswers),
                ).length,
                firstCorrect: quiz.questions.filter((question, idx) =>
                    isAnsweredCorrectly(firstQuizState[idx], question.correctAnswers),
                ).length,
                total: quiz.questions.length,
            })
            quiz.questions.forEach((question, idx) => {
                question.userInput = quizState[idx]
            })
        }
    }

    useApi(quizId, getQuiz, setQuiz)

    if (quiz) {
        return isEvaluated ? (
            <QuizScore
                score={quizScore}
                questions={quiz.questions}
                passScore={quiz.passScore}
                showFirstAnwers={quiz.afterEach}
            />
        ) : (
            <>
                <Countdown setTimeoutReached={setTimeoutReached} timeLimit={quiz.timeLimit} />
                {timeoutReached && <TimeOutReachedModal onEvaluate={onEvaluate} timeoutReached={timeoutReached} />}
                <QuizQuestionForm
                    setFirstQuizState={setFirstQuizState}
                    setQuizState={setQuizState}
                    firstQuizState={firstQuizState}
                    quizState={quizState}
                    onEvaluate={onEvaluate}
                    quiz={quiz}
                />
            </>
        )
    }
}
