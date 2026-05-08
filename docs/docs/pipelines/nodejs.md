---
id: nodejs
title: Node.js Pipeline
sidebar_position: 2
---

# Node.js CI/CD Pipeline

Located at `.github/workflows/ci.yml` and `cd.yml` in every Node.js scaffold.

## CI Pipeline (`ci.yml`)

**Triggers:** Push to any branch; PR to `main` or `develop`.

### Stages

| Stage | Tool | Failure blocks merge? |
|---|---|---|
| Lint | ESLint + Prettier | ✅ |
| Type check | `tsc --noEmit` | ✅ |
| Unit tests | Jest (coverage ≥ 80%) | ✅ |
| Integration tests | Jest + Docker Compose | ✅ |
| Security scan | `npm audit --audit-level=high` | ✅ |
| Build | `npm run build` | ✅ |

### Example workflow snippet

```yaml
name: CI

on:
  push:
    branches: ['**']
  pull_request:
    branches: [main, develop]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit
      - run: npm test -- --coverage
      - run: npm audit --audit-level=high
      - run: npm run build
```

## CD Pipeline (`cd.yml`)

**Triggers:** Push to `main` branch only.

### Stages

1. Build multi-stage Docker image tagged with commit SHA
2. Push to Amazon ECR
3. Deploy via `idp blueprint deploy` or `cdk deploy`

### Required secrets

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
ECR_REPOSITORY
```

## GitLab CI (`gitlab-ci.yml`)

The GitLab template mirrors the GitHub Actions stages using GitLab CI syntax. It uses `image: node:20` and the same stage ordering.