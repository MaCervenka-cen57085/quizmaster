package cz.scrumdojo.quizmaster.quiz;

import lombok.*;

@Getter
@Setter
@ToString
@Builder
public class QuizListResponse {
    private java.util.List<Quiz> quizzes;
}
