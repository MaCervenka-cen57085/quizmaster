package cz.scrumdojo.quizmaster.workspace;

import cz.scrumdojo.quizmaster.question.Question;
import cz.scrumdojo.quizmaster.question.QuestionController;
import cz.scrumdojo.quizmaster.quiz.Quiz;
import cz.scrumdojo.quizmaster.quiz.QuizController;
import cz.scrumdojo.quizmaster.quiz.QuizMode;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class WorkspaceControllerTest {

    @Autowired
    private WorkspaceController workspaceController;

    @Autowired
    private WorkspaceRepository workspaceRepository;

    @Autowired
    private QuestionController questionController;

    @Autowired
    private QuizController quizController;

    final String title = "TEST_TITLE";

    @Test
    public void getWorkspace() {
        var createdWorkspace = workspaceRepository.save(new Workspace(null, title));
        var result = workspaceController.getWorkspace(createdWorkspace.getGuid()).getBody();

        assertNotNull(result);
        assertNotNull(result.getGuid());
        assertEquals(title, result.getTitle());
    }

    @Test
    public void saveWorkspace() {
        WorkspaceCreateResponse response = workspaceController.saveWorkspace(new Workspace(null, title));
        assertNotNull(response);

        var createdWorkspace = workspaceRepository.findById(response.getGuid());
        assertNotNull(createdWorkspace);
        Workspace workspace = createdWorkspace.get();
        assertNotNull(workspace);
        assertNotNull(workspace.getGuid());
        assertEquals(title, workspace.getTitle());
    }

    @Test
    public void getWorkspaceQuestions() {
        var question = Question.builder()
            .question("What is the capital of Italy?")
            .answers(new String[] { "Naples", "Rome", "Florence", "Palermo" })
            .explanations(new String[] { "Nope", "Of course!", "You wish", "Sicilia!" })
            .correctAnswers(new int[] { 2 })
            .workspaceGuid(UUID.randomUUID().toString())
            .isDeletable(true)
            .isEasyMode(false)
            .build();
        var questionCreateResponse = questionController.saveQuestion(question);

        var result = workspaceController.getWorkspaceQuestions(question.getWorkspaceGuid());

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(question.getId(), result.get(0).getId());
        assertEquals(question.getQuestion(), result.get(0).getQuestion());

        assertEquals(questionCreateResponse.getEditId(), result.get(0).getEditId());
    }

    @Test
    public void getWorkspaceQuizzes() {
        // Create a workspace
        Workspace workspace = Workspace.builder()
            .title("Test Workspace")
            .build();
        Workspace savedWorkspace = workspaceRepository.save(workspace);
        String workspaceGuid = savedWorkspace.getGuid();

        // Create question for quiz
        Question question = Question.builder()
            .question("Test question")
            .answers(new String[] { "A", "B" })
            .correctAnswers(new int[] { 1 })
            .build();
        var savedQuestion = questionController.saveQuestion(question);

        // Create first quiz with workspace
        Quiz quizInput1 = new Quiz();
        quizInput1.setTitle("Quiz 1");
        quizInput1.setDescription("Description");
        quizInput1.setMode(QuizMode.LEARN);
        quizInput1.setPassScore(85);
        quizInput1.setQuestionIds(new int[]{savedQuestion.getId()});
        quizInput1.setWorkspaceGuid(workspaceGuid);
        ResponseEntity<Integer> response1 = quizController.createQuiz(quizInput1);
        Integer quizId1 = response1.getBody();

        // Create second quiz with same workspace
        Quiz quizInput2 = new Quiz();
        quizInput2.setTitle("Quiz 2");
        quizInput2.setDescription("Description");
        quizInput2.setMode(QuizMode.LEARN);
        quizInput2.setPassScore(85);
        quizInput2.setQuestionIds(new int[]{savedQuestion.getId()});
        quizInput2.setWorkspaceGuid(workspaceGuid);
        ResponseEntity<Integer> response2 = quizController.createQuiz(quizInput2);
        Integer quizId2 = response2.getBody();

        // Create third quiz WITHOUT workspace
        Quiz quizInput3 = new Quiz();
        quizInput3.setTitle("Quiz 3");
        quizInput3.setDescription("Description");
        quizInput3.setMode(QuizMode.LEARN);
        quizInput3.setPassScore(85);
        quizInput3.setQuestionIds(new int[]{savedQuestion.getId()});
        quizController.createQuiz(quizInput3);

        // Test the endpoint
        ResponseEntity<List<QuizListItem>> response = workspaceController.getWorkspaceQuizzes(workspaceGuid);
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());

        List<QuizListItem> quizzes = response.getBody();
        assertNotNull(quizzes);
        assertEquals(2, quizzes.size());

        // Verify both quizzes are associated with the workspace
        assertTrue(quizzes.stream().anyMatch(q -> q.getId().equals(quizId1)));
        assertTrue(quizzes.stream().anyMatch(q -> q.getId().equals(quizId2)));
    }

    @Test
    public void getWorkspaceQuizzesReturnsEmptyList() {
        // Create a workspace with no quizzes
        Workspace workspace = Workspace.builder()
            .title("Empty Workspace")
            .build();
        Workspace savedWorkspace = workspaceRepository.save(workspace);
        String workspaceGuid = savedWorkspace.getGuid();

        // Test the endpoint
        ResponseEntity<List<QuizListItem>> response = workspaceController.getWorkspaceQuizzes(workspaceGuid);
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());

        List<QuizListItem> quizzes = response.getBody();
        assertNotNull(quizzes);
        assertEquals(0, quizzes.size());
    }
}
