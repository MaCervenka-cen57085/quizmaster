import './question-list.scss'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { QuestionList } from './question-list'
import { getQuestionList, getListQuestions } from 'api/question-list'
import type { QuestionListData } from '.'

export function QuestionListContainer() {
    const params = useParams()

    const [questionListData, setQuestionListData] = useState<QuestionListData>()

    const getQList = async () => {
        if (params.id) {
            const listInfo = await getQuestionList(params.id)
            const listQuestion = await getListQuestions(params.id)
            setQuestionListData({
                title: listInfo.title,
                questions: Array.isArray(listQuestion) ? listQuestion : [listQuestion],
            })
        }
    }

    useEffect(() => {
        getQList()
    }, [params.id])

    return <QuestionList questionListData={questionListData} onRefresh={getQList} />
}
