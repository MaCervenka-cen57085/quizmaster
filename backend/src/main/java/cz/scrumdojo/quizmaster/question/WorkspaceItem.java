package cz.scrumdojo.quizmaster.question;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class WorkspaceItem {
    Integer id;
    String question;
    String editId;
}
