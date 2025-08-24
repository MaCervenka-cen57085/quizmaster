Feature: Take a quiz

   Background:
    Given questions
      | bookmark  | question                            | answers                              |
      | Sky       | What is the standard colour of sky? | Red, Blue (*), Green, Black          |
      | France    | What is capital of France?          | Marseille, Lyon, Paris (*), Toulouse |

    # Given a quiz containing questions "Sky" and "France"

  Scenario: Quiz question is displayed and not answered
    Given I start quiz "-1"
    Then I see question "Sky"
    And no answer is selected

Scenario: After page refresh no answer is selected
    Given I start quiz "-1"
    When I answer "Green"
    And I refresh page
    Then no answer is selected

Scenario: After next page is displayed, no answer and explanation is displayed
    Given I start quiz "-1"
    When I answer "Green"
    Then no answer is selected
