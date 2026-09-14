# CareerOS - Frontend Architecture

**Version:** 1.0.0

**Status:** Approved

**Owner:** Om Doke

---

# Purpose

This document defines the frontend architecture for CareerOS.

The frontend is responsible for:

- User Authentication
- Resume Upload
- Study Plan Management
- Daily Questions
- Answer Submission
- Progress Dashboard
- Telegram Integration
- User Settings

The application must be modular, scalable, and maintainable.

---

# Technology Stack

Framework

- Next.js 15
- React 19
- TypeScript

Styling

- Tailwind CSS
- shadcn/ui

Forms

- React Hook Form
- Zod

Data Fetching

- TanStack Query

State Management

- Zustand

Icons

- Lucide React

Charts

- Recharts

Theme

- next-themes

---

# Application Structure

```
apps/web/

src/

app/

components/

features/

hooks/

layouts/

lib/

providers/

services/

store/

styles/

types/

utils/
```

---

# App Router

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

loading.tsx

error.tsx

not-found.tsx
```

Every route must use the App Router.

---

# Feature-Based Architecture

Each feature owns its components.

Example

```
features/

auth/

resume/

study-plan/

question/

review/

progress/

telegram/

settings/
```

Each feature contains

```
components/

hooks/

schemas/

types/

services/
```

---

# Component Architecture

Component hierarchy

```
Page

↓

Feature Component

↓

Shared Component

↓

Primitive UI Component
```

Example

```
DashboardPage

↓

DashboardOverview

↓

ProgressCard

↓

Card
```

---

# Shared Components

```
Button

Input

Textarea

Select

Card

Dialog

Modal

Toast

Badge

Avatar

Table

Tabs

Skeleton

Loader

Pagination
```

Reusable components belong in

```
packages/ui
```

---

# Layout Structure

Root Layout

```
Theme

↓

Providers

↓

Authentication

↓

Application Layout
```

Dashboard Layout

```
Sidebar

Top Navigation

Main Content

Footer
```

---

# State Management

## Local State

Use

```
useState
```

---

## Global State

Use

```
Zustand
```

Store only

- User
- Theme
- Sidebar
- Session

Do not store API data globally.

---

# Server State

Use

```
TanStack Query
```

Responsibilities

- Fetch
- Cache
- Retry
- Invalidate

Never fetch inside components using fetch().

---

# API Layer

Every API call goes through

```
services/
```

Example

```
auth.service.ts

resume.service.ts

question.service.ts

progress.service.ts
```

Components must never call APIs directly.

---

# Forms

All forms use

```
React Hook Form
```

Validation

```
Zod
```

Forms

- Login
- Register
- Resume Upload
- Study Plan
- Settings

---

# Error Handling

Every page should support

- Loading
- Empty
- Error

Example

```
loading.tsx

error.tsx

not-found.tsx
```

Use toast notifications for recoverable errors.

---

# Authentication Flow

```
Login

↓

Receive JWT

↓

Store Token

↓

Protected Routes

↓

Logout

↓

Clear Session
```

---

# Route Protection

Public

```
/

login

register
```

Protected

```
dashboard

resume

study-plan

questions

progress

settings
```

Unauthenticated users are redirected to Login.

---

# File Upload

Resume upload flow

```
Select PDF

↓

Validate

↓

Upload

↓

Progress

↓

Analysis

↓

Results
```

Supported

- PDF

Maximum Size

10 MB

---

# Data Flow

```
Page

↓

Feature Hook

↓

Service

↓

Backend API

↓

Response

↓

TanStack Query Cache

↓

UI
```

---

# Theme

Dark Mode

Default

Support

- Dark
- Light
- System

Use

```
next-themes
```

---

# Responsive Design

Desktop

>=1024px

Tablet

768px -1023px

Mobile

<768px

Every page must be responsive.

---

# Performance

- Lazy load heavy components.
- Use dynamic imports where appropriate.
- Optimize images.
- Minimize re-renders.
- Memoize expensive calculations.
- Paginate large lists.

---

# Accessibility

Support

- Keyboard Navigation
- Screen Readers
- Focus States
- ARIA Labels
- Color Contrast

Forms must have associated labels.

---

# Folder Responsibilities

```
app/

Routing

features/

Business UI

components/

Reusable UI

hooks/

Reusable Logic

services/

API Layer

store/

Global State

types/

TypeScript Types

utils/

Helper Functions

providers/

Context Providers
```

---

# Naming Rules

Components

```
PascalCase
```

Example

```
QuestionCard.tsx

ResumeUploader.tsx
```

Hooks

```
useQuestion.ts

useResume.ts
```

Services

```
question.service.ts

auth.service.ts
```

---

# Architecture Rules

- Use Server Components where possible.
- Use Client Components only when necessary.
- Keep components small.
- Separate UI from business logic.
- Reuse shared components.
- Keep API logic in services.
- Validate all forms.
- Never duplicate UI components.

---

# Testing Strategy

Unit Tests

- Components
- Hooks
- Utilities

Integration Tests

- Feature Flows
- Forms

Future

End-to-End Tests

---

# Acceptance Criteria

The frontend architecture is complete when

- Feature-based structure is followed.
- Components are reusable.
- Forms are validated.
- API calls use services.
- TanStack Query manages server state.
- Zustand manages global UI state.
- The application is responsive and accessible.