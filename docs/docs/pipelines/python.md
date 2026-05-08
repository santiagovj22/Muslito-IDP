---
id: python
title: Python Pipeline
sidebar_position: 3
---

# Python CI/CD Pipeline

Located at `.github/workflows/ci.yml` and `cd.yml` in every FastAPI scaffold.

## CI Pipeline (`ci.yml`)

**Triggers:** Push to any branch; PR to `main` or `develop`.

### Stages

| Stage | Tool | Failure blocks merge? |
|---|---|---|
| Lint | `ruff check` | ✅ |
| Format check | `ruff format --check` | ✅ |
| Type check | `mypy app/` | ✅ |
| Unit tests | `pytest` (coverage ≥ 80%) | ✅ |
| Integration tests | `pytest` + Docker Compose | ✅ |
| Security scan | `bandit -r app/` + `safety check` | ✅ |
| Build | Docker multi-stage build | ✅ |

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
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
          cache: 'pip'
      - run: pip install -r requirements.txt
      - run: ruff check .
      - run: ruff format --check .
      - run: mypy app/
      - run: pytest --cov=app --cov-report=xml
      - run: bandit -r app/
      - run: safety check
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

The GitLab template mirrors the GitHub Actions stages using `image: python:3.12-slim` and the same ordering.