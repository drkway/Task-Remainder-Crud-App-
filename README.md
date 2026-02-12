# Task Management Backend

A secure Node.js + Express backend for task management with email OTP authentication, JWT tokens, rate limiting, activity logging, and Swagger API docs.

## Quick Start (Local)

### 1. Prerequisites
- Node.js v18+ and npm installed
- PostgreSQL installed locally (or use Docker)

### 2. Clone and Install
```bash
git clone <your-repo-url>
cd Task\ Remainder
npm install
```

### 3. Set Up Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` with your local database and SMTP config:
```env
PORT=4000
DATABASE_URL=postgres://dbuser:dbpass@localhost:5432/taskdb
JWT_ACCESS_SECRET=your-random-access-secret-here
JWT_REFRESH_SECRET=your-random-refresh-secret-here
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=7d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
OTP_TTL_MIN=5
```

### 4. Start PostgreSQL Locally
Option A: Using Docker (easiest)
```bash
docker run -d --name task-postgres \
  -e POSTGRES_USER=dbuser \
  -e POSTGRES_PASSWORD=dbpass \
  -e POSTGRES_DB=taskdb \
  -p 5432:5432 \
  postgres:15
```

Option B: Using installed Postgres
- Ensure Postgres is running.
- Create database: `createdb taskdb -U dbuser`

### 5. Start the Server
```bash
npm run dev
```

You should see: `Server running on 4000`

### 6. Test the API
- **Health**: http://localhost:4000
- **Swagger UI**: http://localhost:4000/api-docs

## How to Use Locally

### Step 1: Request OTP
Send email and receive a one-time password:
```bash
curl -X POST http://localhost:4000/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com"}'
```

Check your email for the OTP code (or query the DB directly if SMTP not configured).

### Step 2: Verify OTP and Get Tokens
```bash
curl -X POST http://localhost:4000/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","code":"123456"}'
```

Response:
```json
{
  "access": "eyJhbGciOiJIUzI1NiIs...",
  "refresh": "a3f9d2c1e8b7..."
}
```

### Step 3: Create a Task
Use the `access` token in the Authorization header:
```bash
curl -X POST http://localhost:4000/tasks \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy groceries","description":"Milk and eggs","status":"todo"}'
```

### Step 4: List Your Tasks
```bash
curl http://localhost:4000/tasks \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

### Step 5: Update a Task
```bash
curl -X PUT http://localhost:4000/tasks/task-uuid-here \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{"status":"done"}'
```

### Step 6: Delete a Task
```bash
curl -X DELETE http://localhost:4000/tasks/task-uuid-here \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

### Step 7: Refresh Access Token (when expired)
```bash
curl -X POST http://localhost:4000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refresh":"a3f9d2c1e8b7..."}'
```

## API Documentation
All endpoints are documented in Swagger UI:
- Open: http://localhost:4000/api-docs

## Design Choices
- **Runtime**: Node.js + Express — lightweight, widely-used.
- **Database**: PostgreSQL with Sequelize ORM for relational integrity.
- **Auth**: Passwordless email OTP flow + JWT (short-lived access tokens + persistent refresh tokens).
- **Security**: Bcrypt hashing for refresh tokens, rate limiting on auth endpoints, helmet CORS.
- **Logging**: Activity logs in DB (login, task ops, API usage) for audit trails.
- **Middleware**: Input validation, rate limiting, global error handling.

## Project Structure
```
src/
├── config/
│   ├── db.js           # Sequelize connection
│   └── swagger.js      # OpenAPI spec
├── models/
│   ├── user.js
│   ├── task.js
│   ├── otp.js
│   ├── refreshToken.js
│   ├── activityLog.js
│   └── index.js        # Associations
├── controllers/
│   ├── authController.js   # OTP, tokens
│   └── taskController.js   # CRUD
├── routes/
│   ├── auth.js         # Auth endpoints
│   └── tasks.js        # Task endpoints
├── middleware/
│   ├── auth.js         # JWT verification
│   ├── validate.js     # Input validation
│   ├── rateLimiter.js  # Rate limits
│   └── errorHandler.js # Error responses
├── utils/
│   ├── jwt.js          # Token generation
│   └── mail.js         # Email sending
├── app.js              # Express app
└── server.js           # Entry point
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "npm: not recognized" | Install Node.js from nodejs.org |
| DATABASE_URL undefined | Check `.env` file is in root and DATABASE_URL is set |
| ENOTFOUND postgres.railway.internal | Correct DATABASE_URL in `.env` to your local: `postgres://dbuser:dbpass@localhost:5432/taskdb` |
| OTP emails not arriving | Check SMTP_* vars in `.env`; test with mailtrap.io or check server logs |
| "Unauthorized" on /tasks | Ensure Authorization: Bearer token is in header and not expired |
| "Cannot GET /" | Server may have crashed; check terminal logs and .env |

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server (with auto-reload)
npm run dev

# Start production server
npm start
```

## Environment Variables (.env.example)
See `.env.example` for all configurable options. Key variables:
- `PORT` — Server port (default 4000)
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_ACCESS_SECRET` — Secret for signing access tokens
- `JWT_REFRESH_SECRET` — Secret for signing refresh tokens
- `SMTP_*` — Email configuration for OTP delivery
- `OTP_TTL_MIN` — OTP validity in minutes
