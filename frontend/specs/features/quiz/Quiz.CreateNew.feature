Feature: Create Quiz from Question list

  Background:
    Given a question list with questions
      | question  | answers  |
      | 2 + 2 = ? | 4 (*), 5 |
      | 3 * 3 = ? | 9 (*), 6 |
      | 4 / 2 = ? | 2 (*), 3 |

  Scenario: Create quiz with default values
    When I start creating a new quiz
    Then I see empty quiz title
    And I see empty quiz description
    And I see time limit 600 seconds
    And I see pass score 80
    And I see quiz question "2 + 2 = ?"

  Scenario: Create quiz with 3 questions
    When I start creating a new quiz
    * I enter quiz name "Math Quiz"
    * I enter quiz description "Very hard math quiz"
    * I select question "2 + 2 = ?"
    * I select question "4 / 2 = ?"
    * I submit the quiz
    * I take the quiz
    Then I see the welcome page
    * I see quiz name "Math Quiz"
    * I see quiz description "Very hard math quiz"
    * I see question count 2
