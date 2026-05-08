# IDP CLI

Command-line tool for the Muslito Internal Developer Platform. Generate service scaffolds and deploy infrastructure blueprints.

## Setup

### 1. Install dependencies

```bash
cd cli
npm install
```

### 2. Build

```bash
npm run build
```

This compiles TypeScript to `dist/`. Re-run this command whenever you change the CLI source.

### 3. Link globally

```bash
npm link
```

This registers the `idp` command in your PATH so you can use it from any directory.

Verify it works:

```bash
idp --help
```

## Scaffold commands

```bash
# List available scaffolds
idp scaffold list

# Generate a new Node.js / Fastify service
idp scaffold new --type nodejs --name my-service

# Generate a new Python / FastAPI service
idp scaffold new --type fastapi --name my-service

# Optional: specify output directory and description
idp scaffold new --type nodejs --name my-service --output ./projects --description "User management service"

# Check if a generated service is on the latest scaffold version
idp scaffold check

# Check a service at a specific path
idp scaffold check --path ./projects/my-service
```

## Blueprint commands

```bash
# List available blueprints
idp blueprint list

# Show details for a blueprint
idp blueprint info apigw-lambda-dynamodb

# Deploy a blueprint to AWS
idp blueprint deploy apigw-lambda-dynamodb --name my-api --env dev --region us-east-1
```

## Available scaffolds

| Type | Framework | Language |
|---|---|---|
| `nodejs` | Fastify 4 | TypeScript |
| `fastapi` | FastAPI | Python 3.12 |

## Available blueprints

| ID | Description |
|---|---|
| `apigw-lambda-dynamodb` | Serverless REST API + DynamoDB |
| `ecs-fargate-rds` | Containerized service + PostgreSQL |
| `cache-layer` | ElastiCache Redis add-on |
| `event-driven` | EventBridge + SQS + Lambda |
| `secrets-and-config` | Secrets Manager + SSM |

## Notes

- The CLI resolves scaffold templates from the `scaffolds/` folder in the monorepo root. Do not move the `cli/` folder outside the monorepo.
- After running `idp scaffold new`, a `.idp.json` file is written to the generated service. This records the scaffold type and version used. Run `idp scaffold check` later to see if a newer version is available.
