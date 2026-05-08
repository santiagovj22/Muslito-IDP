---
id: event-driven
title: Event-Driven
sidebar_position: 5
---

# Blueprint: `event-driven`

**Asynchronous event processing with EventBridge, SQS, and a Lambda consumer.**

## Architecture

```
Producer (any service)
   │  PutEvents
   ▼
EventBridge Event Bus
   │  Rule: source=serviceName → SQS
   ▼
SQS Queue (main)
   │  visibility timeout, DLQ after N failures
   ▼
Lambda Consumer
   │  batch processing, partial batch failure support
   ▼
Dead Letter Queue (if all retries exhausted)
```

## AWS resources provisioned

| Resource | Details |
|---|---|
| **EventBridge Event Bus** | Custom bus named `service-env-main` |
| **EventBridge Rule** | Routes events by source to SQS |
| **SQS Queue** | Configurable visibility timeout, SQS-managed encryption |
| **Dead Letter Queue** | Messages that fail N times land here |
| **Lambda Consumer** | Node.js 20.x, batch size 10, partial failure support |
| **SNS Alert Topic** | For alarm notifications |
| **CloudWatch Alarms** | DLQ depth, queue age, Lambda errors |
| **Event Archive** | (production only) 90-day event archive for replay |

## Deploy

```bash
idp blueprint deploy event-driven \
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
| `eventBusName` | `main` | Event bus name suffix |
| `queueVisibilityTimeoutSeconds` | `300` | SQS visibility timeout |
| `maxReceiveCount` | `3` | Retries before sending to DLQ |
| `lambdaMemoryMb` | `256` | Consumer Lambda memory |
| `lambdaTimeoutSeconds` | `60` | Consumer Lambda timeout |
| `alarmErrorThreshold` | `5` | Lambda error count to trigger alarm |

## Outputs

| Output | Description |
|---|---|
| `EventBusName` | EventBridge bus name |
| `QueueUrl` | Main SQS queue URL |
| `DlqUrl` | Dead letter queue URL |
| `AlertTopicArn` | SNS topic ARN for alerts |

## Publishing events (producer side)

```typescript
import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";

const client = new EventBridgeClient({ region: "us-east-1" });

await client.send(new PutEventsCommand({
  Entries: [{
    EventBusName: "my-service-dev-main",
    Source: "my-service",
    DetailType: "order.created",
    Detail: JSON.stringify({ orderId: "123", amount: 99.99 }),
  }],
}));
```