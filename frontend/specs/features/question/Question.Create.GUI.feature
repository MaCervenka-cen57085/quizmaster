Feature: Create question GUI

  Scenario: Default values
    When I start creating a question
    Then I see empty question field
    * I see multiple choice is unchecked
    * I see 2 empty answer fields, incorrect, with empty explanations fields
    * I see empty question explanation field

  Scenario: Question take and question edit URLs
    Successfully created question has two URLs:
    - question take URL the quiz maker can share with quiz takers
    - private hashed edit URL for future edits

    Given I start creating a question
    * I enter question "2 + 2 = ?"
    * I enter answers
      | 4 | * |
      | 5 |   |

    When I attempt to save the question
    Then I see question edit page
    And I see question-take URL and question-edit URL
