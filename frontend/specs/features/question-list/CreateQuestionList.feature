Feature: Create question list

  @skip
  Scenario: Create question list without title
    Given I start creating question list
    When I save the question list ""
    Then I see an error message

  Scenario: Create question list
    Given I start creating question list
    When I save the question list "Michaeluv list"
    Then I see an empty question list
    * I see question list title "Michaeluv list"
