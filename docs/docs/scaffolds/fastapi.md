---
id: fastapi
title: Python / FastAPI Scaffold
sidebar_position: 3
---

# Python / FastAPI Scaffold

A production-ready Python API built on [FastAPI](https://fastapi.tiangolo.com/) with Pydantic v2 and structlog.

## Generate

```bash
idp scaffold new --type fastapi --name my-service
```

## Project structure

```
my-service/
├── app/
│   ├── api/
│   │   ├── v1/
│   │   │   ├── routes/
│   │   │   │   └── health.py
│   │   │   └── __init__.py
│   │   └── dependencies.py   # FastAPI dependency injection
│   ├── controllers/
│   │   └── health_controller.py
│   ├── services/
│   │   └── health_service.py
│   ├── repositories/
│   │   └── health_repository.py
│   ├── models/
│   │   ├── domain/           # Pydantic domain models
│   │   └── schemas/          # Request / response schemas
│   ├── core/
│   │   ├── config.py         # pydantic-settings — loads from .env
│   │   ├── logging.py        # structlog with request-ID middleware
│   │   ├── security.py       # JWT / API key helpers
│   │   └── exceptions.py     # Custom exception classes
│   ├── middleware/
│   │   ├── cors.py
│   │   ├── logging_middleware.py
│   │   └── error_handler.py
│   └── main.py               # FastAPI app factory
├── tests/
│   ├── unit/
│   └── integration/
├── .github/workflows/
│   ├── ci.yml
│   └── cd.yml
├── .env.example
├── pyproject.toml
├── Dockerfile
└── docker-compose.yml
```

## What's included

### Settings management

```python
from app.core.config import settings

# settings.database_url, settings.cors_origins, etc.
# All loaded from .env via pydantic-settings
```

### Global exception handler

```python
raise NotFoundException("Order not found")
# → 404 { "success": false, "error": { "code": "NOT_FOUND", "message": "Order not found" } }
```

### Structured logging

Every request gets a unique `request_id` injected into the logging context via middleware. All log lines include it automatically — no manual passing required.

### API versioning

All endpoints live under `/api/v1/`. Adding v2 is just adding a new router under `app/api/v2/`.

## Running locally

```bash
cd my-service
pip install -r requirements.txt   # or: uv sync
cp .env.example .env
uvicorn app.main:app --reload
```

Open [http://localhost:8000/health](http://localhost:8000/health) or [http://localhost:8000/docs](http://localhost:8000/docs) for interactive Swagger UI.

## Scripts

| Command | Description |
|---|---|
| `uvicorn app.main:app --reload` | Start with hot-reload |
| `pytest` | Run tests |
| `ruff check .` | Lint |
| `mypy app/` | Type check |

## Environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `APP_ENV` | No | `development` | `development` / `production` |
| `PORT` | No | `8000` | HTTP port |
| `LOG_LEVEL` | No | `INFO` | structlog level |
| `CORS_ORIGINS` | No | `*` | Allowed origins (comma-separated) |