package cz.scrumdojo.quizmaster.quiz;

import cz.scrumdojo.quizmaster.model.QuizCreateWithListRequest;
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
import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class QuizControllerTest {

    @Autowired
    private QuizController quizController;

    @Autowired
    private QuizQuestionRepository quizQuestionRepository;

    @Autowired
    private QuestionListRepository questionListRepository;

    @Autowired
    private QuizRepository quizRepository;

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
        quizInput.setAfterEach(true);
        quizInput.setPassScore(85);
        quizInput.setQuestionIds(questions);
        quizInput.setTimeLimit(10);

        return quizInput;
    }

    private QuizCreateWithListRequest createQuizInputWithQuestionList() {
        var listGuid = java.util.UUID.randomUUID();
        var listGuids = new String[] { listGuid.toString() };

        QuestionList list = new QuestionList();
        list.setGuid(listGuid.toString());
        list.setTitle("Best list ever");
        questionListRepository.save(list);

        QuizQuestion question = new QuizQuestion();
        question.setQuestionListGuid(listGuid.toString());
        question.setQuestion("nějakej string");
        question.setAnswers(Arrays.array("Odp1", "Odp2"));
        question.setCorrectAnswers(new int[] { 1 });

        quizQuestionRepository.save(question);

        QuizCreateWithListRequest quizInput = new QuizCreateWithListRequest();
        quizInput.setTitle("Title");
        quizInput.setQuestionListIds(listGuids);
        quizInput.setAfterEach(true);
        quizInput.setPassScore(85);
        quizInput.setDescription("Description");
        quizInput.setTimeLimit(60);

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

    private int createQuizWithProperRequest(QuizCreateWithListRequest request) {
        ResponseEntity<Integer> resp = quizController.createQuizWithListIds(request);

        assertNotNull(resp);
        assertEquals(HttpStatus.OK, resp.getStatusCode());
        Integer id = resp.getBody();
        assertNotNull(id);

        return id;
    }

    @Test
    public void createWithListIdAndGetQuiz() {

        var quizInput = createQuizInputWithQuestionList();
        Integer quizId = createQuizWithProperRequest(quizInput);

        Optional<Quiz> byId = quizRepository.findById(quizId);
        assertTrue(byId.isPresent());

        ArrayList<QuizQuestion> questionListById = (ArrayList<QuizQuestion>) quizQuestionRepository
                .findByQuestionListGuid(quizInput.getQuestionListIds()[0]);
        var questionListQuestionIds = questionListById.stream().mapToInt(QuizQuestion::getId).toArray();

        var quiz = byId.get();
        assertEquals(quizId, quiz.getId());
        assertEquals(quizInput.getTitle(), quiz.getTitle());
        assertEquals(quizInput.getDescription(), quiz.getDescription());
        assertEquals(quizInput.getPassScore(), quiz.getPassScore());
        assertArrayEquals(questionListQuestionIds, quiz.getQuestionIds());
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
        assertEquals(quizInput.getTimeLimit(), quiz.getTimeLimit());

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
}
