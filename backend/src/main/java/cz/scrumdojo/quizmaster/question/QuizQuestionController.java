package cz.scrumdojo.quizmaster.question;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api")
public class QuizQuestionController {

    private final QuizQuestionRepository quizQuestionRepository;

    @Autowired
    public QuizQuestionController(QuizQuestionRepository quizQuestionRepository) {
        this.quizQuestionRepository = quizQuestionRepository;
    }

    @Transactional
    @GetMapping("/quiz-question/{id}")
    public ResponseEntity<QuizQuestion> getQuestion(@PathVariable Integer id) {
        return response(findQuestion(id));
    }

    @Transactional
    @DeleteMapping("/quiz-question/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Integer id) {
        try {
            QuizQuestion question = quizQuestionRepository.findById(id).orElse(null);
            if (question != null) {
                quizQuestionRepository.delete(question);
                return ResponseEntity.ok().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error deleting question with ID: {}", id, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @Transactional
    @GetMapping("/quiz-question/by-question-list/{guid}")
    public List<WorkspaceItem> getQuestionsByWorkspace(@PathVariable String guid) {
        List<QuizQuestion> questions = quizQuestionRepository.findByWorkspaceGuid(guid);
        return questions.stream()
            .map(q -> new WorkspaceItem(q.getId(), q.getQuestion(), q.getEditId()))
            .toList();
    }

    @Transactional
    @GetMapping("/quiz-question/{editId}/edit")
    public ResponseEntity<QuizQuestion> getQuestionByEditId(@PathVariable String editId) {
        var question = quizQuestionRepository.findByEditId(editId);
        return response(question.map(q -> isQuestionsInQuiz(List.of(q)).stream().findFirst().orElse(null)));
    }

    @Transactional
    @GetMapping("/quiz-question/{id}/progress-state")
    public ResponseEntity<ProgressState> getProgressState(@PathVariable Integer id) {
        return response(Optional.of(new ProgressState(findAllQuestionsCount(), getQuestionIndex(id))));
    }

    @Transactional
    @PostMapping("/quiz-question")
    public QuestionCreateResponse saveQuestion(@RequestBody QuizQuestion question) {
        var createdQuestion = quizQuestionRepository.save(question);
        return new QuestionCreateResponse(createdQuestion.getId(), createdQuestion.getEditId());
    }

    @Transactional
    @PatchMapping("/quiz-question/{editId}")
    public Integer updateQuestion(@RequestBody QuizQuestion question, @PathVariable String editId) {
        var existingQuestion = quizQuestionRepository.findByEditId(editId)
            .orElseThrow(() -> new IllegalArgumentException("Question not found with editId: " + editId));
        question.setId(existingQuestion.getId());
        question.setEditId(editId);
        quizQuestionRepository.save(question);
        return existingQuestion.getId();
    }

    @Transactional
    @GetMapping("/quiz-question/{id}/answers")
    public ResponseEntity<Answers> getAnswers(@PathVariable Integer id) {
        return response(findQuestion(id).map(Answers::from));
    }

    private Optional<QuizQuestion> findQuestion(Integer id) {
        var question = quizQuestionRepository.findById(id);
        if( question.isEmpty()) {
            return question;
        }
        return Optional.of(isQuestionsInQuiz(question.stream().toList()).stream().findFirst().orElse(null));
    }

    private List<QuizQuestion> isQuestionsInQuiz(List<QuizQuestion> questions) {
        var idsInQuiz = quizQuestionRepository.findQuestionsInQuizs(questions.stream().map(QuizQuestion::getId).toList());
        return questions.stream().map(question -> {
            if (idsInQuiz.contains(question.getId())) {
                question.setDeletable(false);
            } else {
                question.setDeletable(true);
            }
            return question;}).toList();
    }

    private Long findAllQuestionsCount() {
        return quizQuestionRepository.count();
    }

    private Long getQuestionIndex(Integer id) {
        return quizQuestionRepository.getQuestionIndex(id);
    }

    private <T> ResponseEntity<T> response(Optional<T> entity) {
        return entity
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }


}
