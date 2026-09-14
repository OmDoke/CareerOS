# CareerOS - Folder Structure

**Version:** 1.0.0

**Status:** Draft

**Owner:** Om Doke

---

# Purpose

This document defines the official folder structure for the CareerOS project.

Every file created during development must follow this structure.

Developers and AI coding assistants must not create new folders unless they are approved in this document.

---

# Repository Structure

```
career-os/

├── apps/
│
├── packages/
│
├── prisma/
│
├── docs/
│
├── scripts/
│
├── .github/
│
├── .ai/
│
├── package.json
├── turbo.json
├── tsconfig.json
├── README.md
└── LICENSE
```

---

# apps/

Contains runnable applications.

```
apps/

web/

api/
```

---

# apps/web

Frontend application built with Next.js.

```
apps/web/

src/

app/

components/

hooks/

services/

lib/

store/

styles/

types/

utils/

assets/

public/
```

---

# app/

Contains App Router pages.

```
app/

(auth)/

dashboard/

resume/

study-plan/

questions/

progress/

settings/

layout.tsx

page.tsx
```

---

# components/

Reusable UI components.

```
components/

common/

layout/

forms/

cards/

charts/

dashboard/

resume/

study-plan/

question/

progress/

telegram/
```

Rules

- Reusable only
- No business logic
- Feature-based organization

---

# hooks/

Reusable React hooks.

Examples

```
useAuth()

useUser()

useQuestion()

useStudyPlan()

useTelegram()
```

---

# services/

Frontend API layer.

Examples

```
auth.service.ts

resume.service.ts

question.service.ts

review.service.ts

telegram.service.ts
```

No direct fetch calls inside components.

---

# lib/

Application helpers.

Examples

```
api.ts

axios.ts

constants.ts

validators.ts

date.ts

storage.ts
```

---

# store/

Global state.

Examples

```
auth.store.ts

theme.store.ts

question.store.ts
```

---

# styles/

Global styles.

```
globals.css

theme.css
```

---

# types/

Frontend TypeScript types.

```
user.ts

question.ts

resume.ts

review.ts
```

---

# utils/

Utility functions.

Examples

```
formatDate()

calculateProgress()

capitalize()

truncate()
```

---

# apps/api

Backend application.

```
apps/api/

src/
```

---

# src/

```
config/

controllers/

services/

repositories/

routes/

middlewares/

validators/

jobs/

notifications/

database/

utils/

types/

errors/
```

---

# controllers/

Handle HTTP requests.

Responsibilities

- Receive Request
- Validate Input
- Call Service
- Return Response

Controllers must never contain business logic.

---

# services/

Contains business logic.

Examples

```
AuthService

ResumeService

QuestionService

ReviewService

TelegramService
```

Services may call repositories and other services.

---

# repositories/

Database access only.

Responsibilities

- Prisma queries
- CRUD operations

No business logic.

---

# routes/

Express routes.

One route file per feature.

Examples

```
auth.routes.ts

resume.routes.ts

question.routes.ts
```

---

# middlewares/

Express middleware.

Examples

```
auth.middleware.ts

error.middleware.ts

logger.middleware.ts
```

---

# validators/

Request validation.

Use Zod.

Examples

```
login.schema.ts

register.schema.ts

resume.schema.ts
```

---

# jobs/

Cron jobs.

Examples

```
daily-question.job.ts

weekly-report.job.ts

cleanup.job.ts
```

---

# notifications/

Notification providers.

```
telegram.provider.ts

notification.service.ts
```

---

# database/

Prisma configuration.

```
client.ts

seed.ts
```

---

# errors/

Custom application errors.

Examples

```
AppError

ValidationError

AuthenticationError

NotFoundError
```

---

# packages/

Reusable shared packages.

```
packages/

shared/

types/

prompts/

ui/
```

---

# packages/shared

Reusable helpers.

```
constants/

helpers/

utils/
```

---

# packages/types

Shared TypeScript types.

```
User

Question

Review

Resume
```

---

# packages/prompts

Gemini prompt templates.

```
resume-analysis.md

question-generation.md

answer-review.md

study-plan.md

weekly-report.md
```

Application code must never contain large AI prompts.

---

# packages/ui

Reusable UI library.

Examples

```
Button

Input

Card

Modal

Dialog

Badge

Toast

Skeleton
```

---

# prisma/

Database configuration.

```
schema.prisma

migrations/

seed.ts
```

---

# docs/

Project documentation.

Contains every architecture document.

No implementation code.

---

# scripts/

Automation scripts.

Examples

```
setup.sh

build.sh

deploy.sh

dev.sh
```

---

# .github/

GitHub configuration.

```
ISSUE_TEMPLATE/

workflows/

PULL_REQUEST_TEMPLATE.md
```

---

# .ai/

AI development guidelines.

```
project-context.md

coding-rules.md

architecture.md

prompt-guidelines.md

antigravity-rules.md
```

---

# Naming Convention

Folders

```
lowercase

kebab-case
```

Files

```
feature-name.ts

question.service.ts

review.controller.ts
```

React Components

```
PascalCase

QuestionCard.tsx

ProgressChart.tsx
```

Hooks

```
useQuestion.ts

useAuth.ts
```

Types

```
User.ts

Question.ts
```

---

# Architecture Rules

- One responsibility per folder.
- Feature-first organization.
- No duplicate utilities.
- Shared code belongs in packages/.
- Controllers never contain business logic.
- Components never call the database.
- Components never contain API logic.
- Services own business logic.
- Repositories own database access.
- AI prompts belong only in packages/prompts.

---

# Acceptance Criteria

The project structure is considered complete when:

- Every file follows the folder structure defined in this document.
- No duplicate folders exist.
- Every module has a single responsibility.
- New features follow the same architecture without modification.