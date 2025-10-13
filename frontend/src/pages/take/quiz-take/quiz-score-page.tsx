import type { Quiz } from 'model/quiz.ts'
import type { QuizScore } from './quiz-score.ts'
import { Question } from './components/question'

interface QuizScorePageProps {
    readonly quiz: Quiz
    readonly score: QuizScore
}

export const QuizScorePage = ({ quiz, score }: QuizScorePageProps) => {
    const { correct, firstCorrect, total } = score
    const percentage = (correct / total) * 100
    const firstPercentage = (firstCorrect / total) * 100
    const result = percentage >= quiz.passScore ? 'passed' : 'failed'
    const firstResult = firstPercentage >= quiz.passScore ? 'passed' : 'failed'

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
            {quiz.questions.map(question => (
                <Question key={question.id} question={question} isMultipleChoice={question.correctAnswers.length > 1} />
            ))}
        </>
    )
}
