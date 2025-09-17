Feature: Create Quiz from Question list

  Background:
    Given questions
      | bookmark  | question                                 | answers                     |
      | Planet    | Which planet is known as the Red Planet? | Mars (*), Venus             |
      | Australia | What's the capital city of Australia?    | Sydney, Canberra (*)        |
      | Cars      | Who build first car in Czechia?          | Adolf (*), Laurin a Klement |
    Given I saved the question list "YC"
    Then I wait for 1000 ms
    * I add an existing question "Planet" to the list
    Then I wait for 1000 ms
    * I add an existing question "Australia" to the list
    Then I wait for 1000 ms
    * I add an existing question "Cars" to the list
    Then I wait for 2000 ms

  Scenario: Create quiz with 3 questions
    When I click on Create New Quiz
    And I wait for 1000 ms
    Then I see question list with 3 available questions
    When I select question "Planet"
    When I select question "Australia"
    And I fill title "My New Quiz"
    And I fill description "Bomba quiz"
    Then I submit new quiz
    * I see the welcome page
    * I see quiz name "My New Quiz"
    * I see quiz description "Bomba quiz"
    * I see question count 2

  Scenario: Create quiz with time limit and pass score
    When I click on Create New Quiz
    And I wait for 1000 ms
    Then I see time limit set to 600 seconds
    Then I see pass score set to 80 %
