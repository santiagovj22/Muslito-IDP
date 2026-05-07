# Blueprint: cache-layer

Add-on that provisions an **ElastiCache Redis** cluster for any existing service.

## Architecture

```
App (ECS/Lambda) → Security Group → ElastiCache Redis (private subnet)
                                          ↓
                                  SSM Parameter Store (redis URL)
                                  CloudWatch Alarms (CPU, memory, evictions)
```

## Resources provisioned
- ElastiCache Redis replication group (encrypted at rest + in transit)
- Security Group (app → Redis 6379 only)
- SSM Parameter Store entry: `/<service>/<env>/redis/url`
- CloudWatch Alarms: CPU, memory usage, evictions

## Deploy

```bash
npm install && npm run build

# Add to an existing service (pass the app SG ID for tight security)
cdk deploy \
  -c serviceName=my-service \
  -c env=dev \
  -c vpcId=vpc-xxxxxxxx \
  -c appSecurityGroupId=sg-xxxxxxxx
```

## Config

| Key | Default | Description |
|---|---|---|
| `redisNodeType` | `cache.t4g.micro` | ElastiCache node type |
| `redisEngineVersion` | `7.1` | Redis engine version |
| `multiAz` | `false` | Enable Multi-AZ + auto-failover (production) |
| `numCacheClusters` | `1` | Number of replica nodes |
| `vpcId` | — | Import existing VPC (optional) |
| `appSecurityGroupId` | — | App SG allowed to reach Redis |
