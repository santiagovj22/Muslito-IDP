---
id: overview
title: Scaffolds Overview
sidebar_position: 1
---

# Scaffolds

Scaffolds are production-ready service templates. Each scaffold ships with a complete, opinionated project structure so you spend zero time on boilerplate and start writing business logic immediately.

## Available scaffolds

| Type | Framework | Language | Status |
|---|---|---|---|
| [`nodejs`](/docs/scaffolds/nodejs) | Fastify 4 | TypeScript | ✅ Available |
| [`fastapi`](/docs/scaffolds/fastapi) | FastAPI | Python 3.12 | ✅ Available |

## What every scaffold includes

| Feature | Details |
|---|---|
| **Layered architecture** | routes → controllers → services → repositories |
| **Global error handler** | Catches sync + async errors, returns formatted JSON |
| **Custom error classes** | `AppError`, `NotFoundError`, `ValidationError`, `UnauthorizedError` |
| **Structured logging** | Request-ID-correlated logs (Pino / structlog) |
| **Input sanitization** | Schema validation + XSS / injection protection |
| **CORS** | Configurable per environment via env vars |
| **Rate limiting** | Configurable limits via env vars |
| **Health check** | `GET /health` returns status, version, uptime |
| **Env validation** | Fails fast at startup if required vars are missing |
| **Standardized responses** | `{ success, data, error, meta }` envelope |
| **Docker** | Multi-stage Dockerfile + docker-compose for local dev |
| **CI/CD** | GitHub Actions pipeline included |

## Generate a scaffold

```bash
idp scaffold new --type nodejs --name my-service
idp scaffold new --type fastapi --name my-service
```

## Scaffold versioning

Every generated service contains a `.idp.json` file recording the scaffold type and version. Run `idp scaffold check` at any time to see whether your service is behind the latest template.

```bash
idp scaffold check
# → ✅  my-service is on the latest nodejs scaffold (v1.2.0)
```