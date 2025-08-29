Feature: Create question GUI
    - Question text is required
    - Answer text for each answer is required
    - At least one correct answer is required
    - Question explanation is optional

Background:
    Given I start creating a question
    * I enter question "What are cities of Czech Republic?"
    * with answers:
      | Brno     |  | No Brno |
      | Brussels |  | Yes     |
      | Prague   |  | Yes     |
      | Berlin   |   | Germany |

  @skip
  Scenario: Create multiple choice question without correct answer
    Given I start creating a question
    * I enter question "What are cities of Czech Republic?"
    * I enter answer 1 text "", incorrect, with explanation ""
    * I enter answer 3 text "", incorrect, with explanation ""
    * I enter question explanation ""
    When I attempt to save the question
    Then I see error messages
      | empty-question    |
      | empty-answer |
      | no-correct-answer |
      | empty-answer-explanation |
