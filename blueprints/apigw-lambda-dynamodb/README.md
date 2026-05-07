# Blueprint: apigw-lambda-dynamodb

Serverless REST API backed by DynamoDB.

## Architecture

```
Internet → API Gateway (HTTP API) → Lambda → DynamoDB
```

## Resources provisioned

- **API Gateway** (HTTP API) with CORS and stage
- **Lambda function** (Node.js 20.x) with X-Ray tracing
- **DynamoDB table** (PAY_PER_REQUEST) with encryption
- **CloudWatch Log Group** with configurable retention
- **CloudWatch Alarms** for Lambda errors and throttles
- **IAM roles** with least-privilege access

## Deploy

```bash
npm install
npm run build

# Deploy to dev
cdk deploy -c serviceName=my-api -c env=dev -c tableName=items

# Deploy to production
cdk deploy -c serviceName=my-api -c env=production -c tableName=items
```

## Configuration (cdk.json context)

| Key | Default | Description |
|---|---|---|
| `serviceName` | `my-service` | Name prefix for all resources |
| `env` | `dev` | Environment (dev/staging/production) |
| `region` | `us-east-1` | AWS region |
| `tableName` | `my-table` | DynamoDB table name suffix |
| `tablePartitionKey` | `pk` | DynamoDB partition key attribute |
| `tableSortKey` | — | DynamoDB sort key (optional) |
| `lambdaMemoryMb` | `512` | Lambda memory in MB |
| `lambdaTimeoutSeconds` | `30` | Lambda timeout in seconds |
| `apiStageName` | `v1` | API Gateway stage name |
| `alarmErrorThreshold` | `5` | Lambda error count before alarm fires |
