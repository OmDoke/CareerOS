# Architecture Rules

## Overall Architecture

Frontend

↓

Backend API

↓

Services

↓

Repositories

↓

Prisma

↓

SQLite

---

## Backend

Route

↓

Controller

↓

Service

↓

Repository

↓

Database

Controllers never access Prisma directly.

Repositories never contain business logic.

---

## Frontend

Page

↓

Feature

↓

Shared Component

↓

UI Component

API calls belong only in services.

---

## AI

Business modules never call Gemini directly.

Use

AIService

↓

Gemini Provider

---

## Telegram

Business modules never call Telegram directly.

Use

NotificationService

↓

Telegram Provider

---

## Scheduler

Jobs

↓

Services

↓

Repositories

Each job has one responsibility.

---

## Feature Structure

Every feature should include

- API
- Validation
- Database
- UI
- Tests

---

## Dependency Rules

Allowed

Controller

↓

Service

↓

Repository

Not Allowed

Controller

↓

Repository

Repository

↓

Service

Dependencies must always flow downward.