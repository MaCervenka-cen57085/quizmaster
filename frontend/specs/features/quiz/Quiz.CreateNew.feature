Feature: Create Quiz from Question list

Background:
    Given a question list with questions
      | question  | answers  |
      | 2 + 2 = ? | 4 (*), 5 |
      | 3 * 3 = ? | 9 (*), 6 |
      | 4 / 2 = ? | 2 (*), 3 |

  @feature-flag
  Scenario: Create quiz and display it in quiz list
    When I start creating a new quiz
    * I enter quiz name "Math Quiz"
    * I enter quiz description "Very hard math quiz"
    * I select question "2 + 2 = ?"
    * I select question "4 / 2 = ?"
    * I submit the quiz
    Then I see the quiz "Math Quiz" in the question list

Scenario: Create quiz with default values
    When I start creating a new quiz
    Then I see empty quiz title
    And I see empty quiz description
    And I see time limit "600" seconds
    And I see pass score "80"
    And I see quiz question "2 + 2 = ?"
    And I see quiz question "3 * 3 = ?"
    And I see quiz question "4 / 2 = ?"

@not-feature-flag
Scenario: Create quiz with 3 questions
    When I start creating a new quiz
    * I enter quiz name "Math Quiz"
    * I enter quiz description "Very hard math quiz"
    * I select question "2 + 2 = ?"
    * I select question "4 / 2 = ?"
    * I submit the quiz
    * I take the quiz
    Then I see the welcome page
    * I see quiz name "Math Quiz"
    * I see quiz description "Very hard math quiz"
    * I see question count 2

@not-feature-flag
  Scenario: Quiz form with only default values
    When I start creating a new quiz
    And I submit the quiz
    Then I see error messages in quiz form
      | titleRequired |
      | descriptionRequired |

  @not-feature-flag
  Scenario: Display error when score is above 100
    When I start creating a new quiz
    And I enter quiz name "Math Quiz"
    And I enter quiz description "Very hard math quiz"
    And I enter pass score "220"
    And I submit the quiz
    Then I see error messages in quiz form
      | scoreAboveMax |

 @not-feature-flag
  Scenario: Display error when limit is negative
    When I start creating a new quiz
    And I enter quiz name "Math Quiz"
    And I enter quiz description "Very hard math quiz"
    And I enter time limit "-10"
    And I submit the quiz
    Then I see error messages in quiz form
      | negativeTimeLimit|

@not-feature-flag
  Scenario: Display error when limit is over 21600
    When I start creating a new quiz
    And I enter quiz name "Math Quiz"
    And I enter quiz description "Very hard math quiz"
    And I enter time limit "21601"
    And I submit the quiz
    Then I see error messages in quiz form
      | timeLimitAboveMax |

  @not-feature-flag
  Scenario: Display no error when timelimit is cleared
    When I start creating a new quiz
    And I enter quiz name "Math Quiz"
    And I enter quiz description "Very hard math quiz"
    And I clear time limit
    And I select question "2 + 2 = ?"
    And I submit the quiz
    Then I see no error messages in quiz form
    And I see time limit "0" seconds

  @not-feature-flag
  Scenario: Display no error when score is cleared
    When I start creating a new quiz
    And I enter quiz name "Math Quiz"
    And I enter quiz description "Very hard math quiz"
    And I clear score
    And I select question "2 + 2 = ?"
    And I submit the quiz
    Then I see no error messages in quiz form
    And I see pass score "0"
