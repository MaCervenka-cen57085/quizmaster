Feature: Create question GUI

  @only
  Scenario: Default values
    When I start creating a question
    Then I see empty question field
    * I see multiple choice is unchecked
    * I see easy mode is checked
    * I see 2 empty answer fields, incorrect, with empty explanations fields
    * I see empty question explanation field
