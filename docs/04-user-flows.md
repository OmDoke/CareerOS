# CareerOS - User Flow Specification

**Version:** 1.0.0

**Status:** Draft

**Owner:** Om Doke

---

# Purpose

This document defines every major user journey in CareerOS.

Before implementing APIs or UI, every interaction between the user and the system must be documented.

---

# Primary User Flow

```
Register

↓

Login

↓

Complete Profile

↓

Upload Resume

↓

Review Extracted Skills

↓

Create Study Plan

↓

Connect Telegram

↓

Dashboard

↓

Receive Daily Question

↓

Answer Question

↓

AI Review

↓

Progress Dashboard

↓

Repeat Daily
```

---

# Flow 1 - User Registration

Goal

Create a new account.

Steps

1. Open Sign Up page.

2. Enter

- Name
- Email
- Password
- Confirm Password

3. Click Register.

System

- Validate fields
- Check duplicate email
- Hash password
- Create account
- Redirect to Login

Success

User account created.

---

# Flow 2 - Login

Steps

1. Enter Email

2. Enter Password

3. Click Login

System

- Verify credentials
- Generate JWT
- Create session
- Redirect Dashboard

---

# Flow 3 - Complete Profile

User enters

- Full Name
- Experience
- Current Role
- Target Role
- Location (Optional)

Save Profile

---

# Flow 4 - Resume Upload

Steps

Upload PDF

↓

Store File

↓

Gemini Resume Analysis

↓

Extract Skills

↓

Show Result

↓

User Edit

↓

Save

---

# Flow 5 - Study Plan

User selects

- Interview Date
- Study Days
- Daily Questions
- Notification Time
- Preferred Topics

Save Study Plan

---

# Flow 6 - Telegram Connection

Dashboard

↓

Click Connect Telegram

↓

Generate Secure Token

↓

Open Telegram Bot

↓

User Sends Token

↓

Verify Token

↓

Connect Account

Success

Telegram Connected

---

# Flow 7 - Daily Question

08:00 Scheduler

↓

Generate Question

↓

Save Database

↓

Telegram Notification

↓

User Opens Dashboard

↓

Reads Question

↓

Submits Answer

↓

Gemini Review

↓

Store Feedback

↓

Update Progress

---

# Flow 8 - Question Revision

System detects

Low Score

↓

Weak Topic

↓

Schedule Revision

↓

Generate Similar Question

↓

User Solves Again

↓

Improved Score

---

# Flow 9 - Weekly Report

Sunday

↓

Scheduler

↓

Calculate Progress

↓

Generate Summary

↓

Telegram Notification

↓

Dashboard Updated

---

# Flow 10 - Settings

User can update

- Name
- Target Role
- Study Time
- Daily Questions
- Telegram
- Password

---

# Error Flows

Resume Upload Failed

↓

Retry

↓

Cancel

↓

Upload Again

---

Gemini Error

↓

Retry

↓

Log Error

↓

Notify User

---

Telegram Offline

↓

Retry

↓

Store Failed Notification

↓

Send Later

---

# Logout

Dashboard

↓

Logout

↓

Delete Session

↓

Redirect Login

---

# User States

New User

↓

Registered

↓

Profile Completed

↓

Resume Uploaded

↓

Study Plan Ready

↓

Telegram Connected

↓

Active Learning

↓

Interview Ready

---

# Design Principles

- Maximum 3 clicks for any primary action.
- Every screen should have a clear next step.
- Never leave the user without guidance.
- AI tasks should show progress indicators.
- Every error should provide a recovery action.

---

# Acceptance Criteria

The application should support every user flow documented above before the MVP is considered complete.