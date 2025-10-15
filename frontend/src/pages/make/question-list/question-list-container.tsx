import './question-list.scss'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { useApi } from 'api/hooks'
import { fetchQuestionList, fetchListQuestions, fetchListQuizzes } from 'api/question-list'
import type { QuizQuestion } from 'model/quiz-question'
import type { Quiz } from 'model/quiz'
import type { QuestionList } from 'model/question-list'
import { QuestionListComponent } from './question-list'

export function QuestionListContainer() {
    const params = useParams()

    const [listInfo, setListInfo] = useState<QuestionList>({ guid: params.id || '', title: '' })
    const [listQuestions, setListQuestions] = useState<readonly QuizQuestion[]>([])
    const [listQuizzes, setListQuizzes] = useState<readonly Quiz[]>([])

    useApi(params.id, fetchQuestionList, setListInfo)
    useApi(params.id, fetchListQuestions, setListQuestions)
    useApi(params.id, fetchListQuizzes, setListQuizzes)

    return <QuestionListComponent questionList={listInfo} questions={listQuestions} quizzes={listQuizzes} />
}
