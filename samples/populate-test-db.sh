#!/bin/bash

# Script to populate the PostgreSQL database with test data for Playwright tests
# This script connects to the database and runs the test-data.sql file

set -e  # Exit on any error

# Database connection parameters (matching your devcontainer config)
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-quizmaster}
DB_USER=${DB_USER:-quizmaster}
DB_PASS=${DB_PASS:-quizmaster}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}QuizMaster Test Database Population Script${NC}"
echo "=============================================="
echo ""

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo -e "${RED}Error: psql command not found. Please install PostgreSQL client.${NC}"
    exit 1
fi

# Check if the SQL file exists
SQL_FILE="$(dirname "$0")/test-data.sql"
DIAGNOSTIC_FILE="$(dirname "$0")/db-diagnostics.sql"
if [ ! -f "$SQL_FILE" ]; then
    echo -e "${RED}Error: SQL file not found at $SQL_FILE${NC}"
    exit 1
fi

echo -e "${YELLOW}Database Configuration:${NC}"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo "  SQL File: $SQL_FILE"
echo ""

# Test database connection
echo -e "${YELLOW}Testing database connection...${NC}"
if ! PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1;" > /dev/null 2>&1; then
    echo -e "${RED}Error: Cannot connect to database. Please check:${NC}"
    echo "  - Database is running"
    echo "  - Connection parameters are correct"
    echo "  - User has proper permissions"
    echo ""
    echo "You can test the connection manually with:"
    echo "  psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME"
    exit 1
fi

echo -e "${GREEN}Database connection successful!${NC}"
echo ""

# Run database diagnostics first
echo -e "${YELLOW}Running database diagnostics...${NC}"
if [ -f "$DIAGNOSTIC_FILE" ]; then
    echo "Running comprehensive database health check..."
    PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$DIAGNOSTIC_FILE"
    echo ""
else
    echo -e "${YELLOW}Diagnostic file not found, skipping diagnostics.${NC}"
fi

# Check if tables exist first
echo -e "${YELLOW}Checking database schema...${NC}"
TABLES_EXIST=$(PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('quiz_question', 'quiz', 'question_list');" 2>/dev/null | tr -d ' ' || echo "0")

if [ "$TABLES_EXIST" -eq 0 ]; then
    echo -e "${RED}Error: Required database tables do not exist.${NC}"
    echo "Please ensure the Spring Boot application has run at least once to create the database schema."
    echo "Or run the Flyway migrations manually."
    exit 1
fi

echo -e "${GREEN}Database schema found!${NC}"
echo ""

# Backup existing data (optional)
echo -e "${YELLOW}Checking for existing data...${NC}"
EXISTING_QUESTIONS=$(PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM quiz_question;" 2>/dev/null | tr -d ' ' || echo "0")

if [ "$EXISTING_QUESTIONS" -gt 0 ]; then
    echo -e "${YELLOW}Warning: Found $EXISTING_QUESTIONS existing questions in the database.${NC}"
    echo -e "${YELLOW}This script will overwrite existing test data.${NC}"
    echo ""
    read -p "Do you want to continue? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Operation cancelled.${NC}"
        exit 0
    fi
else
    echo -e "${GREEN}No existing questions found. Safe to proceed.${NC}"
fi

echo ""

# Run the SQL file
echo -e "${YELLOW}Populating database with test data...${NC}"
if PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$SQL_FILE"; then
    echo -e "${GREEN}Database populated successfully!${NC}"
else
    echo -e "${RED}Error: Failed to populate database.${NC}"
    echo "Check the error messages above for details."
    exit 1
fi

echo ""

# Verify the data was inserted
echo -e "${YELLOW}Verifying inserted data...${NC}"
QUESTION_COUNT=$(PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM quiz_question;" 2>/dev/null | tr -d ' ')
QUIZ_COUNT=$(PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM quiz;" 2>/dev/null | tr -d ' ')
ANSWER_COUNT=$(PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM quiz_answer;" 2>/dev/null | tr -d ' ')

echo -e "${GREEN}Data verification complete:${NC}"
echo "  Questions: $QUESTION_COUNT"
echo "  Quizzes: $QUIZ_COUNT"
echo "  Answers: $ANSWER_COUNT"
echo ""

# Show some sample data
echo -e "${YELLOW}Sample questions created:${NC}"
PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT id, question FROM quiz_question ORDER BY id LIMIT 5;"

echo ""
echo -e "${YELLOW}Sample quizzes created:${NC}"
PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT id, title, pass_score FROM quiz ORDER BY id;"

echo ""
echo -e "${GREEN}Test database population completed successfully!${NC}"
echo "Your Playwright tests should now have all the required data to run."
echo ""
echo -e "${YELLOW}Note:${NC} The database now contains test data with specific IDs (including negative ones)"
echo "as required by your test scenarios. This is not production-ready but perfect for testing."
