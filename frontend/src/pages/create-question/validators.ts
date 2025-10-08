import type { ErrorCode } from './form/error-message'
import type { QuestionFormData } from './form/question-form-data'

export function validateQuestionFormData(questionForm: QuestionFormData): Set<ErrorCode> {
    const errors = new Set<ErrorCode>()

    const answers = questionForm.answers
    const correctAnwerCount = answers.filter(answer => answer.isCorrect).length
    const emptyAnswerCount = answers.filter(answer => answer.answer.trim() === '').length
    const emptyExplanationCount = answers.filter(answer => answer.explanation.trim() === '').length
    const nonEmptyExplanationCount = answers.filter(answer => answer.explanation.trim() !== '').length

    if (questionForm.question === '') errors.add('empty-question')
    if (emptyAnswerCount > 0) errors.add('empty-answer')
    if (correctAnwerCount === 0) errors.add('no-correct-answer')
    if (questionForm.isMultipleChoice && correctAnwerCount < 2)
        errors.add('multiple-choice-must-have-more-correct-answers')
    if (emptyExplanationCount > 0 && nonEmptyExplanationCount > 0) errors.add('empty-answer-explanation')

    return errors
}
