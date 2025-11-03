package cz.scrumdojo.quizmaster.question;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import cz.scrumdojo.quizmaster.quiz.Quiz;
import cz.scrumdojo.quizmaster.quiz.QuizController;
import cz.scrumdojo.quizmaster.quiz.QuizMode;

import static org.junit.jupiter.api.Assertions.*;

import java.util.UUID;

@SpringBootTest
public class QuestionControllerTest {

    @Autowired
    private QuestionController questionController;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuizController quizController;

    private static Question createSingleChoiceQuestion() {
        return Question.builder()
            .question("What is the capital of Italy?")
            .answers(new String[] { "Naples", "Rome", "Florence", "Palermo" })
            .explanations(new String[] { "Nope", "Of course!", "You wish", "Sicilia!" })
            .correctAnswers(new int[] { 2 })
            .workspaceGuid(UUID.randomUUID().toString())
            .isDeletable(true)
            .isEasyMode(false)
            .build();
    }

    private static Question createMultipleChoiceQuestion() {
        return Question.builder()
            .question("What is the cities of Italy?")
            .answers(new String[] { "Naples", "Rome", "Astana", "Paris" })
            .explanations(new String[] { "Si!", "Of course!", "Salem, but no.", "Bonjour! But no." })
            .correctAnswers(new int[] { 1, 2 })
            .workspaceGuid(UUID.randomUUID().toString())
            .isEasyMode(false)
            .build();
    }


    private static Question createMultipleChoiceQuestionWithEasyMode(boolean easyMode) {
        return Question.builder()
            .question("What is the cities of Italy?")
            .answers(new String[] { "Naples", "Rome", "Astana", "Paris" })
            .explanations(new String[] { "Si!", "Of course!", "Salem, but no.", "Bonjour! But no." })
            .correctAnswers(new int[] { 1, 2 })
            .workspaceGuid(UUID.randomUUID().toString())
            .isEasyMode(easyMode)
            .build();
    }

    @Test
    public void getQuestion() {
        var question = createSingleChoiceQuestion();
        var questionCreateResponse = questionController.saveQuestion(question);

        var result = questionController.getQuestion(questionCreateResponse.getId()).getBody();

        assertNotNull(result);
        assertEquals(question.getQuestion(), result.getQuestion());
        assertArrayEquals(question.getAnswers(), result.getAnswers());
        assertArrayEquals(question.getExplanations(), result.getExplanations());
        assertArrayEquals(question.getCorrectAnswers(), result.getCorrectAnswers());
        assertEquals(question.getWorkspaceGuid(), result.getWorkspaceGuid());
        assertEquals(question.isEasyMode(), result.isEasyMode());
    }

    @Test
    public void getQuestionsByWorkspace() {
        var question = createSingleChoiceQuestion();
        var questionCreateResponse = questionController.saveQuestion(question);

        var result = questionController.getQuestionsByWorkspace(question.getWorkspaceGuid());

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(question.getId(), result.get(0).getId());
        assertEquals(question.getQuestion(), result.get(0).getQuestion());

        assertEquals(questionCreateResponse.getEditId(), result.get(0).getEditId());
    }

    @Test
    public void updateQuestion() {
        var question = createSingleChoiceQuestion();
        var questionCreateResponse = questionController.saveQuestion(question);
        var updatedQuestion = createMultipleChoiceQuestion();
        questionController.updateQuestion(updatedQuestion, questionCreateResponse.getEditId());

        var result = questionController.getQuestion(questionCreateResponse.getId()).getBody();

        assertNotNull(result);
        assertEquals(updatedQuestion.getQuestion(), result.getQuestion());
        assertArrayEquals(updatedQuestion.getAnswers(), result.getAnswers());
        assertArrayEquals(updatedQuestion.getExplanations(), result.getExplanations());
        assertArrayEquals(updatedQuestion.getCorrectAnswers(), result.getCorrectAnswers());
        assertEquals(updatedQuestion.getWorkspaceGuid(), result.getWorkspaceGuid());
        assertEquals(updatedQuestion.isEasyMode(), result.isEasyMode());
    }

    @Test
    public void updateEasyModeQuestion() {
        var question = createSingleChoiceQuestion();
        var questionCreateResponse = questionController.saveQuestion(question);
        // update to TRUE
        var updatedQuestionTrue = createMultipleChoiceQuestionWithEasyMode(true);
        questionController.updateQuestion(updatedQuestionTrue, questionCreateResponse.getEditId());

        var result = questionController.getQuestion(questionCreateResponse.getId()).getBody();

        assertNotNull(result);
        assertEquals(updatedQuestionTrue.isEasyMode(), result.isEasyMode());

        // update back to FALSE
        var updatedQuestionWithFalse = createMultipleChoiceQuestionWithEasyMode(false);
        questionController.updateQuestion(updatedQuestionWithFalse, questionCreateResponse.getEditId());

        result = questionController.getQuestion(questionCreateResponse.getId()).getBody();

        assertNotNull(result);
        assertEquals(updatedQuestionWithFalse.isEasyMode(), result.isEasyMode());
    }

    @Test
    public void getQuestionByEditId() {
        var question = createSingleChoiceQuestion();
        var questionCreateResponse = questionController.saveQuestion(question);
        var result = questionController.getQuestionByEditId(questionCreateResponse.getEditId()).getBody();

        assertNotNull(result);
        assertEquals(question.getQuestion(), result.getQuestion());
        assertArrayEquals(question.getAnswers(), result.getAnswers());
    }

    @Test
    public void getProgressState() {
        var questionCreateResponse = questionController.saveQuestion(createSingleChoiceQuestion());
        var result = (ProgressState) questionController.getProgressState(questionCreateResponse.getId()).getBody();

        assertNotNull(result);
        assertEquals(questionRepository.count(), result.getTotal());
        assertEquals(questionRepository.getQuestionIndex(questionCreateResponse.getId()), result.getCurrent());
    }

    @Test
    public void saveQuestion() {
        var question = createSingleChoiceQuestion();
        var questionCreateResponse = questionController.saveQuestion(question);

        assertNotNull(questionCreateResponse);
        assertNotNull(questionCreateResponse.getId());
        assertNotNull(questionCreateResponse.getEditId());
    }

    @Test
    public void deleteQuestion() {
        var question = createSingleChoiceQuestion();
        var questionCreateResponse = questionController.saveQuestion(question);
        questionController.deleteQuestion(questionCreateResponse.getId());
        var result = questionController.getQuestion(questionCreateResponse.getId()).getBody();
        assertEquals(null, result);
    }

    @Test
    public void saveQuestionWithEasyMode() {
        var question = createMultipleChoiceQuestionWithEasyMode(true);
        var questionCreateResponse = questionController.saveQuestion(question);

        var result = questionController.getQuestion(questionCreateResponse.getId()).getBody();

        assertNotNull(questionCreateResponse);
        assertNotNull(questionCreateResponse.getId());
        assertNotNull(questionCreateResponse.getEditId());
        assertEquals(question.isEasyMode(), result.isEasyMode());
    }

    @Test
    public void nonExistingQuestion() {
        ResponseEntity<?> response = questionController.getQuestion(-1);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void getAnswers() {
        var question = createSingleChoiceQuestion();
        var questionCreateResult = questionController.saveQuestion(question);
        Answers answers = questionController.getAnswers(questionCreateResult.getId()).getBody();

        assertNotNull(answers);
        assertArrayEquals(question.getCorrectAnswers(), answers.getCorrectAnswers());
        assertArrayEquals(question.getExplanations(), answers.getExplanations());
        assertSame(question.getQuestionExplanation(), answers.getQuestionExplanation());
    }

    @Test
    public void getAnswersForNonExistingQuestion() {
        ResponseEntity<?> response = questionController.getAnswers(-1);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void isQuestionDefaultDeletable() {
        var question = createSingleChoiceQuestion();
        var questionCreateResponse = questionController.saveQuestion(question);

        var result = questionController.getQuestion(questionCreateResponse.getId()).getBody();

        assertNotNull(result);
        assertTrue(result.isDeletable());
    }

    @Test
    public void questionInQuizIsNotDeletable() {
        var question = createSingleChoiceQuestion();
        questionController.saveQuestion(question);

        Quiz quizInput = new Quiz();
        quizInput.setTitle("Title");
        quizInput.setDescription("Description");
        quizInput.setMode(QuizMode.LEARN);
        quizInput.setPassScore(85);
        quizInput.setQuestionIds(new int[]{question.getId()});
        quizController.createQuiz(quizInput);
        var result = questionController.getQuestion(question.getId()).getBody();

        assertNotNull(result);
        assertFalse(result.isDeletable());
    }
}
