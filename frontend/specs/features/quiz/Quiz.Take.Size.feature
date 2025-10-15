Feature: Take a quiz

  Background:
    Given questions
      | bookmark  | questions                                             | answers                   |
      | Planet    | Which planet is known as the Red Planet?              | Mars (*), Venus           |
      | Australia | What's the capital city of Australia?                 | Sydney, Canberra (*)      |
      | Fruit     | Which fruit is known for having seeds on the outside? | Strawberry (*), Blueberry |
    And quizes
      | bookmark | questions                | size | mode  | pass score | time limit |
      | Normal   | Planet, Australia, Fruit |    2 | exam  |        100 |        120 |

  Scenario: Normal mode
    - Quiz with question pool size displayed same value in question count at welcome page.

    When I open quiz "Normal"
    Then I see the welcome page
    * I see question count 2
