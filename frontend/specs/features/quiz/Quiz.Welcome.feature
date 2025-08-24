Feature: Quiz Welcome page

  Scenario Outline: Quiz welcome page
    # Given quiz "a" with 2 questions, pass score 85% and feedback at the end
    # Given quiz "c" with 2 questions, pass score 40% and continuous feedback
    When I open quiz "<quiz>"
    Then I see the welcome page
    * I see quiz name "<name>"
    * I see quiz description
    * I see question count <count>
    * I see pass score <score>%
    * I see feedback type "<type>"
    Examples:
      | quiz | name | count | score | type                |
      | -1    | -1    | 2     | 85    | Feedback at the end |
      | -2    | -2    | 2     | 40    | Continuous feedback |
