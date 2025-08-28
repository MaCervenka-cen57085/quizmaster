Feature: Create quiz GUI

  Scenario: Empty quiz creation
    When I start creating a quiz
    Then I see the quiz submit button as active
    * I see empty title field
    * I see empty description field
    * I see empty question list field
    * I see empty pass score field
    * I see empty time limit field

