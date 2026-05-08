---
id: ecs-fargate-rds
title: ECS Fargate + RDS
sidebar_position: 3
---

# Blueprint: `ecs-fargate-rds`

**Containerised service running behind an Application Load Balancer, backed by a managed PostgreSQL database.**

## Architecture

```
Internet
   │
   ▼
Application Load Balancer (port 80)
   │  health checks, target group
   ▼
ECS Fargate Service  ──────────────────────┐
   │  auto scaling (CPU & memory)          │
   │  Container Insights enabled           │
   ▼                                       │
ECR Repository                             │
(container images)                         │
                                           ▼
                            RDS PostgreSQL 16 (private subnet)
                            (secrets in Secrets Manager)
```

## AWS resources provisioned

| Resource | Details |
|---|---|
| **VPC** | Public + Private + Isolated subnets, configurable AZs |
| **ECR Repository** | Private image registry |
| **ECS Cluster** | Container Insights enabled |
| **Fargate Task** | Configurable CPU / memory |
| **ALB** | Public, HTTP listener, health check path |
| **RDS PostgreSQL 16** | Private subnet, encrypted, automated backups |
| **Secrets Manager** | Auto-generated DB credentials |
| **Security Groups** | App → DB only; ALB → App only |
| **Auto Scaling** | CPU (70%) and memory (80%) target tracking |
| **CloudWatch Alarms** | ALB 5xx, ECS CPU, RDS CPU |

## Deploy

```bash
idp blueprint deploy ecs-fargate-rds \
  --name my-app \
  --env dev \
  --region us-east-1
```

## Context parameters

| Parameter | Default | Description |
|---|---|---|
| `serviceName` | ✅ required | Service name prefix |
| `env` | ✅ required | `dev` / `staging` / `production` |
| `region` | ✅ required | AWS region |
| `containerPort` | `8000` | Application port inside container |
| `containerCpu` | `512` | Fargate task CPU units |
| `containerMemoryMb` | `1024` | Fargate task memory (MB) |
| `desiredCount` | `2` | Initial task count |
| `minCapacity` | `1` | Auto scaling minimum |
| `maxCapacity` | `10` | Auto scaling maximum |
| `dbName` | `appdb` | PostgreSQL database name |
| `dbInstanceClass` | `t4g.small` | RDS instance class |
| `dbAllocatedStorageGb` | `20` | Initial storage (GB) |
| `dbMaxAllocatedStorageGb` | `100` | Max auto-scaled storage (GB) |
| `ecrImageTag` | `latest` | Image tag to deploy |
| `healthCheckPath` | `/api/v1/health` | ALB + container health check path |

## Outputs

| Output | Description |
|---|---|
| `AlbDnsName` | Load balancer DNS name |
| `EcrRepoUri` | ECR repository URI for pushing images |
| `DbEndpoint` | RDS endpoint address |
| `DbSecretArn` | Secrets Manager ARN for DB credentials |

## Production vs dev differences

| Setting | Dev | Production |
|---|---|---|
| VPC AZs | 2 | 3 |
| NAT Gateways | 1 | 2 |
| RDS Multi-AZ | No | Yes |
| RDS backup retention | 1 day | 7 days |
| RDS deletion protection | No | Yes |
| ECR removal policy | `DESTROY` | `RETAIN` |