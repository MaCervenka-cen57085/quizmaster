Feature: Create quiz GUI

  @skip
  Scenario: Default values
    When I start creating a quiz
    Then I see the quiz submit button as active
    * I see empty title field
    * I see empty description fieldI see empty question list field
    * I see empty pass score field
    * I see empty time limit field

  Scenario: Empty quiz creation
    When I start creating a quiz
    Then I see the quiz submit button as active
    * I see empty title field
    * I see empty description field
