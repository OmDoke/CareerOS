# CareerOS - Project Overview

**Version:** 1.0.0

**Status:** Draft

**Owner:** Om Doke

---

# Vision

CareerOS is an AI-powered interview preparation platform designed to help software engineers prepare for technical interviews through personalized learning.

Instead of providing generic interview questions, CareerOS analyzes the user's profile, study preferences, previous performance, and target role to generate a personalized daily interview preparation plan.

The long-term vision is to become an AI Career Operating System that assists developers throughout their interview journey.

---

# Problem Statement

Most interview preparation platforms suffer from several limitations.

- Every user receives the same questions.
- No personalization.
- No progress-based learning.
- No daily study planning.
- Weak feedback after answering.
- No adaptive revision strategy.

Users are forced to manually decide what to study every day.

CareerOS solves this by automatically planning, generating, reviewing, and tracking interview preparation.

---

# Product Goal

Help users become interview-ready through continuous AI-guided learning.

The platform should:

- Understand the user's resume.
- Understand the user's target role.
- Generate personalized interview questions.
- Review answers using AI.
- Track learning progress.
- Send Telegram reminders.
- Adapt future questions based on previous performance.

---

# Target Users

### Primary

- Students
- Freshers
- Junior Software Engineers
- Developers preparing for interviews

### Secondary

- Career switchers
- Self-taught developers
- Professionals preparing for company interviews

---

# MVP Scope

The first version focuses only on interview preparation.

Included:

- User Authentication
- User Profile
- Resume Upload
- Resume Skill Extraction
- Study Plan
- Daily Question Generation
- AI Answer Review
- Progress Dashboard
- Telegram Notifications
- Scheduler

---

# Not Included In MVP

The following features are intentionally excluded.

- ATS Score
- Resume Builder
- Cover Letter Generator
- Job Scraping
- LinkedIn Automation
- Naukri Automation
- Indeed Automation
- Voice Interviews
- Mock Interviews
- Video Interviews
- Premium Features
- Team Accounts
- Organization Accounts

These features may be added after the MVP is stable.

---

# Product Principles

CareerOS follows these principles.

## Personalization First

Every user should receive personalized interview preparation.

No generic study plans.

---

## AI Assists, User Learns

AI should guide learning.

AI should never replace learning.

---

## Progress Driven

Future questions depend on previous performance.

The system continuously adapts difficulty.

---

## Complete Features

Every feature must be fully completed before starting the next one.

A feature is complete only when:

- Database
- Backend
- API
- Frontend
- Validation
- Testing
- Documentation

are all finished.

---

## Modular Architecture

Every module should be independent.

Examples:

Authentication

Resume Analysis

Study Plan

Question Engine

Answer Review

Telegram

Scheduler

Dashboard

Each module should be replaceable without affecting the rest of the system.

---

# Technology Stack

## Frontend

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query

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

Gemini

Future support:

- OpenAI
- Claude

---

## Notification

Telegram Bot

Only Telegram for MVP.

No Email.

No SMS.

No WhatsApp.

---

# Deployment

Frontend

Vercel

Backend

Galaxy A10

Process Manager

PM2

Public Access

Cloudflare Tunnel

---

# Success Metrics

The MVP will be considered successful if users can:

- Register an account.
- Upload a resume.
- Receive a personalized study plan.
- Receive AI-generated interview questions.
- Submit answers.
- Receive AI feedback.
- Track progress.
- Receive Telegram reminders.

---

# Future Vision

After MVP, CareerOS may expand into a complete AI Career Platform.

Potential future modules include:

- ATS Score
- Resume Builder
- Cover Letter Generator
- Job Intelligence
- Company Preparation
- Mock Interviews
- Voice Interviews
- Community Learning
- Premium Plans
- AI Career Coach

These are outside the scope of Version 1.

---

# Project Status

Current Phase

Repository Planning

Next Phase

Product Requirements