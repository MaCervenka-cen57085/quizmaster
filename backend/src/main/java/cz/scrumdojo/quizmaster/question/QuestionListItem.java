package cz.scrumdojo.quizmaster.question;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class QuestionListItem {
    Integer id;
    String question;
    String editId;
}
