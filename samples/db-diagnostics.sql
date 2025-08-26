-- Database Diagnostics Script
-- This script checks for potential issues that might prevent inserting new records

-- 1. Check if all required tables exist
SELECT 'Table Check' as check_type,
       table_name,
       CASE WHEN table_name IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('quiz_question', 'quiz', 'question_list', 'quiz_run', 'quiz_answer');

-- 2. Check table structures and constraints
SELECT 'Table Structure' as check_type,
       table_name,
       column_name,
       data_type,
       is_nullable,
       column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('quiz_question', 'quiz', 'question_list', 'quiz_run', 'quiz_answer')
ORDER BY table_name, ordinal_position;

-- 3. Check sequences
SELECT 'Sequence Check' as check_type,
       s.sequencename as sequence_name,
       s.sequenceowner as sequence_owner,
       s.start_value,
       s.minimum_value,
       s.maximum_value,
       s.increment,
       s.last_value
FROM pg_sequences s
WHERE s.schemaname = 'public'
  AND s.sequencename IN ('quiz_question_id_seq', 'quiz_id_seq', 'quiz_run_id_seq', 'quiz_answer_id_seq');

-- 4. Check sequence links to tables
SELECT 'Sequence Links' as check_type,
       t.table_name,
       c.column_name,
       c.column_default,
       CASE
           WHEN c.column_default LIKE 'nextval%' THEN 'LINKED'
           WHEN c.column_default IS NULL THEN 'NO DEFAULT'
           ELSE 'OTHER DEFAULT'
       END as sequence_status
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name
WHERE t.table_schema = 'public'
  AND t.table_name IN ('quiz_question', 'quiz', 'question_list', 'quiz_run', 'quiz_answer')
  AND c.column_name IN ('id')
ORDER BY t.table_name;

-- 5. Check current data counts
SELECT 'Data Counts' as check_type,
       'quiz_question' as table_name,
       COUNT(*) as record_count
FROM quiz_question
UNION ALL
SELECT 'Data Counts', 'quiz', COUNT(*) FROM quiz
UNION ALL
SELECT 'Data Counts', 'question_list', COUNT(*) FROM question_list
UNION ALL
SELECT 'Data Counts', 'quiz_run', COUNT(*) FROM quiz_run
UNION ALL
SELECT 'Data Counts', 'quiz_answer', COUNT(*) FROM quiz_answer;

-- 6. Check for any constraint violations
SELECT 'Constraints' as check_type,
       tc.table_name,
       tc.constraint_name,
       tc.constraint_type,
       kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_schema = 'public'
  AND tc.table_name IN ('quiz_question', 'quiz', 'question_list', 'quiz_run', 'quiz_answer')
ORDER BY tc.table_name, tc.constraint_name;

-- Quick schema check for the problematic tables
SELECT 'quiz table' as table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'quiz'
ORDER BY ordinal_position;

SELECT 'question_list table' as table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'question_list'
ORDER BY ordinal_position;

SELECT 'quiz_run table' as table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'quiz_run'
ORDER BY ordinal_position;

SELECT 'quiz_answer table' as table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'quiz_answer'
ORDER BY ordinal_position;
