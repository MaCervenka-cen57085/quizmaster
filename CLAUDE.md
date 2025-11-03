# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Quizmaster is a training application for Scrum workshops at ScrumDojo.cz. Core features:
- Create and manage questions, workspaces, and quizzes
- Take standalone questions or complete quizzes
- Track quiz performance (times taken/finished, average scores)

Built incrementally using thin slices of functionality—a key learning objective of the Scrum training.

## Architecture

**Monorepo with frontend built into backend:**
- Frontend: React 19 SPA (Vite) → builds to `backend/src/main/resources/static/`
- Backend: Spring Boot 3 serves frontend at `/` and REST APIs at `/api/*`
- Database: PostgreSQL (JPA/Hibernate + Flyway migrations)
- Deployment: Single JAR containing both frontend and backend

**Key insight:** Frontend must be built with `pnpm build` before running backend to see changes.

## Tech Stack

- **Backend:** Java 21, Spring Boot 3.3.3, Gradle (Kotlin DSL), Lombok
- **Frontend:** TypeScript 5.7, React 19, Vite 6, Biome (linting), Cucumber + Playwright (E2E)
- **Database:** PostgreSQL
- **Swagger UI:** http://localhost:8080/swagger-ui/index.html

## Development Commands

**Setup:**
```bash
cd frontend && pnpm ci:install
```

**Running (choose one):**
```bash
# Production-like: frontend → backend
cd frontend && pnpm build && cd ../backend && ./gradlew bootRun  # :8080

# Development with HMR (recommended):
cd backend && ./gradlew bootRun     # :8080 backend
cd frontend && pnpm dev             # :5173 dev server (proxies API to :8080)
```

**Testing:**
```bash
cd frontend
pnpm code              # TypeScript + Biome lint/format
pnpm test:e2e          # E2E against :8080
pnpm test:e2e:vite     # E2E against :5173
pnpm test:e2e:ui       # Playwright UI at :3333
```

## Domain Model

**Three entities:**
1. **QuizQuestion** - Question text, multiple answers, correct answer indices, explanations
2. **Workspace** - Collection of questions and quizzes (identified by GUID/UUID)
3. **Quiz** - Assessment config: title, question IDs array, pass score, time limit, `mode` (EXAM/LEARNING), statistics

**Key concepts:**
- **`mode` field**: `EXAM` = exam mode (feedback at end), `LEARNING` = learning mode (feedback after each question)
- **`size` field**: Limits quiz to N random questions from larger pool (may be unfinished feature)
- **No authentication**: Questions use encrypted/hashed IDs for edit URLs to prevent unauthorized editing
- **Standalone questions**: Original feature; users can take individual questions outside quizzes

## API Endpoints

**Quiz Management:**
- `GET /api/quiz/{id}` - Get quiz with all questions
- `POST /api/quiz` - Create quiz with question IDs array
- `PUT /api/quiz/{id}/start` - Increment `timesTaken` counter
- `PUT /api/quiz/{id}/evaluate` - Submit score, update `timesFinished` and `averageScore`
- `GET /api/quiz/by-workspace/{guid}` - Find quizzes in a workspace

**Question Management:**
- `GET /api/quiz-question/{id}` - Get question (with `deletable` flag)
- `POST /api/quiz-question` - Create question, returns ID and hash
- `PATCH /api/quiz-question/{hash}` - Update question by hash
- `DELETE /api/quiz-question/{id}` - Delete if not used in any quiz
- `GET /api/quiz-question/{hash}/edit` - Get question by hash for editing
- `GET /api/quiz-question/by-workspace/{guid}` - Get questions in a workspace

**Workspace Management:**
- `GET /api/workspace/{guid}` - Get workspace
- `POST /api/workspace` - Create workspace, returns GUID

**Quiz-Taking Workflow:**
1. Frontend loads quiz via `GET /api/quiz/{id}` (shows welcome page)
2. User starts → `PUT /api/quiz/{id}/start` (increments counter)
3. User answers questions
4. User finishes → `PUT /api/quiz/{id}/evaluate` (updates statistics)

## Frontend Routes

- `/` - Home (question/quiz creation)
- `/question/new` - Create question
- `/question/:id` - Take standalone question
- `/question/:id/edit` - Edit question (uses hash)
- `/workspace/new` - Create workspace
- `/workspace/:id` - View workspace (questions and quizzes)
- `/quiz-create/new` - Create quiz
- `/quiz/:id` - Quiz welcome/info page
- `/quiz/:id/questions` - Take quiz
- `/quiz/:id/stats` - Quiz statistics

## Feature Flags

Hide unfinished features behind `FEATURE_FLAG=true` env var:

```typescript
// Frontend
if (FEATURE_FLAG_ENABLED) { /* ... */ }
```

```java
// Backend
if (FeatureFlag.isEnabled()) { /* ... */ }
```

```gherkin
# Tests
@feature-flag
Scenario: New feature
```

## Development Practices

Training repository emphasizing:
- **Trunk-Based Development** - All work on `master`
- **Test-Driven Development** - Tests first
- **Pair/Mob Programming** - Shared ownership
- **Thin slices** - Minimal incremental features

## Known Technical Debt / Future Improvements

1. **Replace encrypted question IDs** → Simple UUIDs (encryption is excessive)
2. **Quiz-Question relationship** → Refactor int array to M:N junction table with referential integrity
3. **Progress state endpoint** → May not be optimal implementation
4. **Standalone questions** → Consider deprecation (kept for backward compatibility)
