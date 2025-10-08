# Quizmaster Domain Language

| | | | |
|--------|--------|------|------|
|[Answer](#answer) | [Learning mode](#learning-mode) | [Question list](#question-list) | [Time limit](#time-limit) |
|[Bookmark](#bookmark) | [Pass score](#pass-score) | [Quiz](#quiz) | |
|[Exam mode](#exam-mode) | [Question](#question) | [Skip](#skip) | |

## Answer
An **answer** is a possible response to a [question](#question).  It can be correct or incorrect.  It can be selected by the user to answer the question.

## Bookmark
A **Bookmark** is a feature that allows users to later return to the bookmarked question while taking a [Quiz](#Quiz).  Although you can always navigate back to the question, bookmarking is useful when you want to return to a specific question after you have already moved on to the next question.

## Exam mode

In an **Exam mode** [Quiz](), the user can only see the [questions]() and the answers. Submitting an answer, immediately triggers the next question. The user cannot see the feedback or the explanation until the quiz is completed. The user can take the quiz only once and see the score and the feedback after submitting the quiz.

## Learning mode

In a **Learning mode** [Quiz](), the user can see the [questions](), the answers. The user can see the feedback and the explanation immediately after submitting an answer and must manually proceed to the next question.  The user can submit the quiz multiple times and can see the score and the feedback after submitting the quiz.

## Pass score

A **Pass score** is the minimum score a user must achieve to pass a [Quiz](#Quiz).  It is expressed as a percentage of the total number of questions in the quiz.  For example, a pass score of 80% means that the user must answer 80% of the questions correctly to pass the quiz.

## Question

A **Question** tests user's knowledge of a specific topic. The user selects from multiple answers.
For example:

```text
What is the capital of France?
- Paris
- Montreal
- Nice
- Bordeaux
```

- **Single-choice** questions have only one correct answer.
- **Multiple-choice** questions have more than one correct answer. Possibly all answers can be correct.
- **Feedback** is provided to the user after selecting an answer.
- Detailed **Explanation** can be provided, either for the whole question, for each individual answer, or both.

## Question list

A **Question list** is a collection of questions.

## Quiz

A **Quiz** is a [question list](#Question-list) that can be taken by a user.  It can be taken in [Exam mode](#Exam-mode) or [Learning mode](#learning-mode).  Each Quiz has defined a [pass score]() and a [time limit]().

## Skip
You can **skip** a question which leaves it unanswered and moves to the next question.  You can return to the skipped question later using BACK or a [Bookmark](#bookmark).

## Time limit
A **Time limit** is the maximum amount of time a user has to complete a [Quiz](#Quiz).  It is expressed in minutes.  For example, a time limit of 10 minutes means that the user has 10 minutes to complete the quiz.  If the user does not complete the quiz within the time limit, the quiz is automatically submitted and the user's score is calculated.
