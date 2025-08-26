Feature: Create question GUI - Single/multiple choice
  Single choice question has exactly one answer correct
  Multiple choice question can have two or more answers correct

  Scenario: Default is single choice
    When I start creating a question
    Then I see multiple choice is unchecked

  Scenario: Single choice: Mark correct answer
    Given I start creating a question
    * I enter answers
      | Brno       |   |
      | Berlin     |   |
      | Bratislava |   |
    When I mark answer 2 as correct
    Then I see the answers fields
      | Brno       |   |
      | Berlin     | * |
      | Bratislava |   |

  Scenario: Single choice: Change correct answer
    Given I start creating a question
    * I enter answers
      | Brno       |   |
      | Berlin     | * |
      | Bratislava |   |
    When I mark answer 1 as correct
    Then I see the answers fields
      | Brno       | * |
      | Berlin     |   |
      | Bratislava |   |

  Scenario: Multiple choice: Mark multiple correct answers
    Given I start creating a question
    * I mark the question as multiple choice
    * I enter answers
      | Brno       |   |
      | Berlin     |   |
      | Bratislava |   |
    When I mark answer 2 as correct
    * I mark answer 3 as correct
    Then I see the answers fields
      | Brno       |   |
      | Berlin     | * |
      | Bratislava | * |

  Scenario: Switch single to multiple choice: Keep selection
    Given I start creating a question
    * I enter answers
      | Brno       |   |
      | Berlin     | * |
      | Bratislava |   |
    When I mark the question as multiple choice
    Then I see the answers fields
      | Brno       |   |
      | Berlin     | * |
      | Bratislava |   |

  Scenario: Switch multiple to single choice: Keep selection
    If exactly one answer is marked as correct for a multiple choice question,
    switching to single choice keeps the marked answer

    Given I start creating a question
    * I mark the question as multiple choice
    * I enter answers
      | Brno       |   |
      | Berlin     | * |
      | Bratislava |   |
    When I mark the question as multiple choice
    Then I see the answers fields
      | Brno       |   |
      | Berlin     | * |
      | Bratislava |   |

  Scenario: Switch multiple to single choice: Reset selection
    If more than one answer is marked as correct for a multiple choice question,
    switching to single choice unmarks all answers.

    Given I start creating a question
    * I mark the question as multiple choice
    * I enter answers
      | Brno       | * |
      | Berlin     | * |
      | Bratislava |   |
    When I mark the question as single choice
    Then I see the answers fields
      | Brno       |   |
      | Berlin     |   |
      | Bratislava |   |
