# movies-backend

Backend API for a movie tracking application, built with Node.js, Express, and PostgreSQL.

## Tech Stack

- Node.js
- Express 5
- PostgreSQL
- Docker Compose
- Zod for request validation
- Argon2id for password hashing
- node-pg-migrate for database migrations
- Node.js test runner and Supertest

## Current Features

- User registration with email and password
- Request validation and structured error responses
- Password hashing with Argon2id
- Rate limiting on the registration endpoint
- PostgreSQL database access through a connection pool
- Database migrations
- Automated tests for application behavior, validation, authentication, and database operations

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/health` | Health check |
| POST | `/auth/register` | Register a new user |

### User Registration

Send a `POST` request to `/auth/register` with a JSON body:

```json
{
  "email": "user@example.com",
  "password": "a-long-password-here"
}
```

Successful registration returns HTTP `201`. Invalid input, duplicate email addresses, and rate-limited requests return structured error responses.

## Getting Started

### Requirements

- Node.js
- npm
- Docker and Docker Compose

### Setup

1. Clone the repository.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a local environment file by copying `.env.example` to `.env`.
4. Configure the environment variables for your PostgreSQL database.
5. Start PostgreSQL:

   ```bash
   docker compose up -d
   ```

6. Apply database migrations:

   ```bash
   npm run migrate
   ```

7. Start the development server:

   ```bash
   npm run dev
   ```

The health check is available at `GET /health`.

### Tests

Run the test suite with:

```bash
npm test
```

The test suite includes database tests, so PostgreSQL must be running and the `.env` configuration must be valid.

## Project Status

This project is under active development. Authentication is being implemented incrementally, with movie management planned for a later stage.