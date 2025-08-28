import type { QuizQuestion } from 'model/quiz-question'
import { Question } from './question'

export interface QuizScore {
    readonly correct: number
    readonly firstCorrect: number
    readonly total: number
}

interface QuizScoreProps {
    readonly score: QuizScore
    readonly questions: QuizQuestion[]
    readonly passScore: number
    readonly showFirstAnwers: boolean
}

export const QuizScore = ({ score, questions, passScore, showFirstAnwers }: QuizScoreProps) => {
    const { correct, firstCorrect, total } = score
    const percentage = (correct / total) * 100
    const firstPercentage = (firstCorrect / total) * 100
    const result = percentage >= passScore ? 'passed' : 'failed'
    const firstResult = firstPercentage >= passScore ? 'passed' : 'failed'

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
                        <span id="pass-score">{passScore}</span> %
                    </div>
                    <div>
                        <span id="text-result">{result}</span>
                    </div>
                </div>
            </div>

            {showFirstAnwers && (
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
                                <span id="first-pass-score">{passScore}</span> %
                            </div>
                            <div>
                                <span id="first-text-result">{firstResult}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <h2>Answer overview</h2>
            {questions.map(question => (
                <Question key={question.id} question={question} isMultipleChoice={question.correctAnswers.length > 1} />
            ))}
        </>
    )
}
