# CareerOS - Database Design

**Version:** 1.0.0

**Status:** Draft

**Owner:** Om Doke

---

# Table of Contents

1. Database Overview
2. Design Principles
3. Business Domains
4. Entity Relationships
5. Database Tables
6. Common Fields
7. Enums
8. Index Strategy
9. Data Lifecycle
10. Future Migration

---

# 1. Database Overview

CareerOS stores all persistent application data inside SQLite for the MVP.

Prisma ORM is used as the data access layer.

The schema is designed so it can later migrate to PostgreSQL with minimal changes.

---

# 2. Design Principles

The database follows these principles.

- Normalized schema.
- UUID primary keys.
- Soft delete support.
- Audit fields.
- No duplicated information.
- Foreign key constraints.
- Future PostgreSQL compatibility.

---

# 3. Business Domains

The application consists of the following domains.

## User Domain

Responsible for

- Authentication
- Profile
- Settings

---

## Resume Domain

Responsible for

- Resume upload
- Resume metadata
- Extracted skills

---

## Study Domain

Responsible for

- Study plan
- Interview goal
- Preferred schedule

---

## Question Domain

Responsible for

- Question generation
- Difficulty
- Categories
- Revision

---

## Answer Domain

Responsible for

- User answers
- AI review
- Scores

---

## Notification Domain

Responsible for

- Telegram
- Daily reminders
- Weekly reports

---

## Analytics Domain

Responsible for

- Progress
- Accuracy
- Streak
- Statistics

---

# 4. Entity Relationship

```
User
 │
 ├── UserProfile
 │
 ├── Resume
 │      │
 │      └── ResumeSkill
 │
 ├── StudyPlan
 │
 ├── Question
 │      │
 │      └── UserAnswer
 │               │
 │               └── AIReview
 │
 ├── TelegramAccount
 │
 ├── Notification
 │
 └── Progress
```

---

# 5. Database Tables

## users

Stores authentication information.

Fields

- id
- email
- passwordHash
- status
- createdAt
- updatedAt

---

## user_profiles

Stores public profile.

Fields

- id
- userId
- fullName
- profileImage
- experienceYears
- targetRole

---

## resumes

Stores uploaded resume.

Fields

- id
- userId
- originalFile
- parsedJson
- uploadedAt

---

## resume_skills

Stores extracted skills.

Fields

- id
- resumeId
- skillName
- category
- confidence

---

## study_plans

Stores learning preferences.

Fields

- id
- userId
- dailyQuestions
- studyMinutes
- notificationTime
- interviewDate

---

## questions

Stores generated interview questions.

Fields

- id
- userId
- category
- difficulty
- question
- generatedBy
- generatedAt

---

## user_answers

Stores user responses.

Fields

- id
- questionId
- userId
- answer
- submittedAt

---

## ai_reviews

Stores Gemini feedback.

Fields

- id
- answerId
- score
- feedback
- weakTopics
- reviewedAt

---

## telegram_accounts

Stores Telegram integration.

Fields

- id
- userId
- telegramId
- username
- connectedAt

---

## notifications

Stores notification history.

Fields

- id
- userId
- type
- sentAt
- status

---

## progress

Stores learning analytics.

Fields

- id
- userId
- solvedQuestions
- averageScore
- streak
- totalStudyMinutes

---

# 6. Common Fields

Every table should include where applicable.

- id
- createdAt
- updatedAt
- deletedAt

Use soft delete instead of permanent deletion.

---

# 7. Enums

UserStatus

- ACTIVE
- INACTIVE

Difficulty

- EASY
- MEDIUM
- HARD

QuestionCategory

- DSA
- REACT
- NEXTJS
- NODE
- JAVA
- SQL
- HR

NotificationType

- DAILY
- REMINDER
- WEEKLY

NotificationStatus

- PENDING
- SENT
- FAILED

---

# 8. Index Strategy

Create indexes on

- email
- userId
- resumeId
- questionId
- telegramId
- interviewDate
- notificationTime
- category

Avoid unnecessary indexes during MVP.

---

# 9. Data Lifecycle

Resume

Upload

↓

Gemini Parsing

↓

Store JSON

↓

Extract Skills

↓

Generate Questions

↓

Track Progress

↓

Archive

---

# 10. Future Migration

SQLite

↓

PostgreSQL

↓

Redis Cache

↓

Object Storage

↓

Analytics Database

The schema should remain compatible with future scaling.

---

# Database Design Rules

- Never store duplicate skills.
- Never delete user history.
- Every question belongs to exactly one user.
- Every answer belongs to exactly one question.
- Every AI review belongs to exactly one answer.
- Every notification is logged.

---

# Approval

This document defines the canonical database model for CareerOS MVP.

The Prisma schema must be generated from this document and not the other way around.