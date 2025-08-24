Feature: Run timer
  Scenario: Display countdown timer
    Given I start quiz "-1"
    Then I should see the countdown timer "2:00"

  Scenario: Display result table after 2 minutes
    Given I start quiz "-1"
    When I will wait for "2:00"
    And I should see the text "Game over time"
    Then I should see the dialog evaluate button
    And I click on the dialog evaluate button
    Then I should see the results table

  Scenario: Display score 0 when no answers were given
    Given I start quiz "-1"
    When I will wait for "2:00"
    And I should see the text "Game over time"
    Then I should see the dialog evaluate button
    And I click on the dialog evaluate button
    Then I should see the results table
    Then I see the result 0 correct out of 2, 0%, failed, required passScore 85%

  Scenario: Display score 1/2 when answered one correctly and timed out
    Given I start quiz "-1"
    When I answer "Blue"
    Then I will wait for "2:00"
    And I should see the text "Game over time"
    Then I should see the dialog evaluate button
    And I click on the dialog evaluate button
    Then I should see the results table
    Then I see the result 1 correct out of 2, 50%, failed, required passScore 85%
