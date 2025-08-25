Feature: Edit question GUI

  Background:
    Given a question "What is the capital of Czech Republic?"
    * with answers:
      | Brno       |   | No Brno  |
      | Prague     | * | Yes      |
      | Berlin     |   | Germany  |
    * with explanation "Czechia is a country in Europe. Czechs love beer."
    * saved and bookmarked as "Czechia"

  Scenario: Prepopulated form fields
    When I start editing question "Czechia"
    Then I see "What is the capital of Czech Republic?" in the question field
    * I see multiple choice is unchecked
    * I see answer 1 text "Brno", incorrect, with explanation "No Brno"
    * I see answer 2 text "Prague", correct, with explanation "Yes"
    * I see answer 3 text "Berlin", incorrect, with explanation "Germany"
    * I see "Czechia is a country in Europe. Czechs love beer." in the question explanation field

  Scenario: Edit all fields
    Given I start editing question "Czechia"
    * I enter question "What is the capital of Slovakia?"
    * I enter answer 1 text "It's Brno", incorrect, with explanation "No, it's not Brno"
    * I enter answer 2 text "It's Prague", incorrect, with explanation "No, it's not Prague"
    * I enter answer 3 text "It's Bratislava", correct, with explanation "Yes!"
    * I enter question explanation "Slovakia is a country in Europe. Slovaks love borovička."

    When I submit the question
    * I refresh the page

    Then I see "What is the capital of Slovakia?" in the question field
    * I see multiple choice is unchecked
    * I see answer 1 text "It's Brno", incorrect, with explanation "No, it's not Brno"
    * I see answer 2 text "It's Prague", incorrect, with explanation "No, it's not Prague"
    * I see answer 3 text "It's Bratislava", correct, with explanation "Yes!"
    * I see "Slovakia is a country in Europe. Slovaks love borovička." in the question explanation field

  Scenario: Multiple choice of correct answers
    When I start editing question "Czechia"
    When I mark a multiple choice
    Then I see checkboxes for every answer
    When I mark 2 checkbox
    And I save it
    And I refresh the page
    Then I see answer 1 with marked checkbox
    Then I see answer 2 with marked checkbox
