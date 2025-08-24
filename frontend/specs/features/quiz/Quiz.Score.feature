Feature: Evaluate quiz score

  Background:
    Given questions
      | bookmark  | question                            | answers                              |
      | Sky       | What is the standard colour of sky? | Red, Blue (*), Green, Black          |
      | France    | What is capital of France?          | Marseille, Lyon, Paris (*), Toulouse |

Scenario: Quiz score all question are correct
  Given I start quiz "-1"
  When I answer "Blue"
  * I answer "Paris"
  * I click the evaluate button
  Then I see the result 2 correct out of 2, 100%, passed, required passScore 85%

Scenario: Quiz score one question is inccorect
  Given I start quiz "-1"
  When I answer "Green"
  * I answer "Paris"
  * I click the evaluate button
  Then I see the result 1 correct out of 2, 50%, failed, required passScore 85%

Scenario Outline: Show question on score page
  Given I start quiz "-1"
  When I answer "Blue"
  * I answer "Marseille"
  * I click the evaluate button
  Then I see the question "<question>"
  Examples:
      | question                            |
      | What is the standard colour of sky? |
      | What is capital of France?          |

Scenario: Show options of question on score page
  Given I start quiz "-1"
  When I answer "Blue"
  * I answer "Marseille"
  * I click the evaluate button
  Then I see all options for question "Sky"

Scenario: Show question explanation of question on score page
  Given I start quiz "-1"
  When I answer "Blue"
  * I answer "Marseille"
  * I click the evaluate button
  Then I see question explanation "Sky is blue because of Rayleigh scattering" for question "Sky"

Scenario: Show user select
  Given I start quiz "-1"
  When I answer "Blue"
  * I answer "Marseille"
  * I click the evaluate button
  Then I see user select "Blue" for question "Sky"

Scenario: Quiz with passScore 85% and score 50% will fail
  Given I start quiz "-1"
  When I answer "Green"
  * I answer "Paris"
  * I click the evaluate button
  Then I see the result 1 correct out of 2, 50%, failed, required passScore 85%

Scenario: Quiz with passScore 40% and score 50% will pass
  Given I start quiz "-2"
  When I answer "Green"
  * I click the next button
  * I answer "Paris"
  * I click the evaluate button
  Then I see the result 1 correct out of 2, 50%, passed, required passScore 40%

Scenario: Quiz with corrected answers will show original and corrected results
  Given I start quiz "-2"
  When I answer "Green"
  * I answer "Blue"
  * I click the next button
  * I answer "Lyon"
  * I click the evaluate button
  Then I see the result 1 correct out of 2, 50%, passed, required passScore 40%
  Then I see the original result 0, 0%, failed

Scenario: Quiz without corrections does not show corrected results
  Given I start quiz "-1"
  When I answer "Green"
  * I answer "Paris"
  * I click the evaluate button
  Then I see the result 1 correct out of 2, 50%, failed, required passScore 85%
  Then I don't see the original results
