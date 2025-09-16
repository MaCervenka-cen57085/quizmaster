Feature: Take a quiz

  Background:
    Given questions
      | bookmark  | question                                              | answers                   |
      | Planet    | Which planet is known as the Red Planet?              | Mars (*), Venus           |
      | Australia | What's the capital city of Australia?                 | Sydney, Canberra (*)      |
      | Fruit     | Which fruit is known for having seeds on the outside? | Strawberry (*), Blueberry |
    And quizes
      | bookmark | questions                | mode  | pass score | time limit |
      | Exam     | Planet, Australia, Fruit | exam  | 100        | 120        |
      | Learn    | Planet, Australia, Fruit | learn | 100        | 120        |

  Scenario: Exam mode
    - Quiz in exam mode does not show feedback until the quiz is finished
    - Submitting an answer proceeds directly to the next question

    When I start quiz "Exam"
    Then I see question "Planet"

    When I answer "Mars"
    Then I see question "Australia"


  Scenario: Learning mode
    - Quiz on learning mode feedback shows feedback after each question
    - User must manually proceed to the next question

    When I start quiz "Learn"
    Then I see question "Planet"

    When I answer "Mars"
    Then I see feedback "Correct!"

    When I proceed to the next question
    Then I see question "Australia"


  Scenario: Learning mode - Retake question
    - User can retake a question and see the feedback again

    When I start quiz "Learn"
    Then I see question "Planet"

    When I answer "Mars"
    Then I see feedback "Correct!"

    When I answer "Venus"
    Then I see feedback "Incorrect!"
