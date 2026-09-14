# CareerOS - Telegram Bot Architecture

**Version:** 1.0.0

**Status:** Approved

**Owner:** Om Doke

---

# Purpose

This document defines the Telegram Bot architecture for CareerOS.

Telegram is the only notification channel used in the MVP.

The bot is responsible for:

- Account Linking
- Daily Question Notifications
- Study Reminders
- Weekly Progress Reports
- Quick Commands
- Notification Delivery

---

# Goals

The Telegram Bot should

- Deliver notifications reliably.
- Require minimal user interaction.
- Never expose private data.
- Work independently of the web application.
- Be easy to extend with new commands.

---

# Technology

Bot API

```
Telegram Bot API
```

Node Library

```
node-telegram-bot-api
```

---

# Architecture

```
User

↓

Telegram Bot

↓

Webhook / Polling

↓

Telegram Service

↓

Notification Service

↓

Backend Services

↓

Database
```

Business modules must never communicate with Telegram directly.

---

# Folder Structure

```
apps/api/src/

telegram/

bot.ts

handlers/

commands/

messages/

services/

providers/

utils/
```

---

# Module Responsibilities

## bot.ts

- Initialize Bot
- Register Commands
- Start Bot
- Register Handlers

---

## commands/

Handles

```
/start

/help

/today

/progress

/settings

/status
```

Each command has its own file.

Example

```
today.command.ts

progress.command.ts

help.command.ts
```

---

## handlers/

Handles

- Incoming Messages
- Callback Queries
- Errors

---

## services/

Contains business logic.

Examples

```
telegram.service.ts

notification.service.ts
```

---

## messages/

Stores reusable message templates.

Examples

```
daily-question.ts

weekly-report.ts

reminder.ts
```

---

# Account Linking

Flow

```
Dashboard

↓

Click Connect Telegram

↓

Generate One-Time Token

↓

User Opens Telegram

↓

User Sends Token

↓

Backend Verifies

↓

Store Telegram Chat ID

↓

Account Linked
```

A token

- expires after 10 minutes
- can only be used once

---

# Supported Commands

## /start

Initial bot setup.

Response

- Welcome Message
- Connection Status

---

## /help

Shows available commands.

---

## /today

Displays today's interview question.

---

## /progress

Displays

- Current Streak
- Average Score
- Questions Solved
- Weak Topics

---

## /settings

Shows notification settings.

---

## /status

Displays

- Telegram Connected
- Last Notification
- Scheduler Status

---

# Notification Types

Daily Question

```
08:00
```

Study Reminder

```
19:00
```

Weekly Report

```
Sunday 20:00
```

System Notification

Examples

- Resume Analysis Complete
- Telegram Connected
- Account Updated

---

# Daily Question Template

```
📚 CareerOS

Today's Question

Category:
Difficulty:
Estimated Time:

<Question>

Open Dashboard to submit your answer.

Good luck!
```

---

# Reminder Template

```
⏰ Reminder

You still have unanswered interview questions today.

Keep your learning streak alive.
```

---

# Weekly Report Template

```
📈 Weekly Report

Questions Solved

Average Score

Current Streak

Strong Topics

Weak Topics

Keep improving!
```

---

# Error Messages

Examples

```
Telegram not linked.

Question not generated yet.

No progress available.

Server temporarily unavailable.
```

Never expose internal server errors.

---

# Retry Strategy

If message delivery fails

Attempt

```
Retry 3 Times
```

Retry Delay

```
30 Seconds
```

After final failure

- Log Error
- Mark Notification Failed

---

# Logging

Log

- Account Linking
- Commands
- Notifications
- Delivery Success
- Delivery Failure

Never log

- JWT
- Passwords
- API Keys

---

# Database

Store

Telegram Account

- User ID
- Chat ID
- Username
- Connected At

Notification History

- Type
- Status
- Sent At
- Retry Count

---

# Security

- One-time connection token
- Token expiration
- Verify chat ownership
- No sensitive information in messages
- Escape Markdown when required

---

# Future Features

- Interactive Buttons
- Daily Quiz
- Inline Keyboard
- Company-Specific Alerts
- Voice Notifications
- Multi-language Support

---

# Architecture Rules

- One command per file.
- Commands call services only.
- Services never call Telegram directly.
- NotificationService owns message delivery.
- Message templates remain separate from business logic.

---

# Acceptance Criteria

The Telegram Bot is complete when

- Users can connect accounts.
- Commands work correctly.
- Daily notifications are delivered.
- Weekly reports are delivered.
- Failed messages are retried.
- All activity is logged.
- Message templates are reusable.