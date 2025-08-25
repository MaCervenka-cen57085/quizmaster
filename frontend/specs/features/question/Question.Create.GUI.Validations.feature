Feature: Create question GUI
    - Question text is required
    - Answer text for each answer is required
    - At least one correct answer is required
    - Question explanation is optional

  Scenario: Empty question form
    Given I start creating a question
    When I attempt to save the question
    Then I see error messages
      | empty-question    |
      | empty-answer      |
      | no-correct-answer |

  Scenario: Single-choice question: No correct answer
    For single-choice question, exactly one correct answer is required

    Given I start creating a question
    When I enter question "What is 2 + 2?"
    * I enter answer 1 text "4"
    * I enter answer 2 text "5"
    * I attempt to save the question
    Then I see error messages
      | no-correct-answer |
