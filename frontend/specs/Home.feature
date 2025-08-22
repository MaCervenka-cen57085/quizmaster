Feature: Home Page Links

  Scenario: Validate home page has correct navigation links
    Given I am on the home page
    Then I should see a link to create a new question
    And I should see a link to create a new question list
    And both links should have correct href attributes

  @skip
  #TODO: make backend work, then remove @skip
  Scenario: Validate home page shows existing quizes
    Given I am on the home page
    Then I should see a table of existing quizes
