---
id: quickstart
title: Quick Start
sidebar_position: 2
---

# Quick Start

Get from zero to a running service with CI/CD and cloud infrastructure in under 30 minutes.

## 1. Install the CLI

```bash
npm install -g @muslito/idp-cli
```

## 2. Generate a service scaffold

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="nodejs" label="Node.js / Fastify" default>

```bash
idp scaffold new --type nodejs --name my-service
```

  </TabItem>
  <TabItem value="fastapi" label="Python / FastAPI">

```bash
idp scaffold new --type fastapi --name my-service
```

  </TabItem>
</Tabs>

The CLI will generate a new directory `my-service/` with:
- Full project structure (routes → controllers → services → repositories)
- Dockerfile and docker-compose for local dev
- GitHub Actions CI/CD pipeline
- `.env.example` with all required variables

## 3. Start developing

```bash
cd my-service
npm install      # or: pip install -r requirements.txt
cp .env.example .env
npm run dev      # or: uvicorn app.main:app --reload
```

Open [http://localhost:3000/health](http://localhost:3000/health) to verify.

## 4. Deploy infrastructure

Choose the blueprint that matches your service's data needs:

```bash
# Serverless API + DynamoDB
idp blueprint deploy apigw-lambda-dynamodb \
  --name my-service \
  --env dev \
  --region us-east-1

# Containerised service + PostgreSQL
idp blueprint deploy ecs-fargate-rds \
  --name my-service \
  --env dev \
  --region us-east-1
```

## 5. Push and watch CI run

```bash
git init
git add .
git commit -m "chore: initial scaffold"
git remote add origin https://github.com/your-org/my-service.git
git push -u origin main
```

Your GitHub Actions workflow will automatically run lint → test → build → deploy.

---

## What's next?

- Read the [CLI Reference](/docs/cli/overview) for all available commands
- Browse [Scaffolds](/docs/scaffolds/overview) to understand what's included
- Explore [Blueprints](/docs/blueprints/overview) to pick the right infrastructure stack