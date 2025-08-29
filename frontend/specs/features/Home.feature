Feature: Home Page Links
@skip
  Scenario: Validate home page has correct navigation links
    Given I am on the home page
    Then I should see a link to create a new question
    And I should see a link to create a new question list
    And I should see a link to create a new quiz
    And all links should have correct href attributes

  Scenario: Validate home page has 2 links
    Given I am on the home page
    Then I should see a link to create a new question
    And I should see a link to create a new question list
