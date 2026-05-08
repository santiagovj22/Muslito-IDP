---
id: overview
title: Blueprints Overview
sidebar_position: 1
---

# Blueprints

Blueprints are AWS CDK stacks that provision complete, production-ready infrastructure patterns. Pick the blueprint that matches your service's data and compute needs, and deploy in minutes.

## Available blueprints

| Blueprint | Use case | Key services |
|---|---|---|
| [`apigw-lambda-dynamodb`](/docs/blueprints/apigw-lambda-dynamodb) | Serverless REST API + NoSQL | API Gateway, Lambda, DynamoDB |
| [`ecs-fargate-rds`](/docs/blueprints/ecs-fargate-rds) | Containerised service + relational DB | ECS Fargate, ALB, RDS PostgreSQL |
| [`cache-layer`](/docs/blueprints/cache-layer) | Redis caching add-on | ElastiCache Redis |
| [`event-driven`](/docs/blueprints/event-driven) | Async event processing | EventBridge, SQS, Lambda |
| [`secrets-and-config`](/docs/blueprints/secrets-and-config) | Secrets + configuration | Secrets Manager, SSM, KMS |

## What every blueprint includes

- ✅ **Least-privilege IAM** — roles and policies scoped to exactly what each resource needs
- ✅ **CloudWatch Alarms** — error rate, CPU, memory, and latency alarms pre-configured
- ✅ **Encryption at rest** — storage and secrets encrypted with AWS-managed or customer-managed keys
- ✅ **Environment-aware** — production settings (multi-AZ, backups, retention) differ from dev
- ✅ **CDK Outputs** — key ARNs, endpoints, and names exported for cross-stack references

## Deploy a blueprint

```bash
idp blueprint deploy <blueprint-id> \
  --name <service-name> \
  --env <dev|staging|production> \
  --region <aws-region>
```

## CDK context parameters

Every blueprint is configured through CDK context variables. You can pass them via the CLI or a `cdk.json` file in the blueprint directory.

```bash
# Using the CLI
idp blueprint deploy apigw-lambda-dynamodb \
  --name my-api \
  --env dev

# Using CDK directly
cd blueprints/apigw-lambda-dynamodb
cdk deploy -c serviceName=my-api -c env=dev -c region=us-east-1
```

## Blueprint stacks and CDK

Each blueprint is a standalone AWS CDK TypeScript project in the `blueprints/` folder. You can deploy blueprints directly with `cdk deploy` if you prefer not to use the CLI.

```bash
cd blueprints/apigw-lambda-dynamodb
npm install
cdk synth     # Preview CloudFormation template
cdk diff      # Diff against deployed stack
cdk deploy    # Deploy to AWS
```