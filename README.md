<div align="center">

# Muslito 🍗

### Internal Developer Platform

**Golden paths and paved roads for your engineering team.**  
From idea to a running, production-ready service in minutes — not days.

[![License: MIT](https://img.shields.io/badge/License-MIT-7c3aed.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-≥20-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![AWS CDK](https://img.shields.io/badge/AWS_CDK-2.252.0-FF9900?logo=amazonaws&logoColor=white)](https://docs.aws.amazon.com/cdk)
[![Docs](https://img.shields.io/badge/Docs-Docusaurus-3ECC5F?logo=docusaurus&logoColor=white)](docs/)

</div>

---

## What is Muslito?

Muslito 🍗 is an Internal Developer Platform that provides **golden paths** — opinionated, pre-built, production-ready starting points for backend services and cloud infrastructure. Instead of spending days on boilerplate and cloud setup, developers pick a template, run one command, and start writing business logic immediately.

**What you get out of the box:**

- 🏗️ **Service scaffolds** — Node.js (Fastify) and FastAPI templates with layered architecture, structured logging, error handling, CORS, input sanitization, health checks, Docker, and CI/CD pipelines included.
- ☁️ **Infrastructure blueprints** — AWS CDK stacks for common cloud patterns: serverless APIs, containerised services, caching, event-driven processing, and secrets management.
- 🔄 **Reusable pipelines** — GitHub Actions and GitLab CI templates with lint → test → security → build → deploy stages, ready to copy.
- ⌨️ **IDP CLI** — `idp` command-line tool to generate services and deploy blueprints with a single command.
- 🌐 **Developer Portal** — Next.js web UI to browse and generate catalog items without touching the terminal.
- 📖 **Documentation site** — Full Docusaurus documentation covering every scaffold, blueprint, and pipeline.

---

## Repository structure

```
Muslito-IDP/
├── scaffolds/                   # Service templates
│   ├── nodejs/                  # Node.js / Fastify / TypeScript scaffold
│   └── fastapi/                 # Python / FastAPI scaffold
│
├── blueprints/                  # AWS CDK infrastructure stacks
│   ├── apigw-lambda-dynamodb/   # Serverless REST API + DynamoDB
│   ├── ecs-fargate-rds/         # ECS Fargate + ALB + RDS PostgreSQL
│   ├── cache-layer/             # ElastiCache Redis add-on
│   ├── event-driven/            # EventBridge + SQS + Lambda consumer
│   └── secrets-and-config/      # Secrets Manager + SSM + KMS
│
├── pipelines/                   # CI/CD pipeline templates
│   ├── nodejs/                  # GitHub Actions + GitLab CI for Node.js
│   └── python/                  # GitHub Actions + GitLab CI for Python
│
├── cli/                         # idp CLI source code (TypeScript)
├── portal/                      # Developer Portal (Next.js + Tailwind CSS)
├── docs/                        # Documentation site (Docusaurus v3)
└── README.md
```

---

## Prerequisites

Install the following before using the IDP:

| Tool | Version | Purpose |
|---|---|---|
| [Node.js](https://nodejs.org) | ≥ 20.x | CLI, scaffolds, CDK |
| [npm](https://www.npmjs.com) | ≥ 9.x | Package management |
| [Python](https://www.python.org) | ≥ 3.12 | FastAPI scaffold |
| [Docker](https://www.docker.com) | latest | Local dev + image builds |
| [AWS CLI](https://aws.amazon.com/cli/) | ≥ 2.x | Blueprint deployment |
| [Git](https://git-scm.com) | ≥ 2.x | Version control |

> **AWS credentials** are only required when deploying blueprints. Configure them with `aws configure` or via environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_DEFAULT_REGION`).

---

## Getting started

### 1 — Install the CLI

```bash
npm install -g @your-org/idp-cli
```

Verify:

```bash
idp --help
```

### 2 — Generate a service scaffold

```bash
# Node.js / Fastify service
idp scaffold new --type nodejs --name my-service

# Python / FastAPI service
idp scaffold new --type fastapi --name my-service
```

The CLI creates a `my-service/` directory with the full project structure, Dockerfile, docker-compose, and a GitHub Actions CI/CD pipeline.

### 3 — Run locally

```bash
cd my-service

# Node.js
npm install && cp .env.example .env && npm run dev

# Python
pip install -r requirements.txt && cp .env.example .env
uvicorn app.main:app --reload
```

Health check: [http://localhost:3000/health](http://localhost:3000/health) (Node.js) · [http://localhost:8000/health](http://localhost:8000/health) (Python)

### 4 — Deploy cloud infrastructure

```bash
# Serverless API + DynamoDB
idp blueprint deploy apigw-lambda-dynamodb \
  --name my-service --env dev --region us-east-1

# Containerised service + PostgreSQL
idp blueprint deploy ecs-fargate-rds \
  --name my-service --env dev --region us-east-1

# List all available blueprints
idp blueprint list
```

### 5 — Push and let CI run

```bash
git init && git add . && git commit -m "chore: initial scaffold"
git remote add origin https://github.com/your-org/my-service.git
git push -u origin main
```

GitHub Actions will automatically run lint → test → build → deploy on every push.

---

## CLI reference

```bash
# Scaffolds
idp scaffold list                                          # list available scaffold types
idp scaffold new --type <nodejs|fastapi> --name <name>    # generate a service
idp scaffold check [--path <path>]                        # check scaffold version

# Blueprints
idp blueprint list                                        # list available blueprints
idp blueprint info <id>                                   # show blueprint details
idp blueprint deploy <id> --name <n> --env <e> --region <r>  # deploy to AWS
```

---

## Scaffolds

| Type | Framework | Language | Key features |
|---|---|---|---|
| `nodejs` | Fastify 4 | TypeScript | Layered arch, Pino logging, Zod env validation, Vitest |
| `fastapi` | FastAPI | Python 3.12 | Layered arch, structlog, pydantic-settings, pytest |

Both scaffolds include: global error handler · custom error classes · input sanitization · CORS · rate limiting · health check endpoint · standardized response envelope · multi-stage Dockerfile · docker-compose · GitHub Actions CI/CD.

---

## Blueprints

| Blueprint | Use case | AWS services |
|---|---|---|
| `apigw-lambda-dynamodb` | Serverless REST API + NoSQL | API Gateway, Lambda, DynamoDB |
| `ecs-fargate-rds` | Containerised service + relational DB | ECS Fargate, ALB, RDS PostgreSQL 16 |
| `cache-layer` | Redis caching add-on | ElastiCache Redis 7 |
| `event-driven` | Async event processing | EventBridge, SQS, Lambda |
| `secrets-and-config` | Secrets + configuration management | Secrets Manager, SSM, KMS |

Every blueprint ships with: least-privilege IAM · CloudWatch alarms · encryption at rest · environment-aware settings (dev vs production) · CDK Outputs for cross-stack references.

---

## Tech stack

| Layer | Technology |
|---|---|
| **CLI** | Node.js 20, TypeScript, Commander.js, Handlebars, Chalk, Ora |
| **Scaffolds** | Fastify 4 (TS) · FastAPI (Python 3.12) |
| **Infrastructure** | AWS CDK 2.252.0 (TypeScript), constructs 10.6 |
| **Portal** | Next.js 14, React 18, Tailwind CSS, TypeScript |
| **Documentation** | Docusaurus 3.7, React 18, TypeScript |
| **CI/CD** | GitHub Actions · GitLab CI |
| **Cloud** | AWS (Lambda, ECS, RDS, DynamoDB, ElastiCache, EventBridge, SQS, Secrets Manager, SSM, KMS, CloudWatch) |

---

## Running the docs locally

```bash
cd docs
npm install
npm start          # → http://localhost:3000
```

## Running the portal locally

```bash
cd portal
npm install
npm run dev        # → http://localhost:3000
```

---

## Contributing

We welcome contributions — new scaffolds, blueprints, pipeline templates, and documentation improvements.

**Quick contribution flow:**

```bash
# 1. Fork and clone
git clone https://github.com/your-org/Muslito-IDP.git

# 2. Create a feature branch
git checkout -b feat/my-new-blueprint

# 3. Make your changes, then commit
git commit -m "feat: add my-new-blueprint"

# 4. Push and open a PR
git push origin feat/my-new-blueprint
```

See **[docs/contributing.md](docs/docs/contributing.md)** for detailed guidelines on:
- Adding new scaffold types
- Creating new CDK blueprints
- Blueprint conventions (naming, alarms, outputs, env-awareness)
- Updating documentation and sidebars

---

## License

[MIT](LICENSE) — built with ❤️ 🍗by Santiago Valle - @santiagovj22 - santiagovj0422@gmail.com
