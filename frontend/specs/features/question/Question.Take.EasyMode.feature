Feature: Take a question in EasyMode

  @feature-flag
  Scenario: Multiple choice question page in EasyMode displays the number of correct answers
    Given a question "Which of these countries are in Europe?"
    * with answers:
      | Italy   | * |
      | France  | * |
      | Morocco |   |
      | Spain   | * |
      | Canada  |   |
    * marked as easy mode
    * saved and bookmarked as "Europe"

    When I take question "Europe"
    Then I see that the question has 3 correct answers

  @skip
  Scenario: Single choice question page does not display the number of correct answers
    Given a question "Which of these countries is not in Europe?"
    * with answers:
      | Italy   |   |
      | France  |   |
      | Morocco | * |
      | Spain   |   |
    * saved and bookmarked as "Europe"

    When I take question "Europe"
    Then I do not see correct answers count
