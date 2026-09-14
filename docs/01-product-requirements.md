# CareerOS - Product Requirements Specification (PRS)

**Version:** 1.0.0

**Status:** Draft

**Project:** CareerOS

**Owner:** Om Doke

---

# Table of Contents

1. Introduction
2. Vision
3. Problem Statement
4. Goals
5. Non Goals
6. Target Users
7. User Personas
8. Functional Requirements
9. Non Functional Requirements
10. MVP Scope
11. User Journey
12. Business Rules
13. Success Metrics
14. Constraints
15. Risks
16. Future Scope

---

# 1. Introduction

CareerOS is an AI-powered interview preparation platform that creates a personalized learning journey for every user.

Unlike traditional interview preparation websites that provide static question banks, CareerOS continuously adapts interview preparation based on:

- Resume
- Skills
- Experience
- Target Role
- Study Plan
- Previous Answers
- Interview Date
- Learning Progress

The objective is to become a personal AI interview coach rather than another question bank.

---

# 2. Vision

CareerOS aims to become an AI Career Operating System that helps developers prepare for technical interviews through structured, adaptive, and measurable learning.

The platform should reduce the need for users to manually decide:

- What to study
- When to study
- Which topic to revise
- Which concepts are weak
- Whether they are interview-ready

Instead, CareerOS generates a daily personalized study plan.

---

# 3. Problem Statement

Current interview preparation platforms have several problems.

## 3.1 Generic Learning

Every user receives the same questions.

There is no personalization.

---

## 3.2 No Progress Awareness

Platforms rarely know

- what the user has already solved
- which topics are weak
- which topics require revision

---

## 3.3 No Daily Planning

Users spend time deciding what to study instead of actually studying.

---

## 3.4 Weak Feedback

Most platforms simply show answers.

They don't evaluate the user's own answer.

---

## 3.5 No Adaptive Learning

Difficulty does not change based on user performance.

CareerOS solves these issues using AI.

---

# 4. Product Goals

The MVP should help users:

- Prepare daily without planning manually.
- Improve interview confidence.
- Learn consistently.
- Track measurable progress.
- Focus on weak topics.
- Build interview habits.

---

# 5. Non Goals (MVP)

The following features are intentionally excluded.

- ATS Score
- Resume Builder
- Resume Optimizer
- Cover Letter Generator
- Job Scraping
- LinkedIn Automation
- Naukri Automation
- Indeed Automation
- Mock Interviews
- Voice Interviews
- AI Voice Coach
- Premium Plans
- Team Accounts

These will be considered after MVP stabilization.

---

# 6. Target Users

## Primary Users

- College Students
- Fresh Graduates
- Junior Developers
- Software Engineers preparing for interviews

---

## Secondary Users

- Career Switchers
- Self-Taught Developers
- Professionals preparing for product companies

---

# 7. User Personas

## Persona A

Role

Student

Experience

0 Years

Goal

Frontend Developer

Daily Study Time

2 Hours

Questions Per Day

5

---

## Persona B

Role

Working Professional

Experience

2 Years

Goal

Java Backend Developer

Daily Study Time

1 Hour

Questions

3 Daily

---

# 8. Functional Requirements

The MVP shall include the following modules.

## Authentication

Users can

- Register
- Login
- Logout
- Reset Password (Future)
- Manage Profile

---

## Resume Analysis

Users can upload a resume.

Gemini extracts

- Skills
- Experience
- Education
- Projects
- Technologies

The extracted information is editable before saving.

No ATS score is calculated.

---

## Study Plan

Each user can configure

- Target Role
- Daily Study Time
- Questions Per Day
- Preferred Notification Time
- Interview Date

---

## Question Engine

Generate personalized interview questions.

Supported Categories

- DSA
- React
- Next.js
- Node.js
- Java
- SQL
- HR

Difficulty

- Easy
- Medium
- Hard

Questions should not repeat unless used for revision.

---

## Answer Review

Users submit answers.

Gemini evaluates

- Correctness
- Completeness
- Missing Concepts
- Suggested Improvements

Scores are stored.

---

## Dashboard

Dashboard displays

- Today's Progress
- Weekly Progress
- Accuracy
- Streak
- Weak Topics
- Strong Topics
- Study History

---

## Telegram Bot

Telegram is the only notification system.

Supported commands

- /today
- /next
- /progress
- /streak
- /help

Notifications

- Daily Question
- Reminder
- Weekly Report

---

## Scheduler

Runs automatically.

Night

Generate tomorrow's questions.

Morning

Send Telegram notification.

Evening

Reminder.

Sunday

Weekly report.

---

# 9. Non Functional Requirements

Performance

- Dashboard loads under 2 seconds.
- Question generation should complete within 10 seconds.

Security

- JWT Authentication
- Password hashing
- Input validation
- Rate limiting

Maintainability

- Modular architecture
- Feature-based structure
- Reusable services

Scalability

SQLite for MVP.

Future migration to PostgreSQL should require minimal changes.

---

# 10. User Journey

1. Register
2. Complete Profile
3. Upload Resume
4. Review Extracted Skills
5. Create Study Plan
6. Connect Telegram
7. Receive Daily Question
8. Submit Answer
9. Receive AI Feedback
10. Track Progress
11. Repeat Daily

---

# 11. Business Rules

- Every user must have one active study plan.
- Questions should not repeat unnecessarily.
- Weak topics should receive higher priority.
- Completed questions remain in history.
- Telegram reminders are optional but recommended.
- Every generated question is stored for future reference.
- Users may edit their study preferences at any time.

---

# 12. Success Metrics

The MVP is successful when users can:

- Create an account.
- Upload a resume.
- Generate a study plan.
- Receive AI-generated questions.
- Submit answers.
- Receive AI reviews.
- Track progress.
- Receive Telegram notifications.

---

# 13. Constraints

- Backend runs on Galaxy A10.
- SQLite database.
- Gemini API for AI.
- Telegram only for notifications.
- Frontend deployed on Vercel.

---

# 14. Risks

- Gemini API quota limits.
- Poor resume formatting.
- Telegram connectivity issues.
- Users skipping study sessions.
- AI-generated duplicate questions.

Mitigation strategies will be documented in later architecture documents.

---

# 15. Future Scope

After MVP:

- ATS Score
- Resume Optimizer
- Cover Letter Generator
- Job Scraper
- Company-specific Preparation
- Mock Interviews
- Voice Interviews
- Community Features
- Premium Plans
- AI Career Coach

These features are explicitly outside the MVP.

---

# Approval

This document serves as the primary product requirements specification for CareerOS MVP.

All architecture, database design, APIs, and development phases must align with this document.