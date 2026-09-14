# CareerOS - AI Engine

**Version:** 1.0.0

**Status:** Approved

**Owner:** Om Doke

---

# Purpose

This document defines how Artificial Intelligence is used throughout CareerOS.

The AI Engine is responsible for:

- Resume Analysis
- Skill Extraction
- Personalized Question Generation
- Answer Evaluation
- Learning Adaptation
- Revision Planning

All AI interactions must follow the architecture defined in this document.

---

# AI Provider

Current Provider

```
Google Gemini
```

Future Providers

- OpenAI
- Claude
- Local LLM

The application must use a provider abstraction so AI providers can be swapped without changing business logic.

---

# AI Architecture

```
Controller

↓

Service

↓

AI Service

↓

Prompt Builder

↓

Gemini Provider

↓

Response Parser

↓

Database
```

Controllers must never call Gemini directly.

---

# AI Modules

CareerOS uses AI for six modules.

1. Resume Analysis
2. Skill Extraction
3. Question Generation
4. Answer Review
5. Revision Planning
6. Weekly Summary

---

# Resume Analysis

Input

- PDF Resume

Process

```
Upload

↓

Extract Text

↓

Gemini

↓

JSON Response

↓

Store Database
```

Output

- Name
- Experience
- Skills
- Projects
- Education
- Certifications
- Technologies

The user can edit extracted information before saving.

---

# Skill Extraction

Extract

- Programming Languages
- Frameworks
- Libraries
- Databases
- Cloud
- DevOps
- Tools

Each skill should include

- Name
- Category
- Confidence Score

Duplicate skills should be merged.

---

# Question Generation

Questions are generated based on

- Resume Skills
- Target Role
- Experience
- Previous Questions
- Weak Topics
- Difficulty Level

Questions must be unique.

Avoid recently solved questions.

---

# Supported Categories

- DSA
- Java
- React
- Next.js
- Node.js
- SQL
- JavaScript
- TypeScript
- HTML
- CSS
- System Design
- Behavioral

Future

- Company Specific
- Machine Learning
- DevOps
- Cloud

---

# Difficulty Levels

Easy

For beginners.

Medium

Standard interview level.

Hard

Product company level.

Difficulty should adapt according to user performance.

---

# Question Structure

Each generated question contains

- ID
- Category
- Difficulty
- Title
- Description
- Expected Answer
- Hints
- Estimated Time
- Tags

Future

- Company Tags
- Topic Weight

---

# Answer Review

Input

- User Answer

Gemini evaluates

- Accuracy
- Completeness
- Missing Concepts
- Code Quality (if applicable)
- Communication Quality

Output

- Score
- Strengths
- Weaknesses
- Suggestions
- Model Answer

---

# Scoring

Range

```
0 - 100
```

Classification

```
90-100 Excellent

75-89 Good

50-74 Needs Improvement

Below 50 Weak
```

---

# Adaptive Learning

The system tracks

- Accuracy
- Time Taken
- Revision Count
- Weak Topics
- Strong Topics

Future questions are adjusted using these metrics.

---

# Revision Engine

When

- Low Score
- Multiple Mistakes
- Weak Topic

The system schedules a revision question.

Revision priority

High

↓

Medium

↓

Low

---

# Prompt Management

All prompts are stored inside

```
packages/prompts/
```

Example

```
resume-analysis.md

question-generation.md

answer-review.md

weekly-summary.md
```

Prompt text must never be embedded inside controllers or services.

---

# AI Response Format

Every provider must return a normalized response.

Example

```json
{
  "success": true,
  "data": {},
  "usage": {
    "inputTokens": 0,
    "outputTokens": 0
  }
}
```

---

# Error Handling

Retry Strategy

1st Failure

Retry immediately.

2nd Failure

Retry after delay.

3rd Failure

Log error and notify user.

Never expose raw AI errors to users.

---

# Rate Limiting

Resume Analysis

5 per day

Question Generation

50 per day

Answer Review

100 per day

Weekly Summary

1 per week

Limits should be configurable.

---

# Caching

Cache

- Resume Analysis
- Weekly Summary

Do not cache

- Question Generation
- Answer Review

---

# Logging

Log

- AI Request
- AI Response Time
- Token Usage
- Failures
- Retry Attempts

Do not log

- API Keys
- User Passwords
- JWT Tokens

---

# Configuration

Environment Variables

```
GEMINI_API_KEY=

AI_PROVIDER=gemini

AI_TIMEOUT=30000

AI_MAX_RETRIES=3
```

---

# Future Features

- Multi-model Support
- AI Interview Simulation
- Voice Evaluation
- Code Execution Review
- Company-specific Questions
- Personalized Learning Paths

---

# Folder Structure

```
packages/prompts/

resume-analysis.md

question-generation.md

answer-review.md

weekly-summary.md

apps/api/src/services/

ai.service.ts

providers/

gemini.provider.ts

prompt-builder.ts

response-parser.ts
```

---

# Acceptance Criteria

The AI Engine is complete when

- Resume analysis works.
- Skills are extracted.
- Personalized questions are generated.
- Answers are reviewed.
- Weak topics are identified.
- Revision questions are scheduled.
- Prompt templates are externalized.
- AI failures are handled gracefully.