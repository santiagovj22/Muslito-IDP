# {{SERVICE_NAME}}

> Node.js 22 / TypeScript / Fastify backend — generated from IDP scaffold.

## Stack

| Tool | Purpose |
|---|---|
| **Node.js 22** | Runtime (LTS) |
| **TypeScript 5** | Strict mode, `verbatimModuleSyntax`, ES2022 target |
| **Fastify 4** | HTTP framework |
| **Zod** | Runtime env validation |
| **Pino** | Structured JSON logging |
| **Vitest** | Unit + integration tests |
| **tsx** | Zero-config TypeScript dev runner |
| **ESLint 9 + Prettier** | Lint + format |

## Getting Started

```bash
npm install
cp .env.example .env
npm run dev          # start with hot-reload (tsx watch)
```

Or with Docker:

```bash
docker compose up
```

Health check → `http://localhost:3000/api/v1/health`

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start with hot-reload |
| `npm run build` | Compile TypeScript → `dist/` |
| `npm start` | Run compiled output |
| `npm run typecheck` | TypeScript check without emit |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm test` | Run all tests (Vitest) |
| `npm run test:coverage` | Tests with coverage report |

## Project Structure

```
src/
├── types/         # Shared TypeScript interfaces & augmentations
├── config/        # env validation (Zod), Pino logger
├── exceptions/    # AppError + typed subclasses
├── handlers/      # Global Fastify error handler
├── middlewares/   # onRequest/onSend hooks, sanitize preHandler
├── routes/        # Route definitions (thin — map HTTP to controllers)
├── controllers/   # Input validation, response shaping
├── services/      # Business logic (pure, no HTTP knowledge)
├── dal/           # Data Access Layer (DB / external API calls)
└── utils/         # Response envelope helpers
```

## Adding a New Feature

1. Define the entity type in `src/types/`
2. Add a route in `src/routes/` and register it in `src/routes/index.ts`
3. Add a controller in `src/controllers/` — validate input, shape response
4. Add business logic in `src/services/`
5. Add data access in `src/dal/` — extend `BaseRepository<T>`
6. Write unit tests in `tests/unit/` and integration tests in `tests/integration/`
