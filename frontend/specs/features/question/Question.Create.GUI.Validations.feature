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
