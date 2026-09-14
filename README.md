# 🚀 CareerOS

> AI-powered Interview Preparation Platform that creates a personalized learning roadmap from your resume.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-MVP-orange)

---

# 📖 Overview

CareerOS is an AI-powered interview preparation platform designed to help software engineers prepare efficiently for technical interviews.

Instead of providing random interview questions, CareerOS analyzes a user's resume, identifies skill gaps, creates a personalized learning roadmap, generates daily interview questions, evaluates answers using AI, tracks progress, and sends reminders through Telegram.

The goal is to provide a structured, personalized interview preparation experience.

---

# ✨ MVP Features

## Authentication

- User Registration
- Secure Login
- JWT Authentication

---

## Resume Analysis

- Upload Resume (PDF)
- AI Resume Analysis
- Skill Extraction
- Resume Summary

---

## Personalized Learning

- Learning Roadmap
- Skill Gap Analysis
- Daily Interview Questions
- Adaptive Difficulty

---

## AI Answer Review

- AI Evaluation
- Score
- Feedback
- Improvement Suggestions
- Weak Topic Detection

---

## Progress Dashboard

- Daily Progress
- Weekly Progress
- Learning Streak
- Strong Topics
- Weak Topics
- Completion Percentage

---

## Telegram Integration

- Connect Telegram
- Daily Question Notification
- Study Reminder
- Weekly Progress Report

---

## Scheduler

- Daily Question Generation
- Reminder Notifications
- Weekly Reports
- Cleanup Jobs

---

# 🏗 Architecture

```
Resume

↓

Resume Analysis

↓

Skill Gap Analysis

↓

Learning Roadmap

↓

Daily Study Session

↓

Question Generator

↓

AI Review

↓

Progress Tracking

↓

Telegram Notification
```

---

# 🛠 Tech Stack

## Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Zustand

---

## Backend

- Express.js
- TypeScript
- Prisma ORM
- SQLite (MVP)
- JWT
- bcrypt
- node-cron
- Pino

---

## AI

- Google Gemini API

---

## Notifications

- Telegram Bot API

---

## Deployment

Frontend

- Vercel

Backend

- Android Mobile Server (Termux)

Database

- SQLite

---

# 📂 Repository Structure

```
career-os/

apps/
│
├── web/
└── api/

packages/
│
├── shared/
├── prompts/
├── types/
└── ui/

docs/

scripts/

.ai/
```

---

# 📚 Documentation

| Document | Description |
|----------|-------------|
| 00 | Project Overview |
| 01 | Product Requirements |
| 02 | System Architecture |
| 03 | Database Design |
| 04 | User Flow |
| 05 | UI/UX Specification |
| 06 | Folder Structure |
| 07 | Coding Standards |
| 08 | API Specification |
| 09 | Authentication |
| 10 | AI Engine |
| 11 | Backend Architecture |
| 12 | Frontend Architecture |
| 13 | Telegram Bot |
| 14 | Scheduler |
| 15 | Development Roadmap |

---

# 🚀 Getting Started

## Clone

```bash
git clone https://github.com/OmDoke/CareerOS.git
```

---

## Install

```bash
npm install
```

---

## Environment

Copy

```
.env.example
```

to

```
.env
```

---

## Run Development

```bash
npm run dev
```

---

# 📅 Development Roadmap

- ✅ Project Documentation
- ⏳ Foundation
- ⏳ Authentication
- ⏳ Resume Analysis
- ⏳ Learning Roadmap
- ⏳ Question Engine
- ⏳ AI Review
- ⏳ Dashboard
- ⏳ Telegram Bot
- ⏳ Scheduler
- ⏳ Deployment

---

# 🤝 Contributing

Please read

```
CONTRIBUTING.md
```

before opening issues or pull requests.

---

# 🔒 Security

If you discover a security issue, please refer to

```
SECURITY.md
```

---

# 📄 License

This project is licensed under the MIT License.

See

```
LICENSE
```

for details.

---

# 👨‍💻 Author

**Om Doke**

GitHub

https://github.com/OmDoke

---

# ⭐ Vision

CareerOS aims to become an AI-powered personal interview coach that continuously adapts to each user's skills, progress, and career goals.