package cz.scrumdojo.quizmaster.question;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class QuizQuestionController {

    private final QuizQuestionRepository quizQuestionRepository;
    public static final String KEY = "UMNBKJHUMNASDGIUASDKJHVIYWKJASGS";
    private static final String ALGORITHM = "AES";
    private static final String TRANSFORM = "AES/ECB/PKCS5Padding";

    @Autowired
    public QuizQuestionController(
        QuizQuestionRepository quizQuestionRepository) {

        this.quizQuestionRepository = quizQuestionRepository;
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
            .map(q -> new QuestionListItem( q.getId(),q.getQuestion(), getHashFromQuestionId(q.getId())))
            .toList();
    }

    @Transactional
    @GetMapping("/quiz-question/{hash}/edit")
    public ResponseEntity<QuizQuestion> getQuestionByHash(@PathVariable String hash) {
        var id = getQuestionIdFromHash(hash);
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
        var hash = getHashFromQuestionId(question.getId());
        return new QuestionCreateResponse(createdQuestion.getId(), hash);
    }

    @Transactional
    @PatchMapping("/quiz-question/{hash}")
    public Integer updateQuestion(@RequestBody QuizQuestion question, @PathVariable String hash) {
        var id = getQuestionIdFromHash(hash);
        question.setId(id);
        quizQuestionRepository.save(question);
        return id;
    }

    @Transactional
    @GetMapping("/quiz-question/{id}/answers")
    public ResponseEntity<Answers> getAnswers(@PathVariable Integer id) {
        return response(findQuestion(id).map(Answers::from));
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

    private String getHashFromQuestionId(Integer questionId) {
        try {
            SecretKeySpec keySpec = new SecretKeySpec(KEY.getBytes(), ALGORITHM);
            Cipher cipher = Cipher.getInstance(TRANSFORM);
            cipher.init(Cipher.ENCRYPT_MODE, keySpec);
            byte[] encrypted = cipher.doFinal(questionId.toString().getBytes());
            return Base64.getUrlEncoder().encodeToString(encrypted);
        } catch (Exception e) {
            throw new RuntimeException("Error while encrypting", e);
        }
    }

    private Integer getQuestionIdFromHash(String hash) {
        try {
            SecretKeySpec keySpec = new SecretKeySpec(KEY.getBytes(), ALGORITHM);
            Cipher cipher = Cipher.getInstance(TRANSFORM);
            cipher.init(Cipher.DECRYPT_MODE, keySpec);
            byte[] decodedBytes = Base64.getUrlDecoder().decode(hash);
            byte[] decrypted = cipher.doFinal(decodedBytes);
            return Integer.parseInt(new String(decrypted));
        } catch (Exception e) {
            throw new RuntimeException("Error while decrypting", e);
        }
    }
}
