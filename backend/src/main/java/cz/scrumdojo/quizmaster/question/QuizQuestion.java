package cz.scrumdojo.quizmaster.question;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class QuizQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String question;

    @Column(name = "answers", columnDefinition = "text[]")
    @JdbcTypeCode(SqlTypes.ARRAY)
    private String[] answers;

    @Column(name = "explanations", columnDefinition = "text[]")
    @JdbcTypeCode(SqlTypes.ARRAY)
    private String[] explanations;

    private String questionExplanation;

    @Column(name = "correct_answers", columnDefinition = "text[]")
    @JdbcTypeCode(SqlTypes.ARRAY)
    private int[] correctAnswers;

    @Column(name = "question_list_guid", columnDefinition = "varchar(36)")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String questionListGuid;


    @Column(name = "easy_mode", columnDefinition = "boolean")
    @JdbcTypeCode(SqlTypes.BOOLEAN)
    private boolean isEasyMode;

    @Transient
    private boolean isDeletable;
}
