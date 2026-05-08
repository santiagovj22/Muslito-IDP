---
id: secrets-and-config
title: Secrets & Config
sidebar_position: 6
---

# Blueprint: `secrets-and-config`

**Centralised secrets management and configuration with fine-grained IAM access control.**

## Architecture

```
Service IAM Role
   │  decrypt (KMS) + secretsmanager:GetSecretValue
   ▼
Customer Managed KMS Key
   │  encrypts all secrets
   ▼
Secrets Manager Secrets     SSM Parameter Store
  /service/env/secret-name    /service/env/param-name
   │
   └── Optional: automatic rotation Lambda
```

## AWS resources provisioned

| Resource | Details |
|---|---|
| **KMS Customer Managed Key** | Encrypts all secrets, key rotation enabled |
| **IAM Service Role** | Assume by Lambda / ECS tasks — access scoped to this service |
| **Secrets Manager Secrets** | One per `secrets` context entry, with optional auto-rotation |
| **SSM String Parameters** | One per `parameters` context entry |
| **IAM Explicit Deny** | Service role is denied access to secrets it doesn't own |

## Deploy

```bash
idp blueprint deploy secrets-and-config \
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
| `secrets` | `[]` | Array of `{ name, description }` objects |
| `parameters` | `[]` | Array of `{ name, value, description }` objects |
| `enableRotation` | `false` | Enable automatic secret rotation |
| `rotationDays` | `30` | Rotation interval in days |

### Example `cdk.json` context

```json
{
  "context": {
    "serviceName": "my-service",
    "env": "production",
    "region": "us-east-1",
    "secrets": [
      { "name": "api-key", "description": "Third-party API key" },
      { "name": "jwt-secret", "description": "JWT signing secret" }
    ],
    "parameters": [
      { "name": "feature-flags", "value": "{\"newCheckout\": true}", "description": "Feature flags" }
    ],
    "enableRotation": true,
    "rotationDays": 30
  }
}
```

## Outputs

| Output | Description |
|---|---|
| `KmsKeyArn` | CMK ARN |
| `ServiceRoleArn` | IAM role ARN for the service to assume |
| `SecretArn-<name>` | ARN per provisioned secret |
| `ParamName-<name>` | SSM parameter name per provisioned parameter |

## Reading a secret in code

```typescript
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({ region: "us-east-1" });
const response = await client.send(new GetSecretValueCommand({
  SecretId: "/my-service/production/api-key",
}));
const secret = response.SecretString;
```