import { SubmitButton } from 'pages/components/submit-button.tsx'
import { Button } from 'pages/components/button.tsx'
import { preventDefault } from 'helpers.ts'
import {
    type AnswerData,
    AnswersEdit,
    MultipleChoiceEdit,
    QuestionEdit,
    QuestionExplanationEdit,
    EasyModeChoiceEdit,
    type QuestionFormData,
} from 'pages/create-question/form'

interface QuestionEditProps {
    readonly questionData: QuestionFormData
    readonly setQuestionData: (questionData: QuestionFormData) => void
    readonly onSubmit: () => void
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

export const QuestionEditForm = ({ questionData, setQuestionData, onSubmit }: QuestionEditProps) => {
    const setQuestion = (question: string) => setQuestionData({ ...questionData, question })
    const setIsMultipleChoice = (isMultipleChoice: boolean) =>
        setQuestionData(setMultipleChoiceInQuestionData(isMultipleChoice, questionData))
    const setIsEasyModeChoice = (isEasyModeChoice: boolean) =>
        setQuestionData(setEasyModeChoiceInQuestionData(isEasyModeChoice, questionData))
    const setAnswers = (answers: readonly AnswerData[]) => setQuestionData({ ...questionData, answers })
    const setQuestionExplanation = (questionExplanation: string) =>
        setQuestionData({ ...questionData, questionExplanation })
    const handleOnClick = () => {
        if (confirm('Opravdu chcete smazat otázku? Tuto akci nelze vrátit zpět.')) {
            console.log('Question deleted')
        }
    }

    return (
        <form id="question-create-form" onSubmit={preventDefault(onSubmit)}>
            <QuestionEdit question={questionData.question} setQuestion={setQuestion} />
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
                <Button
                    onClick={handleOnClick}
                    disabled={!questionData.isDeletable}
                    title={!questionData.isDeletable ? 'Otázku nelze smazat je obsažena v kvízu!' : ''}
                    dataTestId="delete-button"
                    className="submit-button"
                >
                    Smazat
                </Button>
            </div>
        </form>
    )
}
