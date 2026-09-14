# CareerOS - Authentication & Authorization

**Version:** 1.0.0

**Status:** Approved

**Owner:** Om Doke

---

# Purpose

This document defines the complete authentication and authorization architecture for CareerOS.

It specifies how users register, log in, access protected resources, and how the backend validates requests.

---

# Authentication Goals

- Secure user authentication
- Stateless API
- JWT-based authorization
- Password hashing
- Route protection
- Future-ready role support

---

# Authentication Flow

```
User

↓

Register

↓

Password Hash

↓

Database

↓

Login

↓

Verify Password

↓

Generate JWT

↓

Return Token

↓

Frontend Storage

↓

Authenticated Requests

↓

Middleware Verification

↓

Protected APIs
```

---

# Authentication Method

CareerOS uses

- JWT Access Token
- bcrypt Password Hashing

No server-side sessions.

---

# User Registration

Endpoint

```
POST /api/v1/auth/register
```

Process

```
Validate Request

↓

Check Email Exists

↓

Hash Password

↓

Create User

↓

Create Profile

↓

Return Success
```

---

# User Login

Endpoint

```
POST /api/v1/auth/login
```

Process

```
Validate Credentials

↓

Find User

↓

Compare Password

↓

Generate JWT

↓

Return Token + User
```

---

# JWT Payload

```json
{
  "userId": "uuid",
  "email": "user@example.com"
}
```

Never include

- Password
- API Keys
- Roles (future)
- Sensitive data

---

# Token Expiration

Access Token

```
7 Days
```

Future

Refresh Tokens may be added if required.

---

# Password Rules

Minimum

```
8 characters
```

Must contain

- Uppercase
- Lowercase
- Number
- Special Character

Passwords are hashed using

```
bcrypt
```

Never store plaintext passwords.

---

# Protected Routes

Require JWT

```
/users/*
/resume/*
/study-plan/*
/questions/*
/answers/*
/reviews/*
/progress/*
/telegram/*
/settings/*
```

Public Routes

```
/auth/register
/auth/login
/health
```

---

# Authorization Middleware

Responsibilities

- Read Authorization header
- Validate JWT
- Load user
- Attach user to request
- Reject invalid tokens

---

# Request Flow

```
Incoming Request

↓

Authorization Header

↓

Verify JWT

↓

Load User

↓

Attach req.user

↓

Controller
```

---

# Logout

Since JWT is stateless

Logout consists of

- Frontend deletes token
- User redirected to Login

Future

Blacklist tokens if refresh tokens are introduced.

---

# Password Hashing

Algorithm

```
bcrypt
```

Never compare raw passwords.

Always use bcrypt comparison.

---

# Authentication Errors

Invalid Email

```
401 Unauthorized
```

Invalid Password

```
401 Unauthorized
```

Expired Token

```
401 Unauthorized
```

Missing Token

```
401 Unauthorized
```

Forbidden

```
403 Forbidden
```

---

# Authorization Header

```
Authorization: Bearer <JWT_TOKEN>
```

Missing or malformed headers must be rejected.

---

# User Context

After successful authentication

```
req.user = {
    id,
    email
}
```

Controllers should use

```
req.user.id
```

Never trust client-provided user IDs.

---

# Future Role-Based Access

Roles

```
USER

ADMIN
```

Future middleware

```
requireRole("ADMIN")
```

Current MVP

Single user role only.

---

# Security Rules

- Hash every password
- Never log passwords
- Never log JWT
- Validate every token
- Reject expired tokens
- Reject malformed tokens
- Use HTTPS in production
- Store secrets in environment variables

---

# Environment Variables

```
JWT_SECRET=

JWT_EXPIRES_IN=

BCRYPT_ROUNDS=
```

Never hardcode secrets.

---

# Folder Structure

```
controllers/

auth.controller.ts

services/

auth.service.ts

middlewares/

auth.middleware.ts

validators/

login.schema.ts

register.schema.ts
```

---

# Validation

Register

- Name required
- Email valid
- Password meets policy

Login

- Email required
- Password required

Validation uses

```
Zod
```

---

# Testing Checklist

Registration

- Create account
- Duplicate email
- Invalid email
- Weak password

Login

- Valid credentials
- Invalid password
- Invalid email

JWT

- Missing token
- Invalid token
- Expired token

Protected Routes

- Authorized
- Unauthorized

---

# Acceptance Criteria

Authentication is complete when

- Users can register
- Users can log in
- JWT is generated
- Protected APIs require authentication
- Passwords are securely hashed
- Validation is enforced
- Unauthorized requests are rejected