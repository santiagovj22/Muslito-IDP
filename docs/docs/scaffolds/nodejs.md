---
id: nodejs
title: Node.js / Fastify Scaffold
sidebar_position: 2
---

# Node.js / Fastify Scaffold

A production-ready Node.js backend built on [Fastify 4](https://fastify.dev/) with TypeScript.

## Generate

```bash
idp scaffold new --type nodejs --name my-service
```

## Project structure

```
my-service/
├── src/
│   ├── routes/              # Route definitions — thin HTTP-to-controller wrappers
│   │   ├── index.ts
│   │   └── health.route.ts
│   ├── controllers/         # Request/response handling, input validation
│   │   └── health.controller.ts
│   ├── services/            # Business logic — pure, no HTTP knowledge
│   │   └── health.service.ts
│   ├── dal/                 # Data Access Layer — DB / external calls
│   │   └── health.repository.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── sanitize.middleware.ts
│   │   └── cors.middleware.ts
│   ├── exceptions/
│   │   ├── AppError.ts
│   │   ├── NotFoundError.ts
│   │   ├── ValidationError.ts
│   │   └── UnauthorizedError.ts
│   ├── handlers/
│   │   └── globalErrorHandler.ts
│   ├── config/
│   │   ├── env.ts           # Zod schema — fails fast if required vars missing
│   │   └── logger.ts        # Pino with request-ID correlation
│   ├── utils/
│   │   └── response.helper.ts
│   └── app.ts               # Fastify app bootstrap
├── tests/
│   ├── unit/
│   └── integration/
├── .github/workflows/
│   ├── ci.yml
│   └── cd.yml
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── jest.config.ts
└── package.json
```

## What's included

### Layered architecture

```
HTTP Request
    ↓
 Route (validates shape, delegates)
    ↓
 Controller (parse + respond)
    ↓
 Service (business rules)
    ↓
 Repository (DB / API calls)
```

### Error handling

All errors thrown anywhere in the chain are caught by the global Fastify error handler. Custom error classes map to HTTP status codes automatically:

```typescript
throw new NotFoundError('User not found');
// → 404 { success: false, error: { code: 'NOT_FOUND', message: 'User not found' } }
```

### Environment validation

On startup, all required env vars are validated against a Zod schema. The process exits with a clear error if any var is missing or invalid — no silent failures in production.

### Response envelope

All responses follow a consistent shape:

```json
{
  "success": true,
  "data": { ... },
  "meta": { "timestamp": "...", "requestId": "..." }
}
```

## Running locally

```bash
cd my-service
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:3000/health](http://localhost:3000/health).

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start with hot-reload |
| `npm run build` | Compile TypeScript |
| `npm run start` | Start compiled output |
| `npm test` | Run unit + integration tests |
| `npm run lint` | ESLint check |

## Environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `3000` | HTTP port |
| `NODE_ENV` | No | `development` | `development` / `production` |
| `LOG_LEVEL` | No | `info` | Pino log level |
| `CORS_ORIGINS` | No | `*` | Allowed CORS origins (comma-separated) |