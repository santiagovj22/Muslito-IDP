---
id: apigw-lambda-dynamodb
title: API GW + Lambda + DynamoDB
sidebar_position: 2
---

# Blueprint: `apigw-lambda-dynamodb`

**Serverless REST API backed by NoSQL storage.**

## Architecture

```
Internet
   │
   ▼
API Gateway (HTTP API)
   │  CORS, stage routing
   ▼
Lambda Function (Node.js 20.x)
   │  X-Ray tracing, structured logs
   ▼
DynamoDB Table
   (on-demand billing, AWS-managed encryption)
```

## AWS resources provisioned

| Resource | Details |
|---|---|
| **API Gateway HTTP API** | CORS pre-flight, custom stage name |
| **Lambda Function** | Node.js 20.x, X-Ray tracing enabled |
| **CloudWatch Log Group** | Retention: 1 week (dev) / 3 months (prod) |
| **DynamoDB TableV2** | On-demand billing, AWS-managed encryption |
| **IAM Role** | Least-privilege DynamoDB read/write only |
| **CloudWatch Alarms** | Lambda errors + throttles |

## Deploy

```bash
idp blueprint deploy apigw-lambda-dynamodb \
  --name my-api \
  --env dev \
  --region us-east-1
```

Or directly with CDK:

```bash
cd blueprints/apigw-lambda-dynamodb
npm install
cdk deploy \
  -c serviceName=my-api \
  -c env=dev \
  -c region=us-east-1 \
  -c tableName=items
```

## Context parameters

| Parameter | Required | Default | Description |
|---|---|---|---|
| `serviceName` | ✅ | — | Service name prefix for all resources |
| `env` | ✅ | — | `dev`, `staging`, or `production` |
| `region` | ✅ | — | AWS region |
| `tableName` | ✅ | — | DynamoDB table name suffix |
| `tablePartitionKey` | No | `pk` | Partition key attribute name |
| `tableSortKey` | No | — | Sort key attribute name (omit if not needed) |
| `lambdaMemoryMb` | No | `512` | Lambda memory in MB |
| `lambdaTimeoutSeconds` | No | `30` | Lambda timeout in seconds |
| `apiStageName` | No | `v1` | API Gateway stage name |
| `alarmErrorThreshold` | No | `5` | Lambda error count to trigger alarm |

## Outputs

| Output | Description |
|---|---|
| `ApiUrl` | API Gateway base URL + stage |
| `TableName` | DynamoDB table name |
| `LambdaArn` | Lambda function ARN |

## Production vs dev differences

| Setting | Dev | Production |
|---|---|---|
| PITR (point-in-time recovery) | Disabled | Enabled |
| Table removal policy | `DESTROY` | `RETAIN` |
| Log retention | 1 week | 3 months |
| CORS allowed origins | `*` | `https://your-domain.com` |