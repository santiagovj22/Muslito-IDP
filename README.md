# Muslito Internal Developer Platform (IDP)

> Golden paths and paved roads for your engineering team.

## What's in here

| Folder | Description |
|---|---|
| `scaffolds/nodejs` | Production-ready Node.js/Fastify backend scaffold |
| `scaffolds/fastapi` | Production-ready Python/FastAPI backend scaffold |
| `blueprints/` | AWS CDK infrastructure blueprints |
| `pipelines/` | Reusable GitHub Actions CI/CD templates |
| `cli/` | `idp` CLI tool — generate scaffolds & deploy blueprints |
| `docs/` | Platform documentation |

## Quick Start

```bash
# Install the CLI
npm install -g @your-org/idp-cli

# Create a new Node.js service
idp scaffold new --type nodejs --name my-service

# Create a new FastAPI service
idp scaffold new --type fastapi --name my-service

# Deploy a blueprint
idp blueprint deploy apigw-lambda-dynamodb --name my-api --env dev
```

## Scaffolds

- **Node.js (Fastify)** — Layered architecture, global error handling, structured logging, CORS, sanitization, CI/CD pipeline included.
- **FastAPI (Python)** — Layered architecture, Pydantic validation, structlog, CORS, pydantic-settings, CI/CD pipeline included.

## Blueprints

| Blueprint | Description |
|---|---|
| `apigw-lambda-dynamodb` | Serverless REST API + NoSQL storage |
| `ecs-fargate-rds` | Containerized service + PostgreSQL |
| `cache-layer` | Add ElastiCache Redis to any service |
| `event-driven` | EventBridge + SQS + Lambda consumer |
| `secrets-and-config` | Secrets Manager + SSM Parameter Store |

## Contributing

See [docs/contributing.md](docs/contributing.md) for how to add new scaffolds or blueprints.
