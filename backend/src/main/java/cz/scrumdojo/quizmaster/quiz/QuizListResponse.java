package cz.scrumdojo.quizmaster.quiz;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class QuizListResponse {
    private List<Quiz> quizzes;
}
