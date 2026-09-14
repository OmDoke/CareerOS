# CareerOS - Backend Architecture

**Version:** 1.0.0

**Status:** Approved

**Owner:** Om Doke

---

# Purpose

This document defines the complete backend architecture for CareerOS.

The backend is responsible for:

- Authentication
- Resume Processing
- Study Plan Management
- AI Integration
- Question Generation
- Progress Tracking
- Telegram Notifications
- Background Jobs

Every backend module must follow this architecture.

---

# Technology Stack

Framework

- Express.js
- TypeScript

Database

- Prisma ORM
- SQLite (MVP)

Authentication

- JWT
- bcrypt

Validation

- Zod

Logging

- Pino

Scheduling

- node-cron

AI

- Gemini

Notifications

- Telegram Bot API

---

# High Level Architecture

```
               Client

                  │

             HTTP Request

                  │

             Express Router

                  │

            Authentication

                  │

             Validation

                  │

             Controller

                  │

              Service

         ┌────────┴────────┐
         │                 │
 Repository         External Services
         │                 │
      Prisma        Gemini / Telegram

                  │

              SQLite DB
```

---

# Layer Responsibilities

## Routes

Responsibilities

- Register endpoints
- Apply middleware
- Forward request

Must NOT

- Validate business rules
- Access database

---

## Controllers

Responsibilities

- Receive request
- Validate request
- Call service
- Return response

Must NOT

- Access Prisma
- Call Gemini
- Send Telegram
- Implement business logic

Maximum Size

150 lines

---

## Services

Responsibilities

- Business Logic
- AI orchestration
- Notification orchestration
- Database coordination

May Call

- Repository
- AI Service
- Notification Service

Must NOT

- Return Express Response
- Access req/res

---

## Repositories

Responsibilities

- Prisma Queries
- CRUD Operations
- Transactions

Must NOT

- Validate Requests
- Implement Business Logic

---

## Validators

Responsibilities

- Zod Schemas
- Input Validation

Every endpoint must have its own validation schema.

---

## Middlewares

Responsibilities

- Authentication
- Error Handling
- Logging
- Request Validation
- Rate Limiting

---

# Folder Structure

```
apps/api/src

config/

controllers/

database/

errors/

jobs/

middlewares/

notifications/

providers/

repositories/

routes/

services/

types/

utils/

validators/

index.ts
```

---

# Controllers

One controller per feature.

Example

```
auth.controller.ts

resume.controller.ts

study-plan.controller.ts

question.controller.ts

answer.controller.ts

review.controller.ts

telegram.controller.ts
```

---

# Services

```
auth.service.ts

resume.service.ts

study-plan.service.ts

question.service.ts

review.service.ts

telegram.service.ts

ai.service.ts
```

Services communicate with each other when required.

---

# Repository Pattern

Every repository manages only one entity.

Example

```
UserRepository

ResumeRepository

QuestionRepository

ReviewRepository
```

Repositories expose methods like

```
create()

findById()

findMany()

update()

delete()
```

---

# Request Lifecycle

```
Client

↓

Route

↓

Middleware

↓

Validator

↓

Controller

↓

Service

↓

Repository

↓

Prisma

↓

SQLite

↓

Repository

↓

Service

↓

Controller

↓

Client
```

---

# Error Handling

Application uses centralized error handling.

Error Types

- ValidationError
- UnauthorizedError
- ForbiddenError
- NotFoundError
- ConflictError
- InternalServerError

Unexpected errors are logged.

Users receive safe error messages.

---

# Logging

Use Pino.

Log

- API Requests
- API Responses
- Authentication
- Resume Upload
- AI Calls
- Scheduler Jobs
- Telegram Notifications
- Errors

Never Log

- Passwords
- JWT
- API Keys

---

# Configuration

Environment variables

```
PORT=

DATABASE_URL=

JWT_SECRET=

JWT_EXPIRES_IN=

GEMINI_API_KEY=

TELEGRAM_BOT_TOKEN=

LOG_LEVEL=
```

---

# Dependency Rules

Allowed

```
Controller

↓

Service

↓

Repository
```

Not Allowed

```
Controller

↓

Repository
```

Not Allowed

```
Repository

↓

Service
```

Dependencies must always flow downward.

---

# Database Access

All database operations must use Prisma.

Never use raw SQL unless absolutely necessary.

Use transactions for related operations.

---

# File Upload

Supported

- PDF Resume

Maximum Size

10 MB

Validation

- MIME Type
- File Size
- Virus Scan (Future)

Uploaded files are processed before database storage.

---

# Background Jobs

Jobs

- Generate Questions
- Weekly Report
- Notification Delivery
- Cleanup

Each job must be independent.

Failure in one job must not stop others.

---

# Notification Layer

Business modules never call Telegram directly.

Flow

```
Service

↓

NotificationService

↓

TelegramProvider
```

Future providers

- Email
- Push Notifications
- WhatsApp

---

# AI Integration

Business modules never call Gemini directly.

Flow

```
Service

↓

AIService

↓

GeminiProvider
```

Future providers

- OpenAI
- Claude

---

# Security

- JWT Authentication
- bcrypt Password Hashing
- Helmet
- CORS
- Zod Validation
- Rate Limiting
- Secure Headers
- Environment Variables

---

# Performance

- Use pagination.
- Avoid N+1 queries.
- Optimize Prisma queries.
- Cache expensive operations where appropriate.
- Keep controllers lightweight.
- Lazy load non-critical resources.

---

# Testing Strategy

Unit Tests

- Services
- Utilities
- Validators

Integration Tests

- API Endpoints
- Database

Future

End-to-End Tests

---

# Architecture Rules

- Thin Controllers
- Fat Services
- Repository Pattern
- One Responsibility Per File
- Dependency Flow Must Be One Direction
- No Business Logic In Controllers
- No Database Access Outside Repositories
- No AI Calls Outside AIService
- No Telegram Calls Outside NotificationService

---

# Acceptance Criteria

Backend architecture is complete when

- Every module follows the layered architecture.
- Controllers remain lightweight.
- Business logic exists only in services.
- Database access is isolated.
- AI and Telegram integrations are abstracted.
- Validation and logging are implemented consistently.
- The backend is modular, testable, and scalable.