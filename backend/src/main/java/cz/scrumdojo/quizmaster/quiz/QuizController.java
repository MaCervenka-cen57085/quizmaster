
package cz.scrumdojo.quizmaster.quiz;

import cz.scrumdojo.quizmaster.question.QuizQuestion;
import cz.scrumdojo.quizmaster.question.QuizQuestionRepository;
import cz.scrumdojo.quizmaster.questionList.QuestionListRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import cz.scrumdojo.quizmaster.model.QuizCreateWithListRequest;
import java.util.HashMap;
import java.util.Map;
import java.util.ArrayList;

@Slf4j
@RestController
@RequestMapping("/api")
public class QuizController {

    private final QuizQuestionRepository quizQuestionRepository;
    private final QuizRepository quizRepository;

    private static final Map<Integer, Quiz> quizzes = new HashMap<>();

    @Autowired
    public QuizController(QuizQuestionRepository quizQuestionRepository, QuizRepository quizRepository) {
        this.quizQuestionRepository = quizQuestionRepository;
        this.quizRepository = quizRepository;


        QuizQuestion question = new QuizQuestion();
        question.setId(1);
        question.setQuestion("What is the standard colour of sky?");
        question.setAnswers(new String[]{"Red", "Blue", "Green", "Black"});
        question.setExplanations(
            new String[]{
                "Red is not the standard colour of sky",
                "Blue is the standard colour of sky",
                "Green is not the standard colour of sky",
                "Black is not the standard colour of sky"
            }
        );
        question.setQuestionExplanation(
            "Sky is blue because of Rayleigh scattering"
        );
        question.setCorrectAnswers(new int[]{1});

        QuizQuestion question2 = new QuizQuestion();
        question2.setId(2);
        question2.setQuestion("What is capital of France?");
        question2.setAnswers(new String[]{"Marseille", "Lyon", "Paris", "Toulouse"});
        question2.setExplanations(new String[]{});
        question2.setQuestionExplanation("");
        question2.setCorrectAnswers(new int[]{2});

        QuizQuestion question3 = new QuizQuestion();
        question3.setId(3);
        question3.setQuestion("Which animal has long nose?");
        question3.setAnswers(new String[]{"Elephant", "Anteater", "Swordfish", "Bulldog"});
        question3.setExplanations(new String[]{});
        question3.setQuestionExplanation("");
        question3.setCorrectAnswers(new int[]{0, 1, 2});

        var quizQuestion = quizQuestionRepository.save(question);
        var quizQuestion2 = quizQuestionRepository.save(question2);
        var quizQuestion3 = quizQuestionRepository.save(question3);

        Quiz quiz1 = new Quiz();
        quiz1.setId(-1);
        quiz1.setQuestionIds(new int[]{quizQuestion.getId(), quizQuestion2.getId()});
        quiz1.setAfterEach(false);
        quiz1.setPassScore(85);

        Quiz quiz2 = new Quiz();
        quiz2.setId(-2);
        quiz2.setQuestionIds(new int[]{quizQuestion.getId(), quizQuestion2.getId()});
        quiz2.setAfterEach(true);
        quiz2.setPassScore(40);

        Quiz quiz3 = new Quiz();
        quiz3.setId(-3);
        quiz3.setQuestionIds(new int[]{quizQuestion3.getId(), quizQuestion2.getId()});
        quiz3.setAfterEach(false);
        quiz3.setPassScore(40);

        quizzes.put(quiz1.getId(), quiz1);
        quizzes.put(quiz2.getId(), quiz2);
        quizzes.put(quiz3.getId(), quiz3);

        var planet = quizQuestionRepository.save(
            QuizQuestion.builder()
                .question("Which planet is known as the Red Planet?")
                .answers(new String[]{"Mars", "Venus"})
                .explanations(new String[]{"", ""})
                .correctAnswers(new int[]{0})
                .build()
        );

        var australia = quizQuestionRepository.save(
            QuizQuestion.builder()
                .question("What's the capital city of Australia?")
                .answers(new String[]{"Sydney", "Canberra"})
                .explanations(new String[]{"", ""})
                .correctAnswers(new int[]{1})
                .build()
        );

        var fruit = quizQuestionRepository.save(
            QuizQuestion.builder()
                .question("Which fruit is known for having seeds on the outside?")
                .answers(new String[]{"Strawberry", "Blueberry"})
                .explanations(new String[]{"", ""})
                .correctAnswers(new int[]{0})
                .build()
        );


        var quiz4 = Quiz.builder()
            .id(-4)
            .questionIds(new int[]{planet.getId(), australia.getId(), fruit.getId()})
            .afterEach(false)
            .passScore(85)
            .build();

        var quiz5 = Quiz.builder()
            .id(-5)
            .questionIds(new int[]{planet.getId(), australia.getId(), fruit.getId()})
            .afterEach(true)
            .passScore(85)
            .build();

        quizzes.put(quiz4.getId(), quiz4);
        quizzes.put(quiz5.getId(), quiz5);

    }

    @Transactional
    @GetMapping("/quiz/{id}")
    public ResponseEntity<QuizResponse> getQuiz(@PathVariable Integer id) {
        Quiz quiz;
        if (id < 0) {
            quiz = quizzes.get(id);
        } else {
            // Change from getReferenceById to findById to handle missing entities
            quiz = this.quizRepository.findById(id).orElse(null);
        }

        if (quiz == null) {
            return ResponseEntity.notFound().build();
        }

        QuizQuestion[] questions = new QuizQuestion[quiz.getQuestionIds().length];
        for (int i = 0; i < quiz.getQuestionIds().length; i++) {
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
            .build();

        Quiz output = quizRepository.save(quiz);
        return ResponseEntity.ok(output.getId());
    }

    @Transactional
    @DeleteMapping("/quiz/{id}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable Integer id) {
        try {
            Quiz quiz = quizRepository.findById(id).orElse(null);
            if (quiz != null) {
                quizRepository.delete(quiz);
                return ResponseEntity.ok().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error deleting quiz with ID: {}", id, e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
