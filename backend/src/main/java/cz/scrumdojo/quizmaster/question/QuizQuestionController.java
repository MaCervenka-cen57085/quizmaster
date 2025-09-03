package cz.scrumdojo.quizmaster.question;

import cz.scrumdojo.quizmaster.service.EncryptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class QuizQuestionController {

    private final QuizQuestionRepository quizQuestionRepository;
    private final EncryptionService encryptionService;

    @Autowired
    public QuizQuestionController(
        QuizQuestionRepository quizQuestionRepository,
        EncryptionService encryptionService) {

        this.quizQuestionRepository = quizQuestionRepository;
        this.encryptionService = encryptionService;
    }

    @Transactional
    @GetMapping("/quiz-question/{id}")
    public ResponseEntity<QuizQuestion> getQuestion(@PathVariable Integer id) {
        return response(findQuestion(id));
    }

    @Transactional
    @GetMapping("/quiz-question/by-question-list/{guid}")
    public List<QuestionListItem> getQuestionsByQuestionList(@PathVariable String guid) {
        List<QuizQuestion> questions = quizQuestionRepository.findByQuestionListGuid(guid);
        return questions.stream()
            .map(q -> new QuestionListItem( q.getId(),q.getQuestion(), encryptionService.encryptQuestionId(q.getId())))
            .toList();
    }

    @Transactional
    @GetMapping("/quiz-question/{hash}/edit")
    public ResponseEntity<QuizQuestion> getQuestionByHash(@PathVariable String hash) {
        var id = encryptionService.decryptQuestionId(hash);
        return response(findQuestion(id));
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
        var hash = encryptionService.encryptQuestionId(createdQuestion.getId());
        return new QuestionCreateResponse(createdQuestion.getId(), hash);
    }

    @Transactional
    @PatchMapping("/quiz-question/{hash}")
    public Integer updateQuestion(@RequestBody QuizQuestion question, @PathVariable String hash) {
        var id = encryptionService.decryptQuestionId(hash);
        question.setId(id);
        quizQuestionRepository.save(question);
        return id;
    }

    @Transactional
    @GetMapping("/quiz-question/{id}/answers")
    public ResponseEntity<Answers> getAnswers(@PathVariable Integer id) {
        return response(findQuestion(id).map(Answers::from));
    }

    @Transactional
    @PatchMapping("/quiz-question/link-to-list/{id}")
    public ResponseEntity<Boolean> linkQuestionToList(@PathVariable Integer id, @RequestBody QuestionLinkRequest listGuidRequest) {
        var question = findQuestion(id);
        if (question.isPresent()) {
            question.get().setQuestionListGuid(listGuidRequest.getListGuid());
            quizQuestionRepository.save(question.get());
            return ResponseEntity.ok(true);
        }
        return ResponseEntity.ok(false);
    }

    private Optional<QuizQuestion> findQuestion(Integer id) {
        return quizQuestionRepository.findById(id);
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
