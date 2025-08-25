@only
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

  Scenario: Empty question text
    Given I start creating a question
    When I enter answer 1 text "4" and mark it as correct
    * I enter answer 2 text "5"
    * I attempt to save the question
    Then I see error messages
      | empty-question |

  Scenario: All answers must be filled in
    For single-choice question, exactly one correct answer is required

    Given I start creating a question
    When I enter question "What is 2 + 2?"
    * I enter answer 1 text "4"
    * I mark answer 1 as correct
    * I attempt to save the question
    Then I see error messages
      | empty-answer |

  Scenario: Add an empty answer
    Given I start creating a question
    When I enter question "What is 2 + 2?"
    * I enter answer 1 text "4" and mark it as correct
    * I enter answer 2 text "5"
    * I add an additional answer
    * I attempt to save the question
    Then I see error messages
      | empty-answer |

  Scenario: Single-choice question: No correct answer
    For single-choice question, exactly one correct answer is required

    Given I start creating a question
    When I enter question "What is 2 + 2?"
    * I enter answer 1 text "4"
    * I enter answer 2 text "5"
    * I attempt to save the question
    Then I see error messages
      | no-correct-answer |
