---
id: overview
title: CLI Reference
sidebar_position: 1
---

# IDP CLI Reference

The `idp` CLI is the primary interface for the Muslito Internal Developer Platform. Use it to generate service scaffolds, deploy infrastructure blueprints, and check for updates.

## Installation

```bash
npm install -g @muslito/idp-cli
```

## Global flags

| Flag | Description |
|---|---|
| `--help`, `-h` | Show help for any command |
| `--version`, `-v` | Print CLI version |

---

## Scaffold commands

### `idp scaffold list`

List all available scaffold types.

```bash
idp scaffold list
```

**Output:**

```
Available scaffolds:
  nodejs    Node.js / Fastify service (TypeScript)
  fastapi   Python / FastAPI service
```

---

### `idp scaffold new`

Generate a new service from a scaffold template.

```bash
idp scaffold new --type <type> --name <name> [options]
```

**Required flags:**

| Flag | Description |
|---|---|
| `--type` | Scaffold type: `nodejs` or `fastapi` |
| `--name` | Service name (used for folder name, package name, etc.) |

**Optional flags:**

| Flag | Default | Description |
|---|---|---|
| `--output` | `./` | Directory where the service folder is created |
| `--description` | `""` | Short description written into package.json / pyproject.toml |

**Examples:**

```bash
# Generate a Node.js service in the current directory
idp scaffold new --type nodejs --name user-service

# Generate a FastAPI service in a custom output folder with description
idp scaffold new \
  --type fastapi \
  --name payment-service \
  --output ./services \
  --description "Handles payment processing"
```

---

### `idp scaffold check`

Check whether a generated service is on the latest scaffold version.

```bash
idp scaffold check [--path <path>]
```

**Optional flags:**

| Flag | Default | Description |
|---|---|---|
| `--path` | `./` | Path to the service directory |

**Example:**

```bash
idp scaffold check --path ./services/my-service
```

---

## Blueprint commands

### `idp blueprint list`

List all available infrastructure blueprints.

```bash
idp blueprint list
```

**Output:**

```
Available blueprints:
  apigw-lambda-dynamodb   Serverless REST API + DynamoDB
  ecs-fargate-rds         Containerised service + PostgreSQL
  cache-layer             ElastiCache Redis add-on
  event-driven            EventBridge + SQS + Lambda consumer
  secrets-and-config      Secrets Manager + SSM Parameter Store
```

---

### `idp blueprint info`

Show details, parameters, and resource list for a specific blueprint.

```bash
idp blueprint info <blueprint-id>
```

**Example:**

```bash
idp blueprint info apigw-lambda-dynamodb
```

---

### `idp blueprint deploy`

Deploy an infrastructure blueprint to AWS.

```bash
idp blueprint deploy <blueprint-id> --name <name> --env <env> --region <region> [options]
```

**Required flags:**

| Flag | Description |
|---|---|
| `--name` | Service / resource name prefix |
| `--env` | Target environment (`dev`, `staging`, `production`) |
| `--region` | AWS region (e.g. `us-east-1`) |

**Optional flags (blueprint-specific):**

Refer to each blueprint's documentation page for its full list of configurable parameters passed via `--context` flags.

**Example:**

```bash
idp blueprint deploy apigw-lambda-dynamodb \
  --name my-api \
  --env dev \
  --region us-east-1
```

---

## Available scaffolds

| Type | Framework | Language |
|---|---|---|
| `nodejs` | Fastify 4 | TypeScript |
| `fastapi` | FastAPI | Python 3.12 |

## Available blueprints

| ID | Description |
|---|---|
| `apigw-lambda-dynamodb` | [Serverless REST API + DynamoDB](/docs/blueprints/apigw-lambda-dynamodb) |
| `ecs-fargate-rds` | [Containerised service + PostgreSQL](/docs/blueprints/ecs-fargate-rds) |
| `cache-layer` | [ElastiCache Redis add-on](/docs/blueprints/cache-layer) |
| `event-driven` | [EventBridge + SQS + Lambda](/docs/blueprints/event-driven) |
| `secrets-and-config` | [Secrets Manager + SSM](/docs/blueprints/secrets-and-config) |