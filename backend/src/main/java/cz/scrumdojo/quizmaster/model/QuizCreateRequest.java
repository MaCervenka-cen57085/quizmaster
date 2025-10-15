package cz.scrumdojo.quizmaster.model;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class QuizCreateRequest {

    private String title;
    private String id;

    private String[] ids;
    private String[] urls;

    private boolean afterEach;
    private int passScore;
    private String questionList; // Question list GUID
}
