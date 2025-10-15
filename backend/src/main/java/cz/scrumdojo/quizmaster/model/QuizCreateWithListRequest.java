package cz.scrumdojo.quizmaster.model;

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
    private boolean afterEach;
    private int passScore;
    private Integer timeLimit;
    private String questionList; // Question list GUID
}
