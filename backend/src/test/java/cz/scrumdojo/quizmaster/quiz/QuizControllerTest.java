package cz.scrumdojo.quizmaster.quiz;

import cz.scrumdojo.quizmaster.model.ScoreRequest;
import cz.scrumdojo.quizmaster.question.QuizQuestion;
import cz.scrumdojo.quizmaster.question.QuizQuestionRepository;
import cz.scrumdojo.quizmaster.questionList.QuestionList;
import cz.scrumdojo.quizmaster.questionList.QuestionListRepository;
import org.assertj.core.util.Arrays;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class QuizControllerTest {

    @Autowired
    private QuizController quizController;

    @Autowired
    private QuizQuestionRepository quizQuestionRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionListRepository questionListRepository;

    private Quiz createQuizInput() {
        QuizQuestion question = new QuizQuestion();
        question.setQuestion("nějakej string");
        question.setAnswers(Arrays.array("Odp1", "Odp2"));
        question.setCorrectAnswers(new int[] { 1 });
        QuizQuestion quizQuestion = quizQuestionRepository.save(question);

        int[] questions = new int[1];
        questions[0] = quizQuestion.getId();

        Quiz quizInput = new Quiz();
        quizInput.setTitle("Title");
        quizInput.setDescription("Description");
        quizInput.setMode(QuizMode.LEARN);
        quizInput.setPassScore(85);
        quizInput.setQuestionIds(questions);
        quizInput.setTimeLimit(10);
        quizInput.setSize(1);

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
        assertEquals(quizInput.getMode(), quiz.getMode());
        assertEquals(quizInput.getTimeLimit(), quiz.getTimeLimit());
        assertEquals(quizInput.getSize(), quiz.getSize());

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
    public void updateQuizCountsOnly() {
        Quiz quizInput = createQuizInput();
        Integer quizId = createQuiz(quizInput);

        quizInput.setId(quizId);
        quizInput.setTitle("Updated title");
        quizInput.setDescription("Updated description");
        quizInput.setPassScore(90);

        ResponseEntity<Void> resp = quizController.updateQuizCounts(quizInput.getId());
        assertNotNull(resp);
        assertEquals(HttpStatus.OK, resp.getStatusCode());
    }


    @Test
    public void updateQuizFinishedCountsOnly() {
        Quiz quizInput = createQuizInput();
        Integer quizId = createQuiz(quizInput);

        quizInput.setId(quizId);
        quizInput.setTitle("Updated title");
        quizInput.setDescription("Updated description");
        quizInput.setPassScore(90);

        quizController.updateQuizFinishedCounts(quizInput.getId(), new ScoreRequest(80));
        quizController.updateQuizFinishedCounts(quizInput.getId(), new ScoreRequest(90));
        quizController.updateQuizFinishedCounts(quizInput.getId(), new ScoreRequest(100));

        Optional<Quiz> byId = quizRepository.findById(quizId);
        assertTrue(byId.isPresent());
        Quiz quiz = byId.get();
        assertEquals(90.0, quiz.getAverageScore());
        assertEquals(3, quiz.getTimesFinished());
    }

    @Test
    public void getQuizzesByQuestionList() {
        // Create a question list
        QuestionList questionList = QuestionList.builder()
            .title("Test Question List")
            .build();
        QuestionList savedQuestionList = questionListRepository.save(questionList);
        String questionListGuid = savedQuestionList.getGuid();

        // Create first quiz with question list
        Quiz quizInput1 = createQuizInput();
        quizInput1.setTitle("Quiz 1");
        quizInput1.setQuestionList(questionListGuid);
        Integer quizId1 = createQuiz(quizInput1);

        // Create second quiz with same question list
        Quiz quizInput2 = createQuizInput();
        quizInput2.setTitle("Quiz 2");
        quizInput2.setQuestionList(questionListGuid);
        Integer quizId2 = createQuiz(quizInput2);

        // Create third quiz WITHOUT question list
        Quiz quizInput3 = createQuizInput();
        quizInput3.setTitle("Quiz 3");
        createQuiz(quizInput3);

        // Test the endpoint
        ResponseEntity<List<Quiz>> response = quizController.getQuizzesByQuestionList(questionListGuid);
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());

        List<Quiz> quizzes = response.getBody();
        assertNotNull(quizzes);
        assertEquals(2, quizzes.size());

        // Verify both quizzes are associated with the question list
        assertTrue(quizzes.stream().anyMatch(q -> q.getId() == quizId1));
        assertTrue(quizzes.stream().anyMatch(q -> q.getId() == quizId2));
        assertTrue(quizzes.stream().allMatch(q -> questionListGuid.equals(q.getQuestionList())));
    }

    @Test
    public void getQuizzesByQuestionListReturnsEmptyList() {
        // Create a question list with no quizzes
        QuestionList questionList = QuestionList.builder()
            .title("Empty Question List")
            .build();
        QuestionList savedQuestionList = questionListRepository.save(questionList);
        String questionListGuid = savedQuestionList.getGuid();

        // Test the endpoint
        ResponseEntity<List<Quiz>> response = quizController.getQuizzesByQuestionList(questionListGuid);
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());

        List<Quiz> quizzes = response.getBody();
        assertNotNull(quizzes);
        assertEquals(0, quizzes.size());
    }
}
