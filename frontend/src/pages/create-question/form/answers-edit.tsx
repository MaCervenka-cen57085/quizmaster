import { type AnswerData, emptyAnswerData } from './question-form-data.ts'

interface AnswerRowProps {
    readonly answer: AnswerData
    readonly index: number
    readonly isMultichoiceQuestion: boolean
    readonly updateAnswerData: (index: number, newValue: Partial<AnswerData>) => void
}

export const AnswerRow = ({ answer, index, isMultichoiceQuestion, updateAnswerData }: AnswerRowProps) => (
    <div key={`answer-${index}`} className="answer-row" id={`answer-${index}`}>
        <div className="answer-row-section">
            <input
                className={!isMultichoiceQuestion ? 'answer-isCorrect-checkbox' : 'answer-isCorrect-checkbox-multi'}
                type="checkbox"
                checked={answer.isCorrect}
                onChange={e => updateAnswerData(index, { isCorrect: e.target.checked })}
            />
            <span className="answer-row-correct-icon">{answer.isCorrect ? '✅' : '❌'}</span>
            <span className="answer-row-correct-text">{answer.isCorrect ? 'Correct answer' : 'Incorrect answer'}</span>
        </div>
        <div className="answer-row-section">
            <input
                className="text"
                type="text"
                placeholder={`Input answer ${index + 1} here...`}
                value={answer.answer}
                onChange={e => updateAnswerData(index, { answer: e.target.value })}
            />
        </div>
        <div className="answer-row-section">
            <input
                className="explanation"
                type="text"
                placeholder="You add explanation of the anwser here..."
                value={answer.explanation}
                onChange={e => updateAnswerData(index, { explanation: e.target.value })}
            />
        </div>
    </div>
)

interface AddAnswerProps {
    readonly addAnswer: () => void
}

export const AddAnswerButton = ({ addAnswer }: AddAnswerProps) => (
    <div>
        <button type="button" onClick={addAnswer} className="secondary button" id="add-answer">
            Add Answer
        </button>
    </div>
)

interface AnswersProps {
    readonly answers: readonly AnswerData[]
    readonly isMultichoiceQuestion: boolean
    readonly setAnswers: (answers: readonly AnswerData[]) => void
}

const updateIsCorrect = (
    answers: readonly AnswerData[],
    index: number,
    isMultichoiceQuestion: boolean,
    isCorrect: boolean,
) => {
    const newAnswers = [...answers]
    if (isMultichoiceQuestion) {
        newAnswers[index] = { ...newAnswers[index], isCorrect: isCorrect }
    } else {
        newAnswers.forEach((answer, i) => {
            newAnswers[i] = { ...answer, isCorrect: index === i }
        })
    }
    return newAnswers
}

export const AnswersEdit = ({ answers, isMultichoiceQuestion, setAnswers }: AnswersProps) => {
    const updateAnswerData = (index: number, newValue: Partial<AnswerData>) => {
        let newAnswerData = [...answers]
        if ('isCorrect' in newValue) {
            const isCorrect = newValue.isCorrect || false
            newAnswerData = updateIsCorrect(newAnswerData, index, isMultichoiceQuestion, isCorrect)
        } else {
            newAnswerData[index] = { ...newAnswerData[index], ...newValue }
        }
        setAnswers(newAnswerData)
    }

    const addAnswer = () => setAnswers([...answers, emptyAnswerData()])

    return (
        <>
            <h3 className="answers-header">Enter your answers</h3>
            {answers.map((answer, index) => (
                <AnswerRow
                    answer={answer}
                    // key={index}
                    index={index}
                    isMultichoiceQuestion={isMultichoiceQuestion}
                    updateAnswerData={updateAnswerData}
                />
            ))}
            <AddAnswerButton addAnswer={addAnswer} />
        </>
    )
}
