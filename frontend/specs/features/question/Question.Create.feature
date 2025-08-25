Feature: Create question GUI

  Scenario: Add a single-choice question for edit
    Given I start creating a question
    When I enter question "What is 2 + 2?"
    * I add the answer "4" marked as correct
    * I add the answer "5" marked as incorrect
    * I save the question
    Then I see a link to take the question
    * I see a link to edit the question
    When I edit the question
    Then I see the answers
    | 4     | * |
    | 5     |   |

  Scenario: Cannot save an empty question
    Given I start creating a question
    When I try saving the question
    Then I see empty question field
    * I see an error message

  Scenario: All or none explanation
      Given I start creating a question
      When I enter question "What is XXX?"
      * I add the answer "5" marked as correct with an explanantion ""
      * I add the answer "6" marked as incorrect with an explanantion "XXXX"
      * I try saving the question
      Then I see an error message
