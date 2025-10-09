Feature: Question list

  Scenario: Take question in a question list
    Given a question list with questions
      | question  | answers  |
      | 2 + 2 = ? | 4 (*), 5 |
      | 3 * 3 = ? | 9 (*), 6 |
    When I take question "2 + 2 = ?" from the list
    Then I see the question and the answers

  Scenario: Copy a take question URL
    Given a question list with question
      | question  | answers  |
      | 2 + 2 = ? | 4 (*), 5 |
    When I copy the take question URL "2 + 2 = ?" from the list
    And I follow the copied URL
    Then I see the question and the answers

  Scenario: Edit question in a question list
    Given a question list with questions
      | question  | answers  |
      | 2 + 2 = ? | 4 (*), 5 |
      | 3 * 3 = ? | 9 (*), 6 |
    When I edit question "2 + 2 = ?" from the list
    Then I see question edit page
    And I see "2 + 2 = ?" in the question field

  Scenario: Copy an edit question URL
    Given a question list with question
      | question  | answers  |
      | 2 + 2 = ? | 4 (*), 5 |
    When I copy the edit question URL "2 + 2 = ?" from the list
    And I follow the copied URL
    Then I see question edit page
