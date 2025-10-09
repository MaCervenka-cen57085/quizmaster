Feature: Question list

  Scenario: Create a question in a question list
    Given a question list "My List"
    When I create questions within the list
      | question  | answers  |
      | 2 + 2 = ? | 4 (*), 5 |
      | 3 * 3 = ? | 9 (*), 6 |
    Then I see question "2 + 2 = ?" in the list
    And I see question "3 * 3 = ?" in the list

  Scenario: Open edit question form
    Given I saved the question list "X"
    When I create new question to list "Xquestion"
    And I click Edit button for question "Xquestion"
    Then I see "Xquestion" editable form

  Scenario: Take question in a question list
    Given a question list "My List"
    And I create questions within the list
      | question  | answers  |
      | 2 + 2 = ? | 4 (*), 5 |
      | 3 * 3 = ? | 9 (*), 6 |
    When I take question "2 + 2 = ?" from the list
    Then I see the question and the answers

  Scenario: Add existing question to question list
    Given a question "What is the capital of Czech Republic?"
    * with answers:
      | Brno   |   | No Brno |
      | Prague | * | Yes     |
      | Berlin |   | Germany |
    * with explanation "Czechia is a country in Europe. Czechs love beer."
    * saved and bookmarked as "Czechia"
    * I wait for 1000 ms
    Given I saved the question list "X"
    When I add an existing question "Czechia" to the list
    Then I see question in list "What is the capital of Czech Republic?"

  Scenario: I copy the take question url
    Given I saved the question list "X"
    When I create new question to list "Xquestion"
    Then I can copy the link to the take question "Xquestion"
    And I am notified about the copied link

  Scenario: I copy the edit question url
    Given I saved the question list "X"
    When I create new question to list "Xquestion"
    Then I can copy the link to the edit question "Xquestion"
    And I am notified about the copied link

  @skip
  Scenario: I remove the question from the question list
    Given I saved the question list "X"
    When I create new question to list "Xquestion"
    Then I can remove the question "Xquestion"

  Scenario: I see an error message if format of existing question field is invalid
    Given I saved the question list "X"
    When I add an invalid question to the list
    Then I see an error message invalid question format

  @skip
  Scenario: Create new quiz
    Given I click on button Create Quiz Button
