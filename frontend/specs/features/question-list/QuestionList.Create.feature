Feature: Create question list

  Scenario: Create question list
    Given I start creating a question list
    * I enter question list name "My List"
    When I submit the question list
    Then I see the "My List" question list page
    * I see an empty question list
