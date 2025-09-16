package cz.scrumdojo.quizmaster.question;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import cz.scrumdojo.quizmaster.quiz.Quiz;
import cz.scrumdojo.quizmaster.quiz.QuizController;

import static org.junit.jupiter.api.Assertions.*;

import java.util.UUID;

@SpringBootTest
public class QuizQuestionControllerTest {

    @Autowired
    private QuizQuestionController quizQuestionController;

    @Autowired
    private QuizQuestionRepository quizQuestionRepository;

    @Autowired
    private QuizController quizController;

    private static QuizQuestion createSingleChoiceQuestion() {
        return QuizQuestion.builder()
            .question("What is the capital of Italy?")
            .answers(new String[] { "Naples", "Rome", "Florence", "Palermo" })
            .explanations(new String[] { "Nope", "Of course!", "You wish", "Sicilia!" })
            .correctAnswers(new int[] { 1 })
            .questionListGuid(UUID.randomUUID().toString())
            .isDeletable(true)
            .build();
    }

    private static QuizQuestion createMultipleChoiceQuestion() {
        return QuizQuestion.builder()
            .question("What is the cities of Italy?")
            .answers(new String[] { "Naples", "Rome", "Astana", "Paris" })
            .explanations(new String[] { "Si!", "Of course!", "Salem, but no.", "Bonjour! But no." })
            .correctAnswers(new int[] { 1, 2 })
            .questionListGuid(UUID.randomUUID().toString())
            .build();
    }

    @Test
    public void getQuestion() {
        var question = createSingleChoiceQuestion();
        var questionCreateResponse = quizQuestionController.saveQuestion(question);

        var result = quizQuestionController.getQuestion(questionCreateResponse.getId()).getBody();

        assertNotNull(result);
        assertEquals(question.getQuestion(), result.getQuestion());
        assertArrayEquals(question.getAnswers(), result.getAnswers());
        assertArrayEquals(question.getExplanations(), result.getExplanations());
        assertArrayEquals(question.getCorrectAnswers(), result.getCorrectAnswers());
        assertEquals(question.getQuestionListGuid(), result.getQuestionListGuid());
    }

    @Test
    public void getQuestionsByQuestionList() {
        var question = createSingleChoiceQuestion();
        var questionCreateResponse = quizQuestionController.saveQuestion(question);

        var result = quizQuestionController.getQuestionsByQuestionList(question.getQuestionListGuid());

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(question.getId(), result.get(0).getId());
        assertEquals(question.getQuestion(), result.get(0).getQuestion());

        assertEquals(questionCreateResponse.getHash(), result.get(0).getHash());
    }

    @Test
    public void updateQuestion() {
        var question = createSingleChoiceQuestion();
        var questionCreateResponse = quizQuestionController.saveQuestion(question);
        var updatedQuestion = createMultipleChoiceQuestion();
        quizQuestionController.updateQuestion(updatedQuestion, questionCreateResponse.getHash());

        var result = quizQuestionController.getQuestion(questionCreateResponse.getId()).getBody();

        assertNotNull(result);
        assertEquals(updatedQuestion.getQuestion(), result.getQuestion());
        assertArrayEquals(updatedQuestion.getAnswers(), result.getAnswers());
        assertArrayEquals(updatedQuestion.getExplanations(), result.getExplanations());
        assertArrayEquals(updatedQuestion.getCorrectAnswers(), result.getCorrectAnswers());
        assertEquals(updatedQuestion.getQuestionListGuid(), result.getQuestionListGuid());
    }

    @Test
    public void getQuestionByHash() {
        var question = createSingleChoiceQuestion();
        var questionCreateResponse = quizQuestionController.saveQuestion(question);
        var result = quizQuestionController.getQuestionByHash(questionCreateResponse.getHash()).getBody();

        assertNotNull(result);
        assertEquals(question.getQuestion(), result.getQuestion());
        assertArrayEquals(question.getAnswers(), result.getAnswers());
    }

    @Test
    public void getProgressState() {
        var questionCreateResponse = quizQuestionController.saveQuestion(createSingleChoiceQuestion());
        var result = (ProgressState) quizQuestionController.getProgressState(questionCreateResponse.getId()).getBody();

        assertNotNull(result);
        assertEquals(quizQuestionRepository.count(), result.getTotal());
        assertEquals(quizQuestionRepository.getQuestionIndex(questionCreateResponse.getId()), result.getCurrent());
    }

    @Test
    public void saveQuestion() {
        var question = createSingleChoiceQuestion();
        var questionCreateResponse = quizQuestionController.saveQuestion(question);

        assertNotNull(questionCreateResponse);
        assertNotNull(questionCreateResponse.getId());
        assertNotNull(questionCreateResponse.getHash());
    }

    @Test
    public void nonExistingQuestion() {
        ResponseEntity<?> response = quizQuestionController.getQuestion(-1);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void getAnswers() {
        var question = createSingleChoiceQuestion();
        var questionCreateResult = quizQuestionController.saveQuestion(question);
        Answers answers = quizQuestionController.getAnswers(questionCreateResult.getId()).getBody();

        assertNotNull(answers);
        assertArrayEquals(question.getCorrectAnswers(), answers.getCorrectAnswers());
        assertArrayEquals(question.getExplanations(), answers.getExplanations());
        assertSame(question.getQuestionExplanation(), answers.getQuestionExplanation());
    }

    @Test
    public void getAnswersForNonExistingQuestion() {
        ResponseEntity<?> response = quizQuestionController.getAnswers(-1);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void isQuestionDefaultDeletable() {
        var question = createSingleChoiceQuestion();
        var questionCreateResponse = quizQuestionController.saveQuestion(question);

        var result = quizQuestionController.getQuestion(questionCreateResponse.getId()).getBody();

        assertNotNull(result);
        assertTrue(result.isDeletable());
    }

    @Test
    public void questionInQuizIsNotDeletable() {
        var question = createSingleChoiceQuestion();
        quizQuestionController.saveQuestion(question);

        Quiz quizInput = new Quiz();
        quizInput.setTitle("Title");
        quizInput.setDescription("Description");
        quizInput.setAfterEach(true);
        quizInput.setPassScore(85);
        quizInput.setQuestionIds(new int[]{question.getId()});
        quizController.createQuiz(quizInput);
        var result = quizQuestionController.getQuestion(question.getId()).getBody();

        assertNotNull(result);
        assertFalse(result.isDeletable());
    }
}
