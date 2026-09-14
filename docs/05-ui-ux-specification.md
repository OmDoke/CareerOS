# CareerOS - UI/UX Specification

**Version:** 1.0.0

**Status:** Draft

**Owner:** Om Doke

---

# Table of Contents

1. Design Principles
2. Navigation
3. Application Layout
4. Authentication Pages
5. Dashboard
6. Resume Module
7. Study Plan
8. Daily Questions
9. Answer Review
10. Progress Dashboard
11. Telegram Integration
12. Settings
13. Common Components
14. Responsive Design
15. Empty States
16. Loading States
17. Error States

---

# 1. Design Principles

CareerOS should be clean and distraction-free.

Goals

- Fast
- Modern
- Minimal
- Mobile Friendly
- Dark Mode First
- Accessible

Users should always know what to do next.

---

# 2. Navigation

Sidebar

- Dashboard
- Resume
- Study Plan
- Questions
- Progress
- Settings

Top Bar

- Search (Future)
- Notifications
- Profile Menu

---

# 3. Application Layout

Desktop

----------------------------------------

Sidebar

Top Navbar

Main Content

----------------------------------------

Mobile

Top Navbar

↓

Bottom Navigation

Dashboard

Questions

Progress

Settings

---

# 4. Authentication

Pages

Login

Register

Forgot Password (Future)

Reset Password (Future)

---

Login Form

Fields

- Email
- Password

Buttons

- Login

Links

- Create Account

---

Register Form

Fields

- Name
- Email
- Password
- Confirm Password

Buttons

- Register

---

# 5. Dashboard

Cards

Today's Question

Current Streak

Questions Solved

Average Score

Weak Topics

Upcoming Reminder

Recent Activity

Quick Actions

Buttons

Resume

Study Plan

Today's Question

Connect Telegram

---

# 6. Resume Module

Page

Resume Upload

Sections

Upload PDF

Resume Preview

Extracted Skills

Projects

Experience

Education

Buttons

Upload

Analyze

Save

Reanalyze

---

# 7. Study Plan

Sections

Target Role

Interview Date

Study Days

Daily Questions

Notification Time

Preferred Topics

Buttons

Save

Reset

---

# 8. Daily Questions

Question Card

Category

Difficulty

Estimated Time

Question

Hint (Optional)

Buttons

Submit Answer

Skip

Save Draft

Next Question

---

# 9. Answer Review

Display

AI Score

Strengths

Weaknesses

Improvement Suggestions

Reference Answer

Buttons

Retry

Next Question

---

# 10. Progress Dashboard

Charts

Weekly Score

Daily Questions

Category Accuracy

Streak Calendar

Weak Topics

Strong Topics

Statistics

Total Questions

Average Score

Study Hours

---

# 11. Telegram Integration

Card

Connection Status

Bot Username

Last Notification

Buttons

Connect

Disconnect

Test Notification

---

# 12. Settings

Profile

Password

Study Preferences

Notification Settings

Telegram

Theme

Logout

---

# 13. Common Components

Button

Input

Textarea

Card

Badge

Modal

Dialog

Toast

Loader

Avatar

Progress Bar

Empty State

Confirm Dialog

---

# 14. Responsive Design

Desktop

>=1024px

Tablet

768px -1023px

Mobile

<768px

All pages must be responsive.

---

# 15. Empty States

Dashboard

"No progress yet."

Resume

"Upload your first resume."

Questions

"No questions generated."

Telegram

"Telegram not connected."

---

# 16. Loading States

Use Skeleton UI.

Never show blank pages.

Show loading indicators for

- Resume Analysis
- AI Question Generation
- AI Review
- Dashboard Loading

---

# 17. Error States

Examples

Resume Upload Failed

↓

Retry Button

Gemini Error

↓

Try Again

Telegram Failed

↓

Reconnect

Database Error

↓

Reload

Every error screen must explain

- What happened
- Why it happened (if known)
- What the user should do next

---

# UI Rules

- Maximum three clicks for any major action.
- Every page must have a clear primary action.
- Dark Mode is the default.
- Use consistent spacing and typography.
- Reuse components instead of creating duplicates.
- Forms must include client-side validation.
- Use toast notifications for success and failure.
- All AI operations should display progress indicators.

---

# Acceptance Criteria

The UI is considered complete when every screen, form, component, and state described above is implemented and responsive.