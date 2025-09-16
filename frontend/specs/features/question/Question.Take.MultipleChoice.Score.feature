Feature: Take a multiple choice question with partial score

  Background:
    Given questions
      | bookmark  | question                              | answers                                      |
      | Planets   | Which of the following are planets?   | Mars (*), Pluto, Venus (*), Titan, Earth (*) |

    Scenario Outline: Multiple choice question with score
    Question is scored as follows:
    - all correct answers gives 1 point
    - one incorrect answer selected gives 0.5 point
    - more than one incorrect answer selected gives 0 point

    When I take question "Planets"
    And I answer "<answer>"
    Then I see score "Score: <score>"
    Examples:
      | answer                    | score | description                       |
      | Mars, Venus, Earth        | 1     | all correct answers               |
      | Mars, Venus, Titan, Earth | 0.5   | one incorrect answer              |
      | Mars, Venus               | 0.5   | one correct answer missing        |
      | Mars, Pluto               | 0     | two missing, one incorrect answer |
      | Mars, Pluto, Venus, Titan | 0     | two incorrect answers             |
      | Pluto, Titan              | 0     | two incorrect answers             |
