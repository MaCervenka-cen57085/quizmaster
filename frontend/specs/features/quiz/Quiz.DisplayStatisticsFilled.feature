Feature: Display Quiz Statistics from Quiz

  Background:
    Given questions
      | bookmark | question                            | answers                                   | explanation |
      | Klávesnice     | Pokud jsem u klávesnice, jsem:   | Lopata_týmu, Houba_přijímající_informace, Klepeťák, Umpalumpa (*)                    | Pomoc       |
      | Programování   | Čeho vzniká při mob programmingu | Špatný_kód, Hodně_konfliktů_s_vedlejším_týmem (*), Hodně_dobrých_myšlenek, Dobrý_kód |             |

    Given quizes
      | bookmark | title  | description   | questions     | mode  | pass score | time limit |
      | -1       | Quiz ShiftLeftQuiz | Description ShiftLeftQuiz | Klávesnice,Programování    | exam  | 85         | 120        |

  Scenario Outline: Quiz score averaged
    Given a quiz "ShiftLeftQuiz" with 2 questions, exam mode and 75% pass score
    When I start the quiz
    * I answer 2 questions correctly
    * I answer 0 questions incorrectly
    * I proceed to the score page
    Then I see the result 2 correct out of 2, 100%, passed, required passScore 75%

    When I start the quiz
    * I answer 1 questions correctly
    * I answer 1 questions incorrectly
    * I proceed to the score page
    Then I see the result 1 correct out of 2, 50%, failed, required passScore 75%

    When I start the quiz

    When I open quiz stats
    Then I see the quiz statistics page
    * I see quiz name on stats page "ShiftLeftQuiz"
    * I see quiz description on stats page "ShiftLeftQuiz"
    * I see times taken 3
    * I see times finished 2
    * I see average score 75 %
