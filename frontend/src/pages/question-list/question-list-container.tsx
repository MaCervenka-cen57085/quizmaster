import './question-list.scss'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { useApi } from 'api/hooks'
import { getQuestionList, getListQuestions } from 'api/question-list'
import type { QuestionListGetResponse } from 'model/question-list-get-response'
import type { QuizQuestion } from 'model/quiz-question'
import { QuestionList } from './question-list'

export function QuestionListContainer() {
    const params = useParams()

    const [listInfo, setListInfo] = useState<QuestionListGetResponse>({ guid: params.id || '', title: '' })
    const [listQuestions, setListQuestions] = useState<readonly QuizQuestion[]>([])

    useApi(params.id, getQuestionList, setListInfo)
    useApi(params.id, getListQuestions, setListQuestions)

    return <QuestionList questionList={listInfo} questions={listQuestions} />
}
