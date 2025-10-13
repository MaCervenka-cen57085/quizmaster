import { HomePage } from 'pages/make/home'
import { QuestionTakePage } from 'pages/take/question-take'
import { QuizTakePage } from 'pages/take/quiz-take/quiz-take-page.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { QuizWelcomePage } from 'pages/take/quiz-take/quiz-welcome/quiz-welcome-page'

import { QuestionListCreatePage } from 'pages/make/create-question-list/question-list-create-page'
import { CreateQuestionContainer } from 'pages/make/create-question/create-question-container'
import { EditQuestionContainer } from 'pages/make/create-question/edit-question-container'
import { QuestionListContainer } from 'pages/make/question-list/question-list-container'
import { QuizCreatePage } from 'pages/make/quiz-create/quiz-create-page.tsx'

export const App = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/question/new" element={<CreateQuestionContainer />} />
            <Route path="/q-list/new" element={<QuestionListCreatePage />} />
            <Route path="/q-list/:id" element={<QuestionListContainer />} />
            <Route path="/quiz/:id" element={<QuizWelcomePage />} />
            <Route path="/quiz/:id/questions" element={<QuizTakePage />} />
            <Route path="/quiz-create/new" element={<QuizCreatePage />} />
            <Route path="/question/:id/edit" element={<EditQuestionContainer />} />
            <Route path="/question/:id" element={<QuestionTakePage />} />
            <Route path="/" element={<HomePage />} />
        </Routes>
    </BrowserRouter>
)
