# Internal Developer Platform (IDP) — Design & Build Plan

> **Goal:** Eliminate environment setup friction and infrastructure toil so developers focus exclusively on business logic.

---

## 1. Vision & Principles

### Vision
Build an Internal Developer Platform that provides **golden paths** — opinionated, pre-built, production-ready starting points for backend services and infrastructure — so any developer can go from idea to running system in minutes, not days.

### Core Principles
- **Paved roads, not walls:** Golden paths are the easy way, not the only way. Advanced users can still customize.
- **Convention over configuration:** Sensible defaults are baked in. Developers only change what truly matters to their domain.
- **Everything as code:** Scaffolds, blueprints, and pipelines are all version-controlled and auditable.
- **Self-service:** Developers don't need to file tickets to get a new service or infra resource. They pick, configure, and go.
- **Built-in production readiness:** Logging, error handling, security, observability, and CI/CD are not afterthoughts — they ship with every scaffold.

---

## 2. Platform Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    IDP — Developer Portal / CLI                  │
│           (Web UI + idp CLI tool — entry points for devs)       │
└────────────────────────────┬────────────────────────────────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
   ┌──────▼──────┐   ┌───────▼───────┐  ┌──────▼──────┐
   │  Scaffolds  │   │  Infra        │  │  CI/CD      │
   │  Catalog    │   │  Blueprints   │  │  Templates  │
   │             │   │  Catalog      │  │             │
   │ • Node.js   │   │ • APIGW+      │  │ • GitHub    │
   │ • FastAPI   │   │   Lambda+     │  │   Actions   │
   │ • (future)  │   │   DynamoDB    │  │ • GitLab CI │
   └─────────────┘   │ • RDS         │  │ • (future)  │
                     │ • ElastiCache │  └─────────────┘
                     │ • Secrets/SSM │
                     │ • Alarms/SNS  │
                     │ • EventBridge │
                     └───────────────┘
```

### Key Components
| Component | Description |
|---|---|
| **Developer Portal** | Web UI where devs browse scaffolds, blueprints, and docs |
| **IDP CLI** | `idp` command-line tool to generate scaffolds and deploy blueprints |
| **Scaffolds Catalog** | Opinionated app templates (Node.js, FastAPI) |
| **Infra Blueprints Catalog** | AWS infrastructure templates (CDK or Terraform) |
| **CI/CD Templates** | Reusable pipeline definitions per language/platform |
| **Internal Registry** | Git repo (mono or multi) hosting all catalog items |

---

## 3. Phase Roadmap

### Phase 1 — Foundation (Weeks 1–4) ✅ *Start here*
- [ ] Design scaffold structures (Node.js + FastAPI)
- [ ] Build Node.js scaffold with all layers
- [ ] Build FastAPI scaffold with all layers
- [ ] Create first CI/CD pipeline templates (GitHub Actions)
- [ ] Create first 2 AWS blueprints (APIGW+Lambda+DynamoDB, RDS)
- [ ] Set up internal Git repository / monorepo for the catalog
- [ ] Basic `idp` CLI to generate scaffolds locally

### Phase 2 — Expansion (Weeks 5–8)
- [ ] Add more AWS blueprints (ElastiCache, Secrets Manager, SSM, EventBridge, SNS alarms)
- [ ] Developer Portal (web UI) — basic catalog browsing + generation
- [ ] Scaffold versioning strategy
- [ ] Add GitLab CI support for pipelines
- [ ] Docs site for each scaffold and blueprint

### Phase 3 — Platform Intelligence (Weeks 9–12)
- [ ] Self-service portal: fill a form → generate repo → pipeline auto-runs
- [ ] Blueprint cost estimator (before deploying)
- [ ] Drift detection (detect when a service deviates from its golden path)
- [ ] Metrics dashboard (how many services use each scaffold/blueprint)

---

## 4. Scaffold Design: Node.js Backend

### Target Framework
**Express.js** (most familiar) or **Fastify** (better performance, built-in schema validation). Recommendation: **Fastify** with a flag for Express.

### Folder Structure
```
my-service/
├── src/
│   ├── routes/              # Route definitions — thin, just map HTTP to controllers
│   │   ├── index.js         # Route loader
│   │   └── health.route.js  # Example: /health endpoint
│   ├── controllers/         # Request/response handling, input validation
│   │   └── health.controller.js
│   ├── services/            # Business logic — pure functions, no HTTP knowledge
│   │   └── health.service.js
│   ├── dal/                 # Data Access Layer — DB/external calls
│   │   └── health.repository.js
│   ├── middlewares/
│   │   ├── auth.middleware.js       # JWT / API key validation
│   │   ├── sanitize.middleware.js   # Input sanitization (xss-clean, express-validator)
│   │   ├── cors.middleware.js       # CORS config per environment
│   │   └── rateLimiter.middleware.js
│   ├── exceptions/
│   │   ├── AppError.js             # Base error class
│   │   ├── NotFoundError.js
│   │   ├── ValidationError.js
│   │   └── UnauthorizedError.js
│   ├── handlers/
│   │   └── globalErrorHandler.js   # Catches all unhandled errors, formats response
│   ├── config/
│   │   ├── env.js                  # Validates and exports env vars (using Zod/joi)
│   │   ├── logger.js               # Winston/Pino logger setup
│   │   └── database.js             # DB connection setup (if applicable)
│   ├── utils/
│   │   └── response.helper.js      # Standardized API response format
│   └── app.js                      # App bootstrap (register plugins, routes, middleware)
├── tests/
│   ├── unit/
│   └── integration/
├── .github/
│   └── workflows/
│       ├── ci.yml                  # Lint, test, build on PR
│       └── cd.yml                  # Deploy on merge to main
├── infrastructure/                 # IaC for this service (linked blueprint)
│   └── README.md
├── .env.example
├── .eslintrc.js
├── .prettierrc
├── Dockerfile
├── docker-compose.yml              # Local dev with dependencies (DB, cache)
├── jest.config.js
└── package.json
```

### What's pre-built in the scaffold
| Feature | Implementation |
|---|---|
| Layered architecture | routes → controllers → services → DAL |
| Global error handler | Catches sync + async errors, formats JSON response |
| Custom error classes | AppError, NotFoundError, ValidationError, UnauthorizedError |
| Input sanitization | `express-mongo-sanitize` + `xss-clean` + schema validation |
| Structured logging | Pino logger with request ID correlation |
| CORS | Configurable per environment via env vars |
| Rate limiting | `express-rate-limit` or Fastify equivalent, configurable |
| Health check endpoint | `GET /health` returns status + version + uptime |
| Env validation | `zod` schema on startup — fails fast if required vars missing |
| Standardized responses | `{ success, data, error, meta }` envelope on all responses |
| Dockerfile | Multi-stage build (dev → build → prod) |
| CI/CD pipeline | GitHub Actions: lint → test → build → deploy |

---

## 5. Scaffold Design: Python / FastAPI

### Folder Structure
```
my-service/
├── app/
│   ├── api/
│   │   ├── v1/
│   │   │   ├── routes/          # FastAPI routers
│   │   │   │   └── health.py
│   │   │   └── __init__.py
│   │   └── dependencies.py      # FastAPI dependency injection (auth, db session)
│   ├── controllers/             # Request handling + response shaping
│   │   └── health_controller.py
│   ├── services/                # Business logic
│   │   └── health_service.py
│   ├── repositories/            # Data Access Layer
│   │   └── health_repository.py
│   ├── models/
│   │   ├── domain/              # Pydantic domain models
│   │   └── schemas/             # Request/response schemas
│   ├── core/
│   │   ├── config.py            # Settings via pydantic BaseSettings + .env
│   │   ├── logging.py           # Structured logging (structlog)
│   │   ├── security.py          # JWT / API key helpers
│   │   └── exceptions.py        # Custom exception classes
│   ├── middleware/
│   │   ├── cors.py
│   │   ├── logging_middleware.py # Request/response logging with trace ID
│   │   └── error_handler.py     # Global exception handler
│   ├── db/
│   │   └── session.py           # SQLAlchemy or DynamoDB session
│   └── main.py                  # FastAPI app factory
├── tests/
│   ├── unit/
│   └── integration/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── cd.yml
├── infrastructure/
│   └── README.md
├── .env.example
├── pyproject.toml               # Poetry / uv config
├── Dockerfile
└── docker-compose.yml
```

### What's pre-built in the scaffold
| Feature | Implementation |
|---|---|
| Layered architecture | routes → controllers → services → repositories |
| Global exception handler | FastAPI exception_handler for all custom exceptions |
| Custom exceptions | AppException, NotFoundError, ValidationError, UnauthorizedError |
| Input validation | Pydantic models on all request bodies |
| Structured logging | `structlog` with request ID (via middleware) |
| CORS | `CORSMiddleware` configurable via env vars |
| Settings management | `pydantic-settings` with `.env` support |
| Health check | `GET /health` with version, status, uptime |
| Standardized responses | Response envelope schema for all endpoints |
| API versioning | `/api/v1/` prefix baked in from start |
| Dockerfile | Multi-stage build with Poetry/uv |
| CI/CD pipeline | GitHub Actions: lint (ruff) → test → build → deploy |

---

## 6. CI/CD Pipeline Template (GitHub Actions)

### Node.js Pipeline (`ci.yml`)
**Triggers:** Push to any branch, PRs to `main`/`develop`

**Stages:**
1. **Lint & Format** — ESLint + Prettier check
2. **Unit Tests** — Jest with coverage threshold (≥80%)
3. **Integration Tests** — Spin up Docker Compose dependencies, run integration suite
4. **Security Scan** — `npm audit` + Snyk (optional)
5. **Build Docker Image** — Multi-stage build, tag with commit SHA
6. **Push to ECR** — (on `main` merge only)
7. **Deploy** — Trigger CDK/Terraform apply for target environment

### Python Pipeline (`ci.yml`)
**Stages:**
1. **Lint** — `ruff` + `black --check`
2. **Type Check** — `mypy`
3. **Unit Tests** — `pytest` with coverage threshold
4. **Integration Tests** — pytest with Docker Compose
5. **Security Scan** — `bandit` + `safety`
6. **Build Docker Image**
7. **Push to ECR**
8. **Deploy**

---

## 7. Infrastructure Blueprints — AWS

Each blueprint is an **AWS CDK stack (TypeScript)** — chosen for type safety, reuse, and developer familiarity. Terraform versions can be added in Phase 2.

### Blueprint Catalog (Phase 1)

#### Blueprint 1: `apigw-lambda-dynamodb`
**Use case:** Serverless REST API with NoSQL storage

**Resources included:**
- API Gateway (REST or HTTP API)
- Lambda function (Node.js 20.x or Python 3.12)
- DynamoDB table (PAY_PER_REQUEST billing)
- IAM roles with least-privilege policies
- CloudWatch Log Groups for Lambda
- X-Ray tracing enabled
- Basic CloudWatch Alarm (Lambda errors > threshold)

**Configurable parameters:**
- Table name, partition key, sort key (optional)
- Lambda memory and timeout
- API Gateway stage name
- Environment (dev/staging/prod)

---

#### Blueprint 2: `apigw-lambda-rds`
**Use case:** Serverless REST API with relational database

**Resources included:**
- API Gateway
- Lambda in VPC
- RDS (PostgreSQL or MySQL) in private subnet
- RDS Proxy (for connection pooling from Lambda)
- VPC with public/private subnets
- Security Groups (Lambda → RDS only)
- Secrets Manager secret for DB credentials
- CloudWatch Alarms (CPU, connections, storage)
- Automated backups enabled

---

#### Blueprint 3: `ecs-fargate-rds`
**Use case:** Containerized API (Node.js / FastAPI) with relational DB

**Resources included:**
- ECS Cluster + Fargate Service
- Application Load Balancer
- ECR repository
- RDS in private subnet
- VPC with public/private subnets
- Secrets Manager for DB credentials
- CloudWatch Container Insights
- Auto Scaling policy (CPU-based)
- CloudWatch Alarms (ALB 5xx, ECS CPU/memory)

---

#### Blueprint 4: `cache-layer` (Add-on)
**Use case:** Add ElastiCache Redis to an existing service

**Resources included:**
- ElastiCache Redis cluster (single-node for dev, Multi-AZ for prod)
- Security Group (app → Redis only)
- SSM Parameter Store entry with connection string
- CloudWatch Alarms (CPU, memory, evictions)

---

#### Blueprint 5: `event-driven` (Add-on)
**Use case:** Async processing with events

**Resources included:**
- EventBridge Event Bus
- SQS Queue (standard or FIFO) with DLQ
- Lambda consumer function
- SNS Topic for notifications/alerts
- IAM roles for producer and consumer

---

#### Blueprint 6: `secrets-and-config`
**Use case:** Secure secrets and configuration management

**Resources included:**
- Secrets Manager secrets (with rotation Lambda optional)
- SSM Parameter Store (SecureString for sensitive, String for config)
- IAM policies for fine-grained access per service
- CloudWatch Alarms for secret access anomalies

---

## 8. IDP CLI Tool (`idp`)

The CLI is the primary day-one interface for developers. Simple, fast, no portal needed.

### Commands
```bash
# List available scaffolds
idp scaffold list

# Generate a new Node.js service
idp scaffold new --type nodejs --name my-service --output ./

# Generate a new FastAPI service
idp scaffold new --type fastapi --name my-service --output ./

# List available infrastructure blueprints
idp blueprint list

# Preview a blueprint
idp blueprint info apigw-lambda-dynamodb

# Deploy a blueprint to an AWS environment
idp blueprint deploy apigw-lambda-dynamodb \
  --name my-table \
  --env dev \
  --region us-east-1
```

### Tech Stack for the CLI
- **Language:** Node.js (TypeScript)
- **CLI Framework:** `@oclif/core` or `commander.js`
- **Template engine:** `handlebars` or `ejs` for scaffold generation
- **Distribution:** npm private registry or GitHub Releases binary

---

## 9. Repository Structure (IDP Monorepo)

```
idp/
├── scaffolds/
│   ├── nodejs/          # Node.js scaffold template
│   └── fastapi/         # FastAPI scaffold template
├── blueprints/
│   ├── apigw-lambda-dynamodb/   # CDK stack
│   ├── apigw-lambda-rds/
│   ├── ecs-fargate-rds/
│   ├── cache-layer/
│   ├── event-driven/
│   └── secrets-and-config/
├── pipelines/
│   ├── nodejs/
│   │   ├── ci.yml
│   │   └── cd.yml
│   └── python/
│       ├── ci.yml
│       └── cd.yml
├── cli/                 # idp CLI source code
├── portal/              # (Phase 2) Developer Portal web app
├── docs/                # Documentation site (Docusaurus or similar)
└── README.md
```

---

## 10. Success Metrics

| Metric | Baseline (today) | Target (after IDP) |
|---|---|---|
| Time to first running service | Days | < 30 minutes |
| Time to infra provisioned | Hours–Days | < 15 minutes |
| % services with CI/CD from day 1 | Low | 100% |
| Developer NPS on setup experience | — | Measure quarterly |
| Onboarding time for new devs | — | Reduce by 60% |

---

## 11. Next Steps (Immediate Actions)

1. **Approve this plan** and align with the team on scope for Phase 1
2. **Create the IDP monorepo** in your internal Git (GitHub/GitLab/Bitbucket)
3. **Build the Node.js scaffold** — fully working, all layers, ready to clone and run
4. **Build the FastAPI scaffold** — same standard
5. **Build Blueprint 1** (`apigw-lambda-dynamodb`) as CDK stack
6. **Build Blueprint 2** (`ecs-fargate-rds`) as CDK stack
7. **Build the `idp` CLI** MVP — scaffold generation only
8. **Pilot with one internal team** — gather feedback, iterate

---

*Document version: 1.0 | Created: May 2026 | Owner: Platform Engineering*
