Feature: Create Quiz from Question list

  Background:
   Given questions
      | bookmark  | question                                              | answers                   |
      | Planet    | Which planet is known as the Red Planet?              | Mars (*), Venus           |
      | Australia | What's the capital city of Australia?                 | Sydney, Canberra (*)      |
    Given I saved the question list "YC"
    Then I wait for 1000 ms
    * I add an existing question "Planet" to the list
    Then I wait for 1000 ms
    * I add an existing question "Australia" to the list
    Then I wait for 2000 ms

  Scenario: Create quiz with 2 questions
    When I start creating a quiz
    And I wait for 1000 ms
    Then I see question list with 2 available questions
    When I select questions "1,2"
    Then I submit new quiz

