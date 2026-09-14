# Coding Rules

## General

- Use TypeScript everywhere.
- Avoid JavaScript.
- Prefer strict typing.
- No use of any.
- No duplicate code.
- Keep functions small.
- Keep files focused on one responsibility.

---

## Naming

Components

PascalCase

Variables

camelCase

Interfaces

PascalCase

Enums

PascalCase

Constants

UPPER_SNAKE_CASE

Files

feature-name.ts

---

## Functions

- One responsibility.
- Maximum 50 lines when practical.
- Return early.
- Avoid nested if statements.

---

## React

- Functional components only.
- Hooks only.
- No class components.
- Use React Hook Form.
- Use TanStack Query for server state.
- Zustand only for UI/global state.

---

## Backend

Controller

↓

Service

↓

Repository

Never skip layers.

---

## Database

Use Prisma only.

No raw SQL unless necessary.

---

## API

Always validate requests using Zod.

Always return consistent responses.

---

## Comments

Write self-explanatory code.

Comment only when business logic is not obvious.

---

## Error Handling

Never swallow errors.

Always log errors.

Return user-friendly messages.

---

## Security

Never hardcode

- Passwords
- Secrets
- API Keys
- Tokens

Use environment variables.

---

## Formatting

Use ESLint.

Use Prettier.

Always fix lint errors before committing.