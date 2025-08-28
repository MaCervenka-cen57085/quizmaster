import { ErrorCode } from "./form/error-message";
import { QuestionFormData } from "./form/question-form-data";

export function validateQuestionFormData(questionForm: QuestionFormData): Set<ErrorCode> {
    let errors = new Set<ErrorCode>();
    const correctAnwerCount = questionForm.answers.filter(answer => answer.isCorrect).length
    const emptyAnswerCount = questionForm.answers.filter(answer => answer.answer.trim() === '').length
    const emptyExplanationCount = questionForm.answers.filter(answer => answer.explanation.trim() === '').length
    const nonEmptyExplanationCount = questionForm.answers.filter(answer => answer.explanation.trim() !== '').length

    if (questionForm.question === '') errors.add('empty-question')
    if (emptyAnswerCount > 0) errors.add('empty-answer')
    if (correctAnwerCount === 0) errors.add('no-correct-answer')
    if (emptyExplanationCount > 0 && nonEmptyExplanationCount > 0) errors.add('empty-answer-explanation')

    return errors;
}
