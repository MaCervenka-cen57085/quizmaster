package cz.scrumdojo.quizmaster.question;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface QuestionRepository extends JpaRepository<Question, Integer> {
    @Query(value = "SELECT question_index FROM (" +
    "  SELECT ROW_NUMBER() OVER (ORDER BY id) AS question_index, id " +
    "  FROM question" +
    ") AS subquery WHERE id = :id", nativeQuery = true)
    Long getQuestionIndex(@Param("id") Integer id);

    List<Question> findByWorkspaceGuid(String guid);

    Optional<Question> findByEditId(String editId);

    @Query(value = "SELECT questions FROM quiz WHERE questions && ARRAY[:ids]", nativeQuery = true)
    List<Integer> findQuestionsInQuizs(@Param("ids") List<Integer> ids);
}
