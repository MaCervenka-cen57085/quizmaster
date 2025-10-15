
package cz.scrumdojo.quizmaster.quiz;

import cz.scrumdojo.quizmaster.question.QuizQuestion;
import cz.scrumdojo.quizmaster.question.QuizQuestionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import cz.scrumdojo.quizmaster.model.QuizCreateWithListRequest;
import cz.scrumdojo.quizmaster.model.ScoreRequest;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api")
public class QuizController {

    private final QuizQuestionRepository quizQuestionRepository;
    private final QuizRepository quizRepository;

    @Autowired
    public QuizController(QuizQuestionRepository quizQuestionRepository, QuizRepository quizRepository) {
        this.quizQuestionRepository = quizQuestionRepository;
        this.quizRepository = quizRepository;
    }

    @Transactional
    @GetMapping("/quiz/{id}")
    public ResponseEntity<QuizResponse> getQuiz(@PathVariable Integer id) {
        Quiz quiz = this.quizRepository.findById(id).orElse(null);

        if (quiz == null) {
            return ResponseEntity.notFound().build();
        }


        int questionsLimit = (quiz.getSize() != null &&  quiz.getSize() > 0 ) ? quiz.getSize() : quiz.getQuestionIds().length;

        QuizQuestion[] questions = new QuizQuestion[questionsLimit];

        for (int i = 0; i < questionsLimit; i++) {
            questions[i] = this.quizQuestionRepository.getReferenceById(quiz.getQuestionIds()[i]);
        }

        QuizResponse build = QuizResponse.builder()
            .id(quiz.getId())
            .title(quiz.getTitle())
            .description(quiz.getDescription())
            .questions(questions)
            .afterEach(quiz.isAfterEach())
            .passScore(quiz.getPassScore())
            .timeLimit(quiz.getTimeLimit())
            .timesTaken(quiz.getTimesTaken())
            .timesFinished(quiz.getTimesFinished())
            .averageScore(quiz.getAverageScore())
            .size(quiz.getSize())
            .build();

        return ResponseEntity.ok(build);
    }

    @Transactional
    @PostMapping("/quiz")
    public ResponseEntity<Integer> createQuiz(@RequestBody Quiz quizInput) {
        Quiz output = quizRepository.save(quizInput);

        return ResponseEntity.ok(output.getId());
    }

    @Transactional
    @PostMapping("/quiz-with-list")
    public ResponseEntity<Integer> createQuizWithListIds(@RequestBody QuizCreateWithListRequest quizInput) {
        ArrayList<QuizQuestion> questions = new ArrayList<QuizQuestion>();
        for (String quizList : quizInput.getQuestionListIds()) {
            var quizzes = quizQuestionRepository.findByQuestionListGuid(quizList);
            questions.addAll(quizzes);
        }

        var quiz = Quiz.builder()
            .id(-1)
            .title(quizInput.getTitle())
            .description(quizInput.getDescription())
            .questionIds(questions.stream().mapToInt(q -> q.getId()).toArray())
            .afterEach(true)
            .passScore(quizInput.getPassScore())
            .timeLimit(quizInput.getTimeLimit())
            .questionList(quizInput.getQuestionList())
            .build();

        Quiz output = quizRepository.save(quiz);
        return ResponseEntity.ok(output.getId());
    }

     @Transactional
    @PutMapping("/quiz/{id}/start")
    public ResponseEntity<Void> updateQuizCounts(@PathVariable Integer id) {
        Quiz quiz = this.quizRepository.findById(id).orElse(null);

        if (quiz == null) {
            return ResponseEntity.notFound().build();
        }

        quiz.setTimesTaken(quiz.getTimesTaken() + 1);

        Quiz output = quizRepository.save(quiz);
        return ResponseEntity.ok().build();
    }


    @Transactional
    @PutMapping("/quiz/{id}/evaluate")
    public ResponseEntity<Void> updateQuizFinishedCounts(@PathVariable Integer id, @RequestBody ScoreRequest payload) {
        int score = payload.getScore();

        Quiz quiz = this.quizRepository.findById(id).orElse(null);

        if (quiz == null) {
            return ResponseEntity.notFound().build();
        }

        quiz.setTimesFinished(quiz.getTimesFinished() + 1);
        quiz.setAverageScore(quiz.getAverageScore() + (score - quiz.getAverageScore()) / (quiz.getTimesFinished()));

        quizRepository.save(quiz);
        return ResponseEntity.ok().build();
    }


    @Transactional
    @GetMapping("/quiz/by-question-list/{guid}")
    public ResponseEntity<List<Quiz>> getQuizzesByQuestionList(@PathVariable String guid) {
        List<Quiz> quizzes = quizRepository.findByQuestionListGuid(guid);
        return quizzes != null ? ResponseEntity.ok(quizzes) : ResponseEntity.notFound().build();
    }
}
