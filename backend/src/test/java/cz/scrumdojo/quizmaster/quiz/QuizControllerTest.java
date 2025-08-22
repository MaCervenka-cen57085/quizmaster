package cz.scrumdojo.quizmaster.quiz;

import cz.scrumdojo.quizmaster.question.QuizQuestion;
import cz.scrumdojo.quizmaster.question.QuizQuestionRepository;
import org.assertj.core.util.Arrays;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Optional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class QuizControllerTest {

    @Autowired
    private QuizController quizController;

    @Autowired
    private QuizQuestionRepository quizQuestionRepository;

    @Autowired
    private QuizRepository quizRepository;

    private Quiz createQuizInput(){
        QuizQuestion question = new QuizQuestion();
        question.setQuestion("nějakej string");
        question.setAnswers(Arrays.array("Odp1", "Odp2"));
        question.setCorrectAnswers(new int[]{1});
        QuizQuestion quizQuestion = quizQuestionRepository.save(question);

        int[] questions = new int[1];
        questions[0] = quizQuestion.getId();

        Quiz quizInput = new Quiz();
        quizInput.setTitle("Title");
        quizInput.setDescription("Description");
        quizInput.setAfterEach(true);
        quizInput.setPassScore(85);
        quizInput.setQuestionIds(questions);

        return quizInput;
    }

    private int createQuiz(Quiz quizInput) {
        ResponseEntity<Integer> resp = quizController.createQuiz(quizInput);

        assertNotNull(resp);
        assertEquals(HttpStatus.OK, resp.getStatusCode());
        Integer id = resp.getBody();
        assertNotNull(id);

        return id;
    }

    @Test
    public void createAndGetQuiz() {

        Quiz quizInput = createQuizInput();
        Integer quizId = createQuiz(quizInput);

        Optional<Quiz> byId = quizRepository.findById(quizId);
        assertTrue(byId.isPresent());

        Quiz quiz = byId.get();
        assertEquals(quizId, quiz.getId());
        assertEquals(quizInput.getTitle(), quiz.getTitle());
        assertEquals(quizInput.getDescription(), quiz.getDescription());
        assertEquals(quizInput.getPassScore(), quiz.getPassScore());
        assertArrayEquals(quizInput.getQuestionIds(), quiz.getQuestionIds());
        assertEquals(quizInput.isAfterEach(), quiz.isAfterEach());

        ResponseEntity<QuizResponse> quizGet = quizController.getQuiz(quizId);
        assertNotNull(quizGet);
        assertEquals(HttpStatus.OK, quizGet.getStatusCode());
        QuizResponse quizGetBody = quizGet.getBody();
        assertNotNull(quizGetBody);
        assertEquals(quizId, quizGetBody.getId());
        assertEquals(quizInput.getTitle(), quizGetBody.getTitle());
        assertEquals(quizInput.getDescription(), quizGetBody.getDescription());
        QuizQuestion[] quizGetBodyQuestions = quizGetBody.getQuestions();
        assertNotNull(quizGetBodyQuestions);
        assertEquals(quizInput.getQuestionIds().length, quizGetBodyQuestions.length);
        assertEquals(quizInput.getQuestionIds()[0], quizGetBodyQuestions[0].getId());
    }

    @Test
    public void getQuizList() {
        int quizId = createQuiz(createQuizInput());

        ResponseEntity<QuizListResponse> response = quizController.getQuizList();
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());

        QuizListResponse body = response.getBody();
        assertNotNull(body);

        List<Quiz> quizzes = body.getQuizzes();
        assertNotNull(quizzes);
        assertTrue(quizzes.size() > 0);
        assertTrue(quizzes.stream().anyMatch(q -> quizId == q.getId()));
    }

}
