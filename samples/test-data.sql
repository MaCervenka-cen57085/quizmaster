-- Test data for Playwright tests
-- This file contains the exact data needed to make all tests run successfully

-- Clear existing data (if any)
DELETE FROM quiz_answer;
DELETE FROM quiz_run;
DELETE FROM quiz_question;
DELETE FROM quiz;
DELETE FROM question_list;

-- Insert Questions with EXACT text that the tests expect
-- Note: The tests look for questions by specific text, so we must match exactly
INSERT INTO quiz_question (id, question, answers, correct_answers, question_explanation, explanations, question_list_guid, easy_mode, multiple_choice) VALUES
-- Quiz -1 needs: "Sky" then "France" (IDs 1,2)
(1, 'What is the standard colour of sky?', ARRAY['Red', 'Blue', 'Green', 'Black'], ARRAY[2], 'Sky is blue because of Rayleigh scattering', ARRAY['Red is not the standard sky color', 'Blue is the standard sky color due to Rayleigh scattering', 'Green is not the standard sky color', 'Black is not the standard sky color'], NULL, true, false),
(2, 'What is capital of France?', ARRAY['Marseille', 'Lyon', 'Paris', 'Toulouse'], ARRAY[3], 'Paris is the capital of France', ARRAY['Marseille is a major port city', 'Lyon is a major economic center', 'Paris is the capital and largest city', 'Toulouse is known for aerospace industry'], NULL, true, false),

-- Quiz -4 needs: "Planet" then "Australia" (IDs 3,4)
(3, 'Which planet is known as the Red Planet?', ARRAY['Mars', 'Venus'], ARRAY[1], 'Mars appears red due to iron oxide on its surface', ARRAY['Mars is the fourth planet from the Sun', 'Venus is the second planet from the Sun'], NULL, true, false),
(4, 'What''s the capital city of Australia?', ARRAY['Sydney', 'Canberra'], ARRAY[2], 'Canberra is the capital city of Australia', ARRAY['Sydney is the largest city', 'Canberra is the capital city'], NULL, true, false),

-- Quiz -3 needs: "Nose" then "France" (IDs 5,6) - multiple choice
(5, 'Which animal has long nose?', ARRAY['Elephant', 'Anteater', 'Swordfish', 'Bulldog'], ARRAY[1,2,3], 'These animals are known for their long noses', ARRAY['Elephant has a long trunk', 'Anteater has a long snout', 'Swordfish has a long bill', 'Bulldog has a short nose'], NULL, true, true),
(6, 'What is capital of France?', ARRAY['Marseille', 'Lyon', 'Paris', 'Toulouse'], ARRAY[3], 'Paris is the capital of France', ARRAY['Marseille is a major port city', 'Lyon is a major economic center', 'Paris is the capital and largest city', 'Toulouse is known for aerospace industry'], NULL, true, false),

-- Additional questions for other tests (IDs 7+)
(7, 'What is 2 + 2?', ARRAY['3', '4', '5', '6'], ARRAY[2], 'Basic arithmetic: 2 + 2 = 4', ARRAY['3 is incorrect', '4 is correct', '5 is incorrect', '6 is incorrect'], NULL, true, false),
(8, 'Which programming language is this?', ARRAY['Java', 'Python', 'JavaScript', 'C++'], ARRAY[1], 'This is a Java application', ARRAY['Java is correct', 'Python is incorrect', 'JavaScript is incorrect', 'C++ is incorrect'], NULL, true, false),
(9, 'What is the largest ocean on Earth?', ARRAY['Atlantic', 'Indian', 'Arctic', 'Pacific'], ARRAY[4], 'The Pacific Ocean is the largest', ARRAY['Atlantic is the second largest', 'Indian is the third largest', 'Arctic is the smallest', 'Pacific is the largest'], NULL, true, false),
(10, 'Which year did World War II end?', ARRAY['1943', '1944', '1945', '1946'], ARRAY[3], 'World War II ended in 1945', ARRAY['1943 is too early', '1944 is too early', '1945 is correct', '1946 is too late'], NULL, true, false),
(11, 'What is the chemical symbol for gold?', ARRAY['Ag', 'Au', 'Fe', 'Cu'], ARRAY[2], 'Au is the chemical symbol for gold', ARRAY['Ag is silver', 'Au is gold', 'Fe is iron', 'Cu is copper'], NULL, true, false),
(12, 'Which country has the largest population?', ARRAY['India', 'China', 'USA', 'Russia'], ARRAY[2], 'China has the largest population', ARRAY['India is second largest', 'China is the largest', 'USA is third largest', 'Russia is ninth largest'], NULL, true, false),
(13, 'What is the capital of Japan?', ARRAY['Tokyo', 'Osaka', 'Kyoto', 'Yokohama'], ARRAY[1], 'Tokyo is the capital of Japan', ARRAY['Tokyo is the capital', 'Osaka is a major city', 'Kyoto is a former capital', 'Yokohama is a major port city'], NULL, true, false);

-- Insert Quizzes with CORRECT question mappings that the tests expect
-- CRITICAL: The questions array must contain the exact IDs that match the questions above
INSERT INTO quiz (id, questions, after_each, title, description, pass_score) VALUES
-- Quiz -1: MUST have questions 1,2 in that order (Sky, then France)
(-1, ARRAY[1,2], false, 'Basic Quiz Test', 'Quiz for testing basic functionality', 70),
-- Quiz -4: MUST have questions 3,4 in that order (Planet, then Australia)
(-4, ARRAY[3,4], false, 'Bookmark Test Quiz', 'Quiz for testing bookmarks', 70),
-- Quiz -3: MUST have questions 5,6 in that order (Nose, then France)
(-3, ARRAY[5,6], false, 'Multiple Choice Test Quiz', 'Quiz for testing multiple choice', 70),
-- Quiz -2: Used by other tests
(-2, ARRAY[7,8,9], false, 'Advanced Quiz Test', 'Quiz for testing advanced functionality', 70),
-- Quiz -5: Used by other tests
(-5, ARRAY[10,11,12], false, 'Final Quiz Test', 'Quiz for testing final functionality', 70),
-- Real quizzes
(1, ARRAY[1,2,3,4,5], false, 'Real Quiz 1', 'First real quiz', 70),
(2, ARRAY[6,7,8,9,10], false, 'Real Quiz 2', 'Second real quiz', 70);

-- Insert Question Lists
INSERT INTO question_list (guid, title) VALUES
('list-1', 'General Knowledge'),
('list-2', 'Science');

-- Insert Quiz Runs (sample data for testing)
INSERT INTO quiz_run (id, quiz_id, answers, is_correct) VALUES
(1, 1, ARRAY[2,3,1], true),
(2, 1, ARRAY[1,2,3], false),
(3, 2, ARRAY[1,2,3,4,5], true),
(4, 2, ARRAY[2,1,3,4,5], false);

-- Insert Quiz Answers (sample data for testing)
INSERT INTO quiz_answer (id, quiz_run_id, question_id, answers) VALUES
(1, 1, 1, ARRAY[2]),
(2, 1, 2, ARRAY[3]),
(3, 2, 1, ARRAY[1]),
(4, 2, 2, ARRAY[2]);

-- Set sequences to correct values
SELECT setval('quiz_question_id_seq', (SELECT COALESCE(MAX(id), 1) FROM quiz_question));
SELECT setval('quiz_id_seq', (SELECT COALESCE(MAX(id), 1) FROM quiz));
SELECT setval('quiz_run_id_seq', (SELECT COALESCE(MAX(id), 1) FROM quiz_run));
SELECT setval('quiz_answer_id_seq', (SELECT COALESCE(MAX(id), 1) FROM quiz_answer));

-- Verify the quiz-question relationships are correct
-- 1. Check what questions are actually in the database
SELECT id, question FROM quiz_question ORDER BY id;

-- 2. Check what quizzes are actually in the database
SELECT id, questions FROM quiz ORDER BY id;

-- 3. Check the specific quiz-question relationships that are failing
SELECT 'Quiz -4 should show questions 3,4:' as check_info, id, questions FROM quiz WHERE id = -4;
SELECT 'Quiz -3 should show questions 5,6:' as check_info, id, questions FROM quiz WHERE id = -3;
SELECT 'Quiz -1 should show questions 1,2:' as check_info, id, questions FROM quiz WHERE id = -1;

-- 4. Verify the question IDs actually exist
SELECT 'Question 3 exists:' as check_info, id, question FROM quiz_question WHERE id = 3;
SELECT 'Question 4 exists:' as check_info, id, question FROM quiz_question WHERE id = 4;
SELECT 'Question 5 exists:' as check_info, id, question FROM quiz_question WHERE id = 5;
SELECT 'Question 6 exists:' as check_info, id, question FROM quiz_question WHERE id = 6;

-- 5. Check if there are any foreign key constraints or other issues
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'quiz'
ORDER BY ordinal_position;
