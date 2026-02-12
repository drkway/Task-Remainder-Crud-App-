# Task Management Backend

This is a Node.js + Express backend implementing a task management system with email OTP authentication, JWT access and refresh tokens, rate limiting, activity logging, and Swagger docs.

Quick start

1. Copy `.env.example` → `.env` and fill values (Postgres + SMTP).
2. Install deps:

```bash
npm install
```

3. Start (dev):

```bash
npm run dev
```

Design choices
- Runtime: Node.js + Express for minimal, widely-known stack.
- DB: PostgreSQL via `sequelize` for relational integrity and simple sync.
- Auth: email OTP for passwordless flow, JWT access tokens (short-lived) and refresh tokens stored server-side.
- Middleware: `express-validator`, `express-rate-limit`, centralized error handler.

APIs and docs
- Swagger UI is mounted at `/api-docs`.

Notes
- This repo is scaffolded for the assignment; configure real SMTP and DB before deploying.
