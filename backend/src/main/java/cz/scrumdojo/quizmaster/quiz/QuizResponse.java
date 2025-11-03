package cz.scrumdojo.quizmaster.quiz;

import cz.scrumdojo.quizmaster.question.Question;
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
    private Question[] questions;
    private QuizMode mode;
    private int passScore;
    private String description;
    private Integer timeLimit;
    private int timesTaken;
    private int timesFinished;
    private double averageScore;
    private Integer size;
}
