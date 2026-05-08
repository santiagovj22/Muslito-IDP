---
id: intro
title: Introduction
sidebar_position: 1
---

# Muslito Internal Developer Platform

> **Golden paths and paved roads for your engineering team.**

Muslito IDP eliminates environment-setup friction and infrastructure toil so developers focus exclusively on business logic. Instead of spending days configuring projects and provisioning cloud resources, developers pick a pre-built, production-ready starting point and are running in minutes.

## What is a Golden Path?

A golden path is an opinionated, pre-approved, fully configured path from idea to production. It is:

- **Easy** — the happy path, not the only path. Advanced users can still customize.
- **Safe** — security, observability, and compliance are baked in, not bolted on.
- **Fast** — from `idp scaffold new` to a running CI/CD pipeline in under 30 minutes.

## Platform Components

| Component | What it gives you |
|---|---|
| **CLI (`idp`)** | Generate services & deploy blueprints from the terminal |
| **Scaffolds** | Production-ready app templates (Node.js / FastAPI) |
| **Blueprints** | AWS CDK infrastructure stacks, ready to deploy |
| **Pipelines** | Reusable GitHub Actions & GitLab CI templates |
| **Portal** | Web UI for browsing and generating catalog items |

## Core Principles

- **Convention over configuration** — sensible defaults are baked in; only change what matters to your domain.
- **Everything as code** — scaffolds, blueprints, and pipelines are version-controlled and auditable.
- **Self-service** — no tickets to get a new service or infra resource.
- **Production-ready by default** — logging, error handling, security, observability, and CI/CD ship with every golden path.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│               IDP — Developer Portal / CLI                   │
│         (Web UI + idp CLI — entry points for devs)          │
└─────────────────────┬───────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
 ┌──────▼──────┐ ┌────▼────────┐ ┌─▼───────────┐
 │  Scaffolds  │ │  Blueprints │ │  Pipelines  │
 │  Catalog    │ │  Catalog    │ │  Templates  │
 │             │ │             │ │             │
 │ • Node.js   │ │ • APIGW+    │ │ • GitHub    │
 │ • FastAPI   │ │   Lambda+   │ │   Actions   │
 └─────────────┘ │   DynamoDB  │ │ • GitLab CI │
                 │ • ECS+RDS   │ └─────────────┘
                 │ • Cache     │
                 │ • Events    │
                 │ • Secrets   │
                 └─────────────┘
```

## Quick Navigation

- 🚀 [Quick Start](/docs/getting-started/quickstart) — up and running in 5 minutes
- ⌨️ [CLI Reference](/docs/cli/overview) — all commands and flags
- 🏗️ [Scaffolds](/docs/scaffolds/overview) — service templates
- ☁️ [Blueprints](/docs/blueprints/overview) — infrastructure stacks
- 🔄 [Pipelines](/docs/pipelines/overview) — CI/CD templates
- 🤝 [Contributing](/docs/contributing) — how to add new catalog items