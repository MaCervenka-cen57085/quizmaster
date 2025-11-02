package cz.scrumdojo.quizmaster.question;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, Integer> {
    @Query(value = "SELECT question_index FROM (" +
    "  SELECT ROW_NUMBER() OVER (ORDER BY id) AS question_index, id " +
    "  FROM quiz_question" +
    ") AS subquery WHERE id = :id", nativeQuery = true)
    Long getQuestionIndex(@Param("id") Integer id);

    List<QuizQuestion> findByQuestionListGuid(String guid);

    Optional<QuizQuestion> findByEditId(String editId);

    @Query(value = "SELECT questions FROM quiz WHERE questions && ARRAY[:ids]", nativeQuery = true)
    List<Integer> findQuestionsInQuizs(@Param("ids") List<Integer> ids);
}
