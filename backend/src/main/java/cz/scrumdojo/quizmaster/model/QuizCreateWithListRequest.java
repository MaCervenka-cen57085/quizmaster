package cz.scrumdojo.quizmaster.model;

import cz.scrumdojo.quizmaster.quiz.QuizMode;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class QuizCreateWithListRequest {

    private String title;
    private String id;
    private String description;
    private String[] questionListIds;
    private QuizMode mode;
    private int passScore;
    private Integer timeLimit;
    private String questionList; // Question list GUID
}
