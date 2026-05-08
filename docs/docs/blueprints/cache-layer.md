---
id: cache-layer
title: Cache Layer (Redis)
sidebar_position: 4
---

# Blueprint: `cache-layer`

**Add a managed Redis cluster to any existing service.**

This is an **add-on blueprint**. It is designed to be deployed alongside an existing service blueprint (e.g., `ecs-fargate-rds`). It reads your existing VPC and security group IDs and provisions ElastiCache Redis in the same network.

## Architecture

```
Existing App (ECS / Lambda)
   │
   │  port 6379
   ▼
ElastiCache Redis (private subnet)
   │  TLS + at-rest encryption
   │
   ▼
SSM Parameter Store
(/service/env/redis/url)
```

## AWS resources provisioned

| Resource | Details |
|---|---|
| **ElastiCache Replication Group** | Redis 7.1, configurable node type |
| **Subnet Group** | Placed in VPC private subnets |
| **Security Group** | Only allows ingress from your app SG |
| **SSM Parameter** | Redis connection URL stored at `/service/env/redis/url` |
| **CloudWatch Alarms** | CPU, memory usage, evictions |

## Deploy

```bash
idp blueprint deploy cache-layer \
  --name my-service \
  --env dev \
  --region us-east-1
```

## Context parameters

| Parameter | Default | Description |
|---|---|---|
| `serviceName` | ✅ required | Service name prefix |
| `env` | ✅ required | `dev` / `staging` / `production` |
| `region` | ✅ required | AWS region |
| `redisNodeType` | `cache.t4g.micro` | ElastiCache node type |
| `redisEngineVersion` | `7.1` | Redis engine version |
| `multiAz` | `false` | Enable Multi-AZ with automatic failover |
| `numCacheClusters` | `1` | Number of replica nodes (min 2 if multiAz=true) |
| `vpcId` | — | Import an existing VPC (creates minimal VPC if omitted) |
| `appSecurityGroupId` | — | App SG that is allowed to connect to Redis |

## Outputs

| Output | Description |
|---|---|
| `RedisPrimaryEndpoint` | Redis primary endpoint address |
| `RedisUrlParamName` | SSM Parameter name holding the connection URL |

## Reading the connection URL in your service

```bash
aws ssm get-parameter \
  --name "/my-service/dev/redis/url" \
  --with-decryption \
  --query "Parameter.Value" \
  --output text
```