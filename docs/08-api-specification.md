# CareerOS - API Specification

**Version:** 1.0.0

**Status:** Approved

**API Version:** v1

---

# Purpose

This document defines every REST API used by CareerOS.

Rules:

- All endpoints are prefixed with `/api/v1`
- JSON only
- JWT Authentication
- REST conventions
- Consistent response format

---

# Base URL

```
/api/v1
```

---

# Authentication

Protected endpoints require

```
Authorization: Bearer <JWT_TOKEN>
```

---

# Standard Success Response

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

---

# Standard Error Response

```json
{
  "success": false,
  "message": "Validation Error",
  "errors": []
}
```

---

# HTTP Status Codes

| Code | Meaning |
|------|---------|
|200|OK|
|201|Created|
|204|No Content|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|409|Conflict|
|422|Validation Error|
|429|Rate Limited|
|500|Internal Server Error|

---

# Authentication APIs

## Register

POST

```
/auth/register
```

Request

```json
{
  "name": "",
  "email": "",
  "password": ""
}
```

Response

```
201 Created
```

---

## Login

POST

```
/auth/login
```

Request

```json
{
  "email": "",
  "password": ""
}
```

Response

```json
{
  "accessToken": "",
  "user": {}
}
```

---

## Logout

POST

```
/auth/logout
```

---

## Get Current User

GET

```
/auth/me
```

---

# User APIs

## Get Profile

GET

```
/users/profile
```

---

## Update Profile

PUT

```
/users/profile
```

Fields

- name
- experience
- targetRole

---

# Resume APIs

## Upload Resume

POST

```
/resume/upload
```

Multipart

```
resume.pdf
```

---

## Analyze Resume

POST

```
/resume/analyze
```

Starts Gemini analysis.

---

## Get Resume

GET

```
/resume
```

---

## Update Skills

PUT

```
/resume/skills
```

---

# Study Plan APIs

## Create Study Plan

POST

```
/study-plan
```

---

## Get Study Plan

GET

```
/study-plan
```

---

## Update Study Plan

PUT

```
/study-plan
```

Fields

- interviewDate
- dailyQuestions
- notificationTime
- preferredTopics

---

# Question APIs

## Generate Questions

POST

```
/questions/generate
```

---

## Today's Questions

GET

```
/questions/today
```

---

## Question History

GET

```
/questions/history
```

Supports pagination.

---

## Question Details

GET

```
/questions/:id
```

---

# Answer APIs

## Submit Answer

POST

```
/answers
```

Request

```json
{
  "questionId": "",
  "answer": ""
}
```

---

## Get Answer

GET

```
/answers/:id
```

---

## Retry Question

POST

```
/answers/:id/retry
```

---

# AI Review APIs

## Review Answer

POST

```
/reviews
```

---

## Get Review

GET

```
/reviews/:id
```

---

# Progress APIs

## Dashboard

GET

```
/progress/dashboard
```

Returns

- streak
- solved
- averageScore
- weakTopics
- strongTopics

---

## Weekly Progress

GET

```
/progress/weekly
```

---

## Monthly Progress

GET

```
/progress/monthly
```

---

# Telegram APIs

## Connect

POST

```
/telegram/connect
```

---

## Verify Token

POST

```
/telegram/verify
```

---

## Disconnect

DELETE

```
/telegram/disconnect
```

---

## Send Test Notification

POST

```
/telegram/test
```

---

# Settings APIs

## Get Settings

GET

```
/settings
```

---

## Update Settings

PUT

```
/settings
```

---

# Health APIs

## Health Check

GET

```
/health
```

Returns

```json
{
  "status": "ok"
}
```

---

# Pagination

Supported query parameters

```
?page=1

?limit=20

?sort=createdAt

?order=desc
```

---

# Filtering

Questions

```
?difficulty=easy

?category=react

?status=completed
```

---

# Validation Rules

- Validate every request using Zod.
- Reject unknown fields.
- Return descriptive validation errors.

---

# Rate Limiting

Authentication

```
10 requests / minute
```

General APIs

```
100 requests / minute
```

AI APIs

```
20 requests / hour
```

---

# API Versioning

Current

```
/api/v1
```

Future

```
/api/v2
```

Breaking changes require a new version.

---

# Security

- JWT Authentication
- HTTPS only (production)
- Helmet
- CORS
- Input validation
- File upload validation

---

# Acceptance Criteria

- Every endpoint follows REST conventions.
- Every request is validated.
- Every response follows the standard format.
- Protected endpoints require JWT.
- APIs are documented before implementation.