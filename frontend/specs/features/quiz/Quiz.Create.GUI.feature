Feature: Create quiz GUI

  Scenario: Empty quiz creation
    When I start creating a quiz
    Then I see the quiz submit button as active
    * I see empty title field
    * I see empty description field
    * I see empty question list field
    * I see empty pass score field
    * I see empty time limit field

  Scenario: Empty quiz creation should show the link to take the quiz
    Given I start creating a quiz
    When I attempt to save the quiz
    Then I see a link to the take quiz page

