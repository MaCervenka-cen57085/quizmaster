package cz.scrumdojo.quizmaster.questionList;

import jakarta.persistence.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
public class QuestionList {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String guid;

    @Column(name = "title", columnDefinition = "text[]")
    private String title;
}
