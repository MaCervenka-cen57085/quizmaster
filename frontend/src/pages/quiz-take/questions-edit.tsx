interface Props {
    index: number
    question: string
    updateQuestions: (index: number, newValue: string) => void
}

export const QuestionsEdit = ({ index, question, updateQuestions }: Props) => {
    return (
        <div>
            <input
                id={`question-text-${index}`}
                type="text"
                value={question}
                onChange={e => {
                    updateQuestions(index, e.target.value)
                }}
            />
        </div>
    )
}
