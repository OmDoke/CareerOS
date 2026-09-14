# CareerOS - System Architecture

**Version:** 1.0.0

**Status:** Draft

**Owner:** Om Doke

---

# Table of Contents

1. Architecture Overview
2. High-Level Architecture
3. Technology Stack
4. System Components
5. Application Layers
6. Data Flow
7. AI Architecture
8. Telegram Architecture
9. Scheduler Architecture
10. Deployment Architecture
11. Security Architecture
12. Future Scalability

---

# 1. Architecture Overview

CareerOS follows a modular monorepo architecture.

Every feature is isolated into its own module.

Business logic must never be tightly coupled.

The system is designed to run:

Frontend

→ Vercel

Backend

→ Galaxy A10 Server

Database

→ SQLite

Notifications

→ Telegram Bot

AI

→ Gemini

---

# 2. High-Level Architecture

```
                    User
                      │
                      │
               HTTPS Requests
                      │
                      ▼
            Next.js Frontend (Vercel)
                      │
                 REST API
                      │
                      ▼
           Express Backend (Galaxy A10)
                      │
     ┌────────────────┼────────────────┐
     │                │                │
 Authentication   Question Engine   Scheduler
     │                │                │
     └────────────────┼────────────────┘
                      │
               Prisma ORM
                      │
                  SQLite DB
                      │
     ┌────────────────┼────────────────┐
     │                │                │
 Gemini AI      Telegram Bot      PM2
```

---

# 3. Technology Stack

## Frontend

- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- TanStack Query
- Zod

---

## Backend

- Express.js
- TypeScript
- Prisma
- SQLite
- JWT
- node-cron
- Pino

---

## AI

Gemini API

Future

- OpenAI
- Claude

---

## Notification

Telegram Bot API

Only notification service for MVP.

---

## Deployment

Frontend

Vercel

Backend

Galaxy A10

Process Manager

PM2

Public Access

Cloudflare Tunnel

---

# 4. System Components

The system contains the following modules.

## Authentication Module

Responsible for

- Login
- Register
- JWT
- Profile

---

## Resume Module

Responsible for

- Resume Upload
- Resume Parsing
- Skill Extraction

---

## Study Plan Module

Responsible for

- Study Preferences
- Daily Question Count
- Interview Date
- Target Role

---

## Question Engine

Responsible for

- AI Question Generation
- Difficulty Selection
- Revision
- Duplicate Prevention

---

## Answer Review

Responsible for

- AI Review
- Score
- Feedback
- Weak Topics

---

## Dashboard

Responsible for

- Analytics
- Progress
- Accuracy
- Streak

---

## Telegram Module

Responsible for

- Commands
- Daily Notifications
- Reminder Notifications
- Weekly Report

---

## Scheduler

Responsible for

- Night Jobs
- Morning Notifications
- Weekly Reports
- Retry Failed Jobs

---

# 5. Application Layers

CareerOS follows a layered architecture.

```
Presentation Layer

↓

API Layer

↓

Controller Layer

↓

Service Layer

↓

Repository Layer

↓

Database
```

Responsibilities

Presentation

Only UI

API

Routes

Controller

Validate Request

Service

Business Logic

Repository

Database Queries

Database

Persistent Storage

Controllers must never contain business logic.

---

# 6. Data Flow

Daily Question Generation

```
Scheduler

↓

Load User

↓

Load Resume

↓

Load Study Plan

↓

Load Previous Progress

↓

Gemini

↓

Generate Questions

↓

Save Database

↓

Telegram Notification
```

---

# 7. AI Architecture

Every AI request must pass through a single service.

```
Controller

↓

AIService

↓

Gemini

↓

Response

↓

Database
```

Rules

Never call Gemini directly from Controllers.

Never call Gemini directly from Routes.

All prompts are stored in

/packages/prompts

---

# 8. Telegram Architecture

```
Scheduler

↓

Notification Service

↓

Telegram Service

↓

Telegram API

↓

User
```

Supported Commands

- /today
- /next
- /progress
- /streak
- /help

Notification Types

- Morning Question
- Reminder
- Weekly Report

---

# 9. Scheduler Architecture

Jobs

Night

23:30

Generate Tomorrow Questions

Morning

08:00

Send Question

Evening

19:00

Reminder

Sunday

20:00

Weekly Report

Future jobs must be added as independent cron tasks.

---

# 10. Deployment Architecture

Frontend

```
GitHub

↓

Vercel

↓

Production
```

Backend

```
GitHub

↓

Galaxy A10

↓

git pull

↓

PM2 Restart

↓

Production
```

---

# 11. Security Architecture

Authentication

JWT

Password

bcrypt

Validation

Zod

Logging

Pino

Rate Limiting

Future

Helmet

CORS

Request Limits

Audit Logs

---

# 12. Folder Responsibilities

apps/web

User Interface

apps/api

Backend API

packages/shared

Shared Utilities

packages/types

Shared Types

packages/prompts

AI Prompts

packages/ui

Reusable UI Components

docs

Documentation

features

Feature Specifications

---

# 13. Design Principles

- Feature-first architecture.
- Thin controllers.
- Business logic only inside services.
- Repository pattern.
- Reusable modules.
- Shared TypeScript types.
- No duplicated code.
- AI isolated behind AIService.
- Telegram isolated behind NotificationService.

---

# 14. Scalability Strategy

Current

SQLite

↓

Future

PostgreSQL

Current

Single Galaxy A10

↓

Future

Cloud VPS

Current

Single Gemini Provider

↓

Future

Multiple AI Providers

The application architecture must allow these upgrades without major code rewrites.

---

# Architecture Approval

This document defines the official system architecture for CareerOS MVP.

All future implementation must follow this architecture.