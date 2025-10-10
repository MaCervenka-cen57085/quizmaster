import { Button, SubmitButton } from 'pages/components'
import { preventDefault } from 'helpers.ts'
import {
    type AnswerData,
    AnswersEdit,
    MultipleChoiceEdit,
    QuestionEdit,
    QuestionExplanationEdit,
    EasyModeChoiceEdit,
    type QuestionFormData,
} from 'pages/make/create-question/form'

interface QuestionEditProps {
    readonly questionData: QuestionFormData
    readonly setQuestionData: (questionData: QuestionFormData) => void
    readonly onSubmit: () => void
    readonly handleQuestionDelete: () => void
    readonly isEdit: boolean
}

function setMultipleChoiceInQuestionData(isMultipleChoice: boolean, questionData: QuestionFormData): QuestionFormData {
    const numberOfCorrectAnswers = questionData.answers.filter(answer => answer.isCorrect).length

    return {
        ...questionData,
        isMultipleChoice,
        answers:
            !isMultipleChoice && numberOfCorrectAnswers > 1
                ? questionData.answers.map(answer => ({ ...answer, isCorrect: false }))
                : questionData.answers,
    }
}

function setEasyModeChoiceInQuestionData(isEasyModeChoice: boolean, questionData: QuestionFormData): QuestionFormData {
    return {
        ...questionData,
        isEasyModeChoice,
    }
}

export const QuestionEditForm = ({
    questionData,
    setQuestionData,
    onSubmit,
    handleQuestionDelete,
    isEdit,
}: QuestionEditProps) => {
    const setQuestion = (question: string) => setQuestionData({ ...questionData, question })
    const setIsMultipleChoice = (isMultipleChoice: boolean) =>
        setQuestionData(setMultipleChoiceInQuestionData(isMultipleChoice, questionData))
    const setIsEasyModeChoice = (isEasyModeChoice: boolean) =>
        setQuestionData(setEasyModeChoiceInQuestionData(isEasyModeChoice, questionData))
    const setAnswers = (answers: readonly AnswerData[]) => setQuestionData({ ...questionData, answers })
    const setQuestionExplanation = (questionExplanation: string) =>
        setQuestionData({ ...questionData, questionExplanation })

    return (
        <form id="question-create-form" onSubmit={preventDefault(onSubmit)}>
            <QuestionEdit question={questionData.question} setQuestion={setQuestion} />
            <div className="questiion-options">
                <MultipleChoiceEdit
                    isMultipleChoice={questionData.isMultipleChoice}
                    setIsMultipleChoice={setIsMultipleChoice}
                />
                {questionData.isMultipleChoice && (
                    <EasyModeChoiceEdit
                        isEasyModeChoice={questionData.isEasyModeChoice}
                        setIsEasyModeChoice={setIsEasyModeChoice}
                    />
                )}
            </div>
            <AnswersEdit
                answers={questionData.answers}
                setAnswers={setAnswers}
                isMultichoiceQuestion={questionData.isMultipleChoice}
            />
            <QuestionExplanationEdit
                questionExplanation={questionData.questionExplanation}
                setQuestionExplanation={setQuestionExplanation}
            />
            <div className="flex-container">
                <SubmitButton />
                {isEdit && (
                    <Button
                        onClick={handleQuestionDelete}
                        disabled={!questionData.isDeletable}
                        title={!questionData.isDeletable ? 'Otázku nelze smazat je obsažena v kvízu!' : ''}
                        dataTestId="delete-button"
                        className="secondary button"
                    >
                        Delete question
                    </Button>
                )}
            </div>
        </form>
    )
}
