package cz.scrumdojo.quizmaster.questionList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
public class QuestionListController {

    private final QuestionListRepository questionListRepository;

    @Autowired
    public QuestionListController(
        QuestionListRepository questionListRepository) {
        this.questionListRepository = questionListRepository;
    }


    @Transactional
    @GetMapping("/q-list/{guid}")
    public ResponseEntity<QuestionList> getQuestionList(@PathVariable String guid) {
        return response(questionListRepository.findById(guid));
    }

    @Transactional
    @PostMapping("/q-list")
    public QuestionListCreateResponse saveQuestionList(@RequestBody QuestionList questionList) {
        var createdQuestionList = questionListRepository.save(questionList);
        return new QuestionListCreateResponse(createdQuestionList.getGuid());
    }

    private <T> ResponseEntity<T> response(Optional<T> entity) {
    return entity
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
    }
}
