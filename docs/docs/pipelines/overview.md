---
id: overview
title: Pipelines Overview
sidebar_position: 1
---

# Pipelines

Reusable CI/CD pipeline templates for GitHub Actions and GitLab CI. Every scaffold ships with these templates pre-configured in `.github/workflows/`.

## Available templates

| Stack | CI | CD | GitLab |
|---|---|---|---|
| [Node.js](/docs/pipelines/nodejs) | `ci.yml` | `cd.yml` | `gitlab-ci.yml` |
| [Python](/docs/pipelines/python) | `ci.yml` | `cd.yml` | `gitlab-ci.yml` |

## CI pipeline stages (all stacks)

```
Push / PR
   │
   ├── Lint & Format
   ├── Type Check
   ├── Unit Tests (coverage ≥ 80%)
   ├── Integration Tests
   ├── Security Scan
   └── Build Docker Image
```

## CD pipeline stages (all stacks)

```
Merge to main
   │
   ├── Build & tag Docker image (commit SHA)
   ├── Push to ECR
   └── Deploy (CDK / blueprint deploy)
```

## Trigger strategy

| Branch | CI | CD |
|---|---|---|
| Any branch | ✅ | ❌ |
| PR → `main` | ✅ | ❌ |
| Merge to `main` | ✅ | ✅ |

## Required secrets (GitHub)

| Secret | Description |
|---|---|
| `AWS_ACCESS_KEY_ID` | AWS credentials for ECR push + CDK deploy |
| `AWS_SECRET_ACCESS_KEY` | AWS credentials |
| `AWS_REGION` | Target region (e.g. `us-east-1`) |
| `ECR_REPOSITORY` | Full ECR repository URI |