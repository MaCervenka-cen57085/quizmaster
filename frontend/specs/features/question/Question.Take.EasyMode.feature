Feature: Take a question in EasyMode

  @skip
  Scenario: Multiple choice question in EasyMode displays the number of correct answers
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
