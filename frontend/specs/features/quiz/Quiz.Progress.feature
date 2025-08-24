Feature: Quiz progress bar

  Background:
    Given questions
      | bookmark  | question                                              | answers                   |
      | Planet    | Which planet is known as the Red Planet?              | Mars (*), Venus           |
      | Australia | What's the capital city of Australia?                 | Sydney, Canberra (*)      |
      | Fruit     | Which fruit is known for having seeds on the outside? | Strawberry (*), Blueberry |

  # And a quiz "D" with questions "Planet", "Australia", "Fruit" with "feedback at the end"
  # And a quiz "E" with questions "Planet", "Australia", "Fruit" with "continuous feedback"

  Scenario: Feedback at the end
    - Progress bar shows the current page of the quiz

    When I start quiz "-4"
    Then progress shows 1 of 3

    When I answer "Mars"
    Then progress shows 2 of 3

    When I answer "Sydney"
    Then progress shows 3 of 3


  Scenario: Continuous feedback
    - Progress bar updates after navigating to the next question

    When I start quiz "-5"
    Then progress shows 1 of 3

    When I answer "Mars"
    Then progress shows 1 of 3

    When I proceed to the next question
    Then progress shows 2 of 3
