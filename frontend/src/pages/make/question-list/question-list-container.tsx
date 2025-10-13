import './question-list.scss'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { useApi } from 'api/hooks'
import { fetchQuestionList, fetchListQuestions } from 'api/question-list'
import type { QuizQuestion } from 'model/quiz-question'
import type { QuestionList } from 'model/question-list'
import { QuestionListComponent } from './question-list'

export function QuestionListContainer() {
    const params = useParams()

    const [listInfo, setListInfo] = useState<QuestionList>({ guid: params.id || '', title: '' })
    const [listQuestions, setListQuestions] = useState<readonly QuizQuestion[]>([])

    useApi(params.id, fetchQuestionList, setListInfo)
    useApi(params.id, fetchListQuestions, setListQuestions)

    return <QuestionListComponent questionList={listInfo} questions={listQuestions} />
}
