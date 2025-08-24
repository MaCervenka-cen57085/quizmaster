Feature: Create quiz GUI

  Scenario: Create a quiz without questions
    Given I start creating a quiz
    When I enter quiz title "Math Quiz"
    * I enter quiz description "Lorem ipsum dolor sit amet"
    * I select quiz mode "learning"
    * I enter quiz pass score "65"
    * I save the quiz
    Then I see a link to take the quiz
