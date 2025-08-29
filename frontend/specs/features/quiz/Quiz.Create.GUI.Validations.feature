Feature: Create quiz GUI validations
@skip
  Scenario: Pass score validation
    Given I start creating a quiz
    When I enter a pass score "<passscore>"
    Then I see feedback "<feedback>"
        Examples:
      | passscore   | feedback |
      | abc         | Invalid  |
      | 100         | Valid    |
      | 1.2         | Invalid  |
      | 101         | Invalid  |
      | !           | Invalid  |
      | 0           | Valid    |
      | -1          | Invalid  |


