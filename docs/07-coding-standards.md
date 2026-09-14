# CareerOS - Coding Standards

**Version:** 1.0.0

**Status:** Approved

**Owner:** Om Doke

---

# Purpose

This document defines the official coding standards for CareerOS.

Every developer and AI coding assistant must follow these rules.

The goal is to produce a clean, consistent, maintainable, and scalable codebase.

---

# Core Principles

The project follows these principles.

- Simplicity
- Readability
- Maintainability
- Reusability
- Scalability
- Security
- Performance

Readable code is always preferred over clever code.

---

# General Rules

- Use TypeScript only.
- JavaScript is not allowed.
- Never use `any`.
- Avoid type assertions unless absolutely necessary.
- Enable strict mode.
- Keep functions small and focused.
- Every file should have a single responsibility.
- Prefer composition over inheritance.

---

# Naming Convention

## Files

Use kebab-case.

Examples

```
question.service.ts

resume.controller.ts

auth.middleware.ts
```

---

## React Components

Use PascalCase.

Examples

```
QuestionCard.tsx

DashboardHeader.tsx

ResumeUploader.tsx
```

---

## Variables

Use camelCase.

```
userProfile

questionScore

studyPlan
```

Avoid abbreviations.

Bad

```
usr

cnt

res
```

Good

```
user

questionCount

response
```

---

## Constants

Use UPPER_SNAKE_CASE.

```
MAX_QUESTIONS

DEFAULT_STUDY_TIME

JWT_EXPIRES_IN
```

---

## Interfaces

Use PascalCase.

```
User

Question

StudyPlan
```

Do not prefix with "I".

Bad

```
IUser
```

Good

```
User
```

---

## Enums

Use PascalCase.

```
UserStatus

QuestionDifficulty

NotificationType
```

---

# Folder Rules

One responsibility per folder.

Example

Controllers

↓

Only HTTP

Services

↓

Business Logic

Repositories

↓

Database

Validators

↓

Validation

Never mix responsibilities.

---

# Controller Rules

Controllers should

- Validate request
- Call service
- Return response

Controllers must never

- Access database
- Call Prisma
- Contain business logic
- Call Gemini directly

Maximum length

150 lines

---

# Service Rules

Services contain business logic.

Services may

- Call repositories
- Call AI service
- Call notification service

Services must not

- Return Express responses
- Access request or response objects

---

# Repository Rules

Repositories only communicate with Prisma.

Repositories

- Create
- Read
- Update
- Delete

Repositories must not

- Validate requests
- Contain business logic

---

# React Rules

Components should be presentational.

Business logic belongs inside

- hooks
- services

Avoid large components.

Maximum

300 lines

Split reusable UI into smaller components.

---

# API Rules

Every endpoint must

- Validate input
- Return typed responses
- Return consistent errors

Response format

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

Error format

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

---

# Validation

All validation must use

Zod

Never trust client-side validation.

Validate

- Request body
- Params
- Query
- Headers

---

# Error Handling

Never throw raw errors.

Use custom errors.

Examples

```
ValidationError

UnauthorizedError

ForbiddenError

NotFoundError

ConflictError
```

Log all unexpected errors.

---

# Logging

Use

Pino

Log

- Server start
- Login
- Logout
- Resume Upload
- AI Requests
- Scheduler
- Telegram
- Errors

Never log

- Passwords
- JWT
- API Keys
- Secrets

---

# Database Rules

Use Prisma.

Never write raw SQL unless necessary.

Always

- Use transactions when needed
- Use indexes efficiently
- Prevent N+1 queries

Do not duplicate data.

---

# Security Rules

Passwords

bcrypt

Authentication

JWT

Environment Variables

Never hardcode secrets.

Enable

- Rate Limiting
- Helmet
- CORS

Escape user input when necessary.

---

# AI Rules

All Gemini requests must go through

AIService

Prompt templates belong inside

packages/prompts

Never embed prompts inside controllers.

Cache expensive AI operations when possible.

Implement retry logic for temporary API failures.

---

# Telegram Rules

All notifications must pass through

NotificationService

Never call Telegram API directly from business modules.

Log every notification.

Retry failed notifications.

---

# Scheduler Rules

Each cron job must be independent.

One file

One job

Jobs must be idempotent.

If a job fails

- Log error
- Retry safely
- Continue processing other jobs

---

# Frontend Rules

Use

- React Hook Form
- TanStack Query
- Tailwind CSS
- shadcn/ui

Never call fetch directly from components.

Always use service files.

---

# Git Rules

Branch naming

```
feature/authentication

feature/question-engine

bugfix/login

hotfix/token-expiry
```

Commit messages

```
feat:

fix:

refactor:

docs:

style:

test:

chore:
```

Example

```
feat: implement JWT authentication

fix: resolve resume upload validation

docs: update API specification
```

---

# Code Review Checklist

Before merging

- No TypeScript errors
- No ESLint warnings
- No duplicated code
- Tests pass
- Documentation updated
- API documented
- Types defined
- No console.log
- No TODO left in production code

---

# Performance Guidelines

- Lazy load large pages
- Optimize images
- Avoid unnecessary re-renders
- Cache expensive operations
- Use pagination
- Minimize API requests

---

# Documentation Rules

Every new feature must include

- Documentation
- API updates
- Types
- Tests
- Changelog entry

---

# AI Development Rules

AI-generated code must

- Follow folder structure
- Follow naming conventions
- Use existing utilities
- Reuse components
- Avoid duplicate implementations
- Pass TypeScript strict mode
- Follow SOLID principles

---

# Acceptance Criteria

Code is considered production-ready when

- It follows all standards in this document.
- It passes linting and type checking.
- It is documented.
- It is testable.
- It is maintainable.
- It introduces no duplicated logic.
- It follows the established architecture.