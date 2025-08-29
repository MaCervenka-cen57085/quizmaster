Feature: Create quiz GUI

  Background:
    Given questions
      | bookmark   | question                                              | answers                   |
      | Planet     | Which planet is known as the Red Planet?              | Mars (*), Venus           |
      | Capital    | What's the capital city of Australia?                 | Sydney, Canberra (*)      |

    # Given question lists
    #   | title     | questions                      |
    #   | A         | Planet                         |
    #   | B         | Planet, Capital                |

  Scenario: Empty quiz creation
    When I start creating a quiz
    Then I see the quiz submit button as active
    * I see empty title field
    * I see empty description field
    * I see empty question list field
    * I see empty pass score field
    * I see empty time limit field

  Scenario: Empty quiz creation should show the link to take the quiz
    Given I start creating a quiz
    When I attempt to save the quiz
    Then I see a link to the take quiz page

  Scenario: Empty quiz creation with failing backend call
    Given I start creating a quiz
    Given the backend fails with error message "Failed to create quiz"
    When I attempt to save the quiz
    Then I see the error message "Failed to create quiz"

  @skip
  Scenario: Quiz creation with an existing question list
    Given I start creating a quiz
    When I enter an existing question list <id>
    When I attempt to save the quiz
    When I click the take quiz link
    Then I see the amount of questions in the quiz
