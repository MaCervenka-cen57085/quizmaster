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
public class QuestionController {

    private final QuestionRepository questionRepository;

    @Autowired
    public QuestionController(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    @Transactional
    @GetMapping("/quiz-question/{id}")
    public ResponseEntity<Question> getQuestion(@PathVariable Integer id) {
        return response(findQuestion(id));
    }

    @Transactional
    @DeleteMapping("/quiz-question/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Integer id) {
        try {
            Question question = questionRepository.findById(id).orElse(null);
            if (question != null) {
                questionRepository.delete(question);
                return ResponseEntity.ok().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error deleting question with ID: {}", id, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @Transactional
    @GetMapping("/quiz-question/by-workspace/{guid}")
    public List<QuestionListItem> getQuestionsByWorkspace(@PathVariable String guid) {
        List<Question> questions = questionRepository.findByWorkspaceGuid(guid);
        return questions.stream()
            .map(q -> new QuestionListItem(q.getId(), q.getQuestion(), q.getEditId()))
            .toList();
    }

    @Transactional
    @GetMapping("/quiz-question/{editId}/edit")
    public ResponseEntity<Question> getQuestionByEditId(@PathVariable String editId) {
        var question = questionRepository.findByEditId(editId);
        return response(question.map(q -> isQuestionsInQuiz(List.of(q)).stream().findFirst().orElse(null)));
    }

    @Transactional
    @PostMapping("/quiz-question")
    public QuestionCreateResponse saveQuestion(@RequestBody Question question) {
        var createdQuestion = questionRepository.save(question);
        return new QuestionCreateResponse(createdQuestion.getId(), createdQuestion.getEditId());
    }

    @Transactional
    @PatchMapping("/quiz-question/{editId}")
    public Integer updateQuestion(@RequestBody Question question, @PathVariable String editId) {
        var existingQuestion = questionRepository.findByEditId(editId)
            .orElseThrow(() -> new IllegalArgumentException("Question not found with editId: " + editId));
        question.setId(existingQuestion.getId());
        question.setEditId(editId);
        questionRepository.save(question);
        return existingQuestion.getId();
    }

    private Optional<Question> findQuestion(Integer id) {
        var question = questionRepository.findById(id);
        if( question.isEmpty()) {
            return question;
        }
        return Optional.of(isQuestionsInQuiz(question.stream().toList()).stream().findFirst().orElse(null));
    }

    private List<Question> isQuestionsInQuiz(List<Question> questions) {
        var idsInQuiz = questionRepository.findQuestionsInQuizs(questions.stream().map(Question::getId).toList());
        return questions.stream().map(question -> {
            if (idsInQuiz.contains(question.getId())) {
                question.setDeletable(false);
            } else {
                question.setDeletable(true);
            }
            return question;}).toList();
    }

    private <T> ResponseEntity<T> response(Optional<T> entity) {
        return entity
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}
