import type { Quiz } from 'model/quiz.ts'
import { evaluate } from './quiz-score.ts'
import type { QuizAnswers } from './quiz-answers-state.ts'
import { Question } from './components/question'
import { useEffect } from 'react'

interface QuizScorePageProps {
    readonly quiz: Quiz
    readonly quizAnswers: QuizAnswers
}

export const QuizScorePage = ({ quiz, quizAnswers }: QuizScorePageProps) => {
    const score = evaluate(quiz, quizAnswers)
    const { correct, firstCorrect, total } = score

    const percentage = (correct / total) * 100
    const firstPercentage = (firstCorrect / total) * 100
    const result = percentage >= quiz.passScore ? 'passed' : 'failed'
    const firstResult = firstPercentage >= quiz.passScore ? 'passed' : 'failed'

    useEffect(() => {
        const quizId = quiz.id
        fetch(`/api/quiz/${quizId}/evaluate`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ score: percentage }),
        })
    }, [quiz.id, percentage])

    return (
        <>
            <h1>Test result</h1>

            <div className="resultTable" id="results">
                <div className="row header">
                    <div>Correct Answers</div>
                    <div>Score</div>
                    <div>Min pass score</div>
                    <div>State</div>
                </div>
                <div className="row">
                    <div>
                        <span id="correct-answers">{correct}</span> / <span id="total-questions">{total}</span>
                    </div>
                    <div>
                        <span id="percentage-result">{percentage.toFixed(0)}</span> %
                    </div>
                    <div>
                        <span id="pass-score">{quiz.passScore}</span> %
                    </div>
                    <div>
                        <span id="text-result">{result}</span>
                    </div>
                </div>
            </div>

            {quiz.afterEach && (
                <div>
                    <h2>Original result</h2>
                    <div>how would you do if it was a quiz with no correction options</div>

                    <div className="resultTable">
                        <div className="row header">
                            <div>Correct Answers</div>
                            <div>Score</div>
                            <div>Min pass score</div>
                            <div>State</div>
                        </div>
                        <div className="row">
                            <div>
                                <span id="first-correct-answers">{firstCorrect}</span> / <span>{total}</span>
                            </div>
                            <div>
                                <span id="first-percentage-result">{firstPercentage.toFixed(0)}</span> %
                            </div>
                            <div>
                                <span id="first-pass-score">{quiz.passScore}</span> %
                            </div>
                            <div>
                                <span id="first-text-result">{firstResult}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <h2>Answer overview</h2>
            {quiz.questions.map((question, idx) => (
                <Question question={question} selectedAnswerIdxs={quizAnswers.finalAnswers[idx]} />
            ))}
        </>
    )
}
