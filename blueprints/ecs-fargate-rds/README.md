# Blueprint: ecs-fargate-rds

Containerized service on ECS Fargate with an ALB and PostgreSQL RDS.

## Architecture

```
Internet → ALB (public) → ECS Fargate (private) → RDS PostgreSQL (isolated)
                                  ↓
                         Secrets Manager (DB creds)
                         CloudWatch Container Insights
```

## Resources provisioned

- **VPC** with public / private / isolated subnets (multi-AZ)
- **ECR Repository** for container images
- **ECS Cluster** (Fargate, Container Insights enabled)
- **Fargate Service** with ALB
- **Auto Scaling** — CPU and memory-based
- **RDS PostgreSQL 16** in isolated subnet, encrypted, with automated backups
- **Secrets Manager** secret for DB credentials
- **Security Groups** — least-privilege (app → DB only)
- **CloudWatch Log Group** for container logs
- **CloudWatch Alarms** — ALB 5xx, ECS CPU, RDS CPU

## Deploy

```bash
npm install
npm run build

# Deploy to dev
cdk deploy -c serviceName=my-api -c env=dev -c ecrImageTag=abc1234

# Deploy to production
cdk deploy -c serviceName=my-api -c env=production -c ecrImageTag=v1.2.3
```

## Configuration (cdk.json context)

| Key | Default | Description |
|---|---|---|
| `serviceName` | `my-service` | Name prefix for all resources |
| `env` | `dev` | Environment (dev/staging/production) |
| `region` | `us-east-1` | AWS region |
| `containerPort` | `8000` | Port the container listens on |
| `containerCpu` | `512` | Fargate task CPU units |
| `containerMemoryMb` | `1024` | Fargate task memory in MB |
| `desiredCount` | `2` | Initial task count |
| `minCapacity` | `1` | Auto-scale minimum |
| `maxCapacity` | `10` | Auto-scale maximum |
| `dbName` | `appdb` | PostgreSQL database name |
| `dbInstanceClass` | `t4g.small` | RDS instance type |
| `ecrImageTag` | `latest` | Docker image tag to deploy |
| `healthCheckPath` | `/api/v1/health` | ALB health check path |
