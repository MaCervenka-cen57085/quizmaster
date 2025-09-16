package cz.scrumdojo.quizmaster.quiz;

import cz.scrumdojo.quizmaster.question.QuizQuestion;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class QuizResponse {

    private Integer id;
    private String title;
    private QuizQuestion[] questions;
    private boolean afterEach;
    private int passScore;
    private String description;
    private Integer timeLimit;
}
