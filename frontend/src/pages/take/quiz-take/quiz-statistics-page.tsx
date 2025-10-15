import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import type { Quiz } from 'model/quiz.ts'

export const QuizStatisticsPage = () => {
    const params = useParams()

    const quizId = params.id

    const [quizData, setQuizData] = useState<Quiz | null>(null)

    useEffect(() => {
        const fetchQuiz = async () => {
            const response = await fetch(`/api/quiz/${quizId}`)
            const data = await response.json()
            setQuizData(data)
        }
        fetchQuiz()
    }, [quizId])

    return (
        <>
            <h2>Quiz statistics</h2>
            for quiz: <h3 id="quiz-name">{quizData?.title}</h3>
            <p id="quiz-description">{quizData?.description}</p>
            {quizData && (
                <div>
                    <p>
                        Times taken: <span id="times-taken">{quizData?.timesTaken}</span>
                    </p>
                    <p>
                        Times finished: <span id="times-finished">{quizData?.timesFinished}</span>
                    </p>
                    <p>
                        Average score: <span id="average-score">{quizData?.averageScore} %</span>
                    </p>
                </div>
            )}
        </>
    )
}
