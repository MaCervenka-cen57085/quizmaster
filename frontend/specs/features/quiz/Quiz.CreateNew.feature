@skip
Feature: Create Quiz from Question list

  Background:
    Given I saved the question list "Y"
    Then I wait for 1000 ms
    * I add an existing question "Planet" to the list
    Then I wait for 1000 ms
    * I add an existing question "Australia" to the list
    Then I wait for 2000 ms

  @skip
  Scenario: Empty quiz creation
    When I start creating a quiz
    #Then I see question list

