# CareerOS - Scheduler Architecture

**Version:** 1.0.0

**Status:** Approved

**Owner:** Om Doke

---

# Purpose

This document defines the scheduler architecture for CareerOS.

The scheduler automates recurring tasks without requiring user interaction.

Responsibilities include:

- Daily Question Generation
- Telegram Notifications
- Revision Scheduling
- Weekly Reports
- Data Cleanup
- System Health Checks

The scheduler must run reliably even if the web application is not actively being used.

---

# Technology

Scheduler

- node-cron

Runtime

- Node.js

Notification

- Telegram Bot API

Database

- Prisma

---

# Architecture

```
Node Cron

↓

Scheduler

↓

Job Manager

↓

Individual Jobs

↓

Services

↓

Repositories

↓

Database

↓

Telegram
```

Every scheduled task is an independent job.

One job must never directly execute another job.

---

# Folder Structure

```
apps/api/src/jobs/

daily-question.job.ts

daily-reminder.job.ts

revision.job.ts

weekly-report.job.ts

cleanup.job.ts

health-check.job.ts

job-manager.ts

scheduler.ts
```

---

# Scheduler Startup

The scheduler starts automatically when the backend starts.

```
Backend

↓

Initialize Database

↓

Initialize Services

↓

Register Jobs

↓

Start Scheduler

↓

Wait for Cron Events
```

---

# Job Rules

Every job must

- Have one responsibility
- Be idempotent
- Log execution
- Catch errors
- Continue if another job fails

---

# Daily Question Job

Purpose

Generate interview questions for users.

Schedule

```
Every Day
02:00 AM
```

Flow

```
Find Active Users

↓

Load Study Plan

↓

Generate AI Questions

↓

Store Database

↓

Mark Ready
```

---

# Daily Reminder Job

Purpose

Notify users about pending questions.

Schedule

```
Every Day
08:00 AM
```

Flow

```
Find Today's Questions

↓

Check Completion

↓

Send Telegram Reminder

↓

Log Delivery
```

Do not send reminders if all questions are completed.

---

# Revision Job

Purpose

Generate revision questions for weak topics.

Schedule

```
Every Day
01:00 PM
```

Flow

```
Find Weak Topics

↓

Generate Revision Question

↓

Save Question

↓

Notify User
```

---

# Weekly Report Job

Purpose

Generate a weekly learning summary.

Schedule

```
Every Sunday
08:00 PM
```

Flow

```
Calculate Statistics

↓

Generate AI Summary

↓

Store Report

↓

Send Telegram Report
```

Statistics include

- Questions Solved
- Average Score
- Current Streak
- Strong Topics
- Weak Topics
- Completion Rate

---

# Cleanup Job

Purpose

Maintain database health.

Schedule

```
Every Sunday
03:00 AM
```

Tasks

- Delete expired tokens
- Remove expired verification codes
- Archive old logs
- Remove temporary files

Never delete user progress.

---

# Health Check Job

Purpose

Verify scheduler health.

Schedule

```
Every Hour
```

Checks

- Database Connection
- Telegram Connectivity
- AI Provider Availability
- Disk Space
- Memory Usage

Failures are logged.

---

# Notification Flow

```
Scheduler

↓

NotificationService

↓

TelegramProvider

↓

Telegram API

↓

User
```

The scheduler must never call Telegram directly.

---

# AI Flow

```
Scheduler

↓

AIService

↓

Gemini Provider

↓

Response

↓

Database
```

The scheduler must never call Gemini directly.

---

# Retry Strategy

If a job fails

Attempt 1

Retry immediately.

Attempt 2

Retry after

```
5 Minutes
```

Attempt 3

Retry after

```
30 Minutes
```

After three failures

- Mark Failed
- Log Error
- Continue Other Jobs

---

# Logging

Every job logs

- Job Name
- Start Time
- End Time
- Duration
- Success
- Failure
- Retry Count

Example

```
DailyQuestionJob

Started

02:00:01

Completed

02:00:12

Duration

11 Seconds
```

---

# Monitoring

Track

- Successful Jobs
- Failed Jobs
- Average Runtime
- Retry Count
- Notification Delivery Rate

Future

Admin dashboard for scheduler metrics.

---

# Configuration

Environment Variables

```
ENABLE_SCHEDULER=true

TIMEZONE=Asia/Kolkata

MAX_JOB_RETRIES=3

JOB_TIMEOUT=60000
```

---

# Performance Rules

- Process users in batches.
- Avoid loading all users into memory.
- Reuse database connections.
- Minimize AI requests.
- Skip inactive users.
- Cache repeated calculations where possible.

---

# Failure Recovery

If the backend restarts

```
Restart Backend

↓

Register Scheduler

↓

Resume Future Jobs
```

Missed jobs are not automatically replayed in the MVP.

Future versions may support catch-up execution.

---

# Future Jobs

- Company Interview Reminder
- Resume Re-analysis
- Monthly Performance Report
- Daily Coding Challenge
- ATS Score Refresh
- Skill Gap Analysis
- AI Motivation Summary

---

# Job Schedule

| Job | Frequency | Time |
|------|-----------|------|
| Daily Question | Daily | 02:00 |
| Daily Reminder | Daily | 08:00 |
| Revision | Daily | 13:00 |
| Weekly Report | Sunday | 20:00 |
| Cleanup | Sunday | 03:00 |
| Health Check | Hourly | Every Hour |

---

# Architecture Rules

- One file = One job.
- Jobs communicate only through services.
- Jobs never access Prisma directly.
- Jobs never call Telegram directly.
- Jobs never call Gemini directly.
- Jobs must be idempotent.
- Jobs must never block other jobs.
- All failures must be logged.

---

# Acceptance Criteria

The scheduler is complete when

- All scheduled jobs execute automatically.
- Jobs run independently.
- Failures are retried safely.
- Notifications are delivered.
- Weekly reports are generated.
- Health checks execute hourly.
- Cleanup jobs maintain the system.
- Scheduler logs provide complete execution history.