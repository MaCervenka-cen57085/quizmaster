Feature: Question list

  Scenario: Show blank page nonexisting guid
    Given I open question list "X"
    Then I see a blank page

  Scenario: Show empty question list existing guid
    Given I saved the question list "X"
    Then I see question list title "X"
    And I see an empty question list

  Scenario: Click create new question open question form
    Given I saved the question list "X"
    Then I see question list title "X"
    When I click "Create New Question" button
    Then I see "Quiz Question Creation Page" form

  Scenario: Show non empty question
    Given I saved the question list "X"
    When I create new question to list "Xquestion"
    Then I see question list title "X"
    And I see question in list "Xquestion"

  Scenario: Open edit question form
    Given I saved the question list "X"
    When I create new question to list "Xquestion"
    And I click Edit button for question "Xquestion"
    Then I see "Xquestion" editable form
