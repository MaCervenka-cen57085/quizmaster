package cz.scrumdojo.quizmaster.model;

import cz.scrumdojo.quizmaster.quiz.QuizMode;
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

    private QuizMode mode;
    private int passScore;
    private String workspaceGuid; // Workspace GUID
}
