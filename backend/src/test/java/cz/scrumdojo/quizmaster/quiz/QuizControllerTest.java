package cz.scrumdojo.quizmaster.quiz;

import cz.scrumdojo.quizmaster.TestFixtures;
import cz.scrumdojo.quizmaster.question.Question;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class QuizControllerTest {

    @Autowired
    private QuizController quizController;

    @Autowired
    private TestFixtures fixtures;

    @Test
    public void createAndGetQuiz() {
        Question question = fixtures.save(fixtures.question());
        Quiz quiz = fixtures.quiz(question).build();

        Integer quizId = quizController.createQuiz(quiz).getBody();
        assertNotNull(quizId);

        QuizResponse quizResponse = quizController.getQuiz(quizId).getBody();
        assertNotNull(quizResponse);

        assertEquals(quiz.getId(), quizResponse.getId());
        assertEquals(quiz.getTitle(), quizResponse.getTitle());
        assertEquals(quiz.getDescription(), quizResponse.getDescription());
        assertEquals(quiz.getMode(), quizResponse.getMode());
        assertEquals(quiz.getPassScore(), quizResponse.getPassScore());
        assertEquals(quiz.getTimeLimit(), quizResponse.getTimeLimit());
        assertEquals(quiz.getSize(), quizResponse.getSize());

        assertEquals(quiz.getTimesTaken(), quizResponse.getTimesTaken());
        assertEquals(quiz.getTimesFinished(), quizResponse.getTimesFinished());
        assertEquals(quiz.getAverageScore(), quizResponse.getAverageScore());

        assertEquals(1, quizResponse.getQuestions().length);
        assertEquals(question.getId(), quizResponse.getQuestions()[0].getId());
    }

    @Test
    public void updateQuizCountsOnly() {
        Integer quizId = fixtures.save(fixtures.quiz()).getId();

        assertEquals(HttpStatus.OK, quizController.updateQuizCounts(quizId).getStatusCode());
    }

    @Test
    public void updateQuizFinishedCountsOnly() {
        Integer quizId = fixtures.save(fixtures.quiz()).getId();

        quizController.updateQuizFinishedCounts(quizId, new ScoreRequest(80));
        quizController.updateQuizFinishedCounts(quizId, new ScoreRequest(90));
        quizController.updateQuizFinishedCounts(quizId, new ScoreRequest(100));

        QuizResponse quizResponse = quizController.getQuiz(quizId).getBody();
        assertNotNull(quizResponse);
        assertEquals(90.0, quizResponse.getAverageScore());
        assertEquals(3, quizResponse.getTimesFinished());
    }
}
