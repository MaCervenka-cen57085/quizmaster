Feature: Create question GUI - multi choice with easy mode

  Scenario: By default easy mode is unchecked
    Given I start creating a question
    Then Easy mode checkbox is checked
