import { Route, Routes, BrowserRouter } from 'react-router-dom'
import { QuestionTakePage } from 'pages/question-take'
import { HomePage } from 'pages/home'
import { QuizPage } from 'pages/quiz'

import { QuizWelcomePage } from 'pages/quiz-welcome/quiz-welcome-page.tsx'

import { CreateQuestionContainer } from 'pages/create-question/create-question-container'
import { CreateQuestionListContainer } from 'pages/create-question-list/create-question-list-container'
import { EditQuestionContainer } from 'pages/create-question/edit-question-container'
import { QuestionListContainer } from 'pages/question-list/question-list-container'

export const App = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/question/new" element={<CreateQuestionContainer />} />
            <Route path="/q-list/new" element={<CreateQuestionListContainer />} />
            <Route path="/q-list/:id" element={<QuestionListContainer />} />
            <Route path="/quiz/:id" element={<QuizWelcomePage />} />
            <Route path="/quiz/:id/questions" element={<QuizPage />} />
            <Route path="/question/:id/edit" element={<EditQuestionContainer />} />
            <Route path="/question/:id" element={<QuestionTakePage />} />
            <Route path="/" element={<HomePage />} />
        </Routes>
    </BrowserRouter>
)
