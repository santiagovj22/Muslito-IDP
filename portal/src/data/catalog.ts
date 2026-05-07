// ─── Types ────────────────────────────────────────────────────────────────────

export interface Scaffold {
  id: string;
  name: string;
  language: string;
  framework: string;
  description: string;
  tags: string[];
  features: string[];
  stack: { tool: string; purpose: string }[];
  quickstart: { label: string; command: string }[];
  structure: { path: string; description: string }[];
}

export interface Blueprint {
  id: string;
  name: string;
  category: 'serverless' | 'containers' | 'addon' | 'data';
  description: string;
  tags: string[];
  resources: string[];
  architecture: string; // ASCII diagram
  configKeys: { key: string; default: string; description: string }[];
  deployCommand: string;
}

// ─── Scaffolds catalog ────────────────────────────────────────────────────────

export const scaffolds: Scaffold[] = [
  {
    id: 'nodejs',
    name: 'Node.js / Fastify',
    language: 'TypeScript',
    framework: 'Fastify 4',
    description:
      'Production-ready TypeScript backend with a strict layered architecture. Everything you need to ship business logic — error handling, logging, security, and CI/CD are all pre-wired.',
    tags: ['Node.js', 'TypeScript', 'Fastify', 'REST', 'ESM'],
    features: [
      'Strict TypeScript (ES2022, verbatimModuleSyntax)',
      'Layered architecture: routes → controllers → services → DAL',
      'Global error handler with typed AppError subclasses',
      'Pino structured logging with request-ID correlation',
      'Zod-validated environment variables (fail-fast on startup)',
      'Input sanitization (XSS + NoSQL injection)',
      'CORS, Helmet, Rate limiting pre-configured',
      'Standardized { success, data, message } response envelope',
      'Vitest unit + integration tests with coverage',
      'tsx hot-reload in dev, multi-stage Dockerfile for prod',
      'GitHub Actions & GitLab CI pipelines included',
    ],
    stack: [
      { tool: 'Node.js 22', purpose: 'Runtime (LTS)' },
      { tool: 'TypeScript 5', purpose: 'Strict mode, ES2022 target' },
      { tool: 'Fastify 4', purpose: 'HTTP framework' },
      { tool: 'Zod', purpose: 'Runtime env validation' },
      { tool: 'Pino', purpose: 'Structured JSON logging' },
      { tool: 'Vitest', purpose: 'Unit + integration tests' },
      { tool: 'tsx', purpose: 'Zero-config dev runner' },
      { tool: 'ESLint 9 + Prettier', purpose: 'Lint + format' },
    ],
    quickstart: [
      { label: 'Install', command: 'npm install' },
      { label: 'Configure', command: 'cp .env.example .env' },
      { label: 'Start dev', command: 'npm run dev' },
      { label: 'Health check', command: 'curl http://localhost:3000/api/v1/health' },
    ],
    structure: [
      { path: 'src/types/', description: 'Shared TypeScript interfaces & Fastify augmentations' },
      { path: 'src/config/', description: 'Env validation (Zod), Pino logger' },
      { path: 'src/exceptions/', description: 'AppError + typed subclasses' },
      { path: 'src/handlers/', description: 'Global Fastify error handler' },
      { path: 'src/middlewares/', description: 'onRequest/onSend hooks, sanitize preHandler' },
      { path: 'src/routes/', description: 'Route definitions — thin HTTP-to-controller mapping' },
      { path: 'src/controllers/', description: 'Input validation, response shaping' },
      { path: 'src/services/', description: 'Business logic (pure, no HTTP knowledge)' },
      { path: 'src/dal/', description: 'Data Access Layer — DB / external API calls' },
      { path: 'src/utils/', description: 'Response envelope helpers' },
    ],
  },
  {
    id: 'fastapi',
    name: 'Python / FastAPI',
    language: 'Python',
    framework: 'FastAPI',
    description:
      'Production-ready Python backend built on FastAPI. Pydantic v2 validation, structlog, layered architecture, and async-first design. Ready to connect to any database.',
    tags: ['Python', 'FastAPI', 'Pydantic', 'Async', 'REST'],
    features: [
      'Layered architecture: routers → controllers → services → repositories',
      'Global exception handlers (AppException, Pydantic validation, unhandled)',
      'Typed custom exceptions (NotFoundError, UnauthorizedError, etc.)',
      'Pydantic v2 request/response schemas',
      'structlog structured logging with request-ID middleware',
      'pydantic-settings for type-safe .env config',
      'CORS + security headers pre-configured',
      'Standardized response envelope',
      'pytest + pytest-asyncio with httpx for integration tests',
      'Multi-stage Dockerfile with Poetry',
      'GitHub Actions & GitLab CI pipelines included',
    ],
    stack: [
      { tool: 'Python 3.12', purpose: 'Runtime' },
      { tool: 'FastAPI', purpose: 'HTTP framework' },
      { tool: 'Pydantic v2', purpose: 'Validation + settings' },
      { tool: 'structlog', purpose: 'Structured logging' },
      { tool: 'uvicorn', purpose: 'ASGI server' },
      { tool: 'pytest + httpx', purpose: 'Testing' },
      { tool: 'ruff + mypy', purpose: 'Lint + type check' },
      { tool: 'Poetry', purpose: 'Dependency management' },
    ],
    quickstart: [
      { label: 'Install', command: 'poetry install' },
      { label: 'Configure', command: 'cp .env.example .env' },
      { label: 'Start dev', command: 'uvicorn app.main:app --reload' },
      { label: 'Health check', command: 'curl http://localhost:8000/api/v1/health' },
    ],
    structure: [
      { path: 'app/api/v1/routes/', description: 'FastAPI routers — thin HTTP-to-controller mapping' },
      { path: 'app/controllers/', description: 'Request handling + response shaping' },
      { path: 'app/services/', description: 'Business logic (no HTTP knowledge)' },
      { path: 'app/repositories/', description: 'Data access — extends BaseRepository[T]' },
      { path: 'app/models/schemas/', description: 'Pydantic request/response schemas' },
      { path: 'app/core/', description: 'Config (pydantic-settings), logging, custom exceptions' },
      { path: 'app/middleware/', description: 'Request logging, global error handlers' },
    ],
  },
];

// ─── Blueprints catalog ───────────────────────────────────────────────────────

export const blueprints: Blueprint[] = [
  {
    id: 'apigw-lambda-dynamodb',
    name: 'API Gateway + Lambda + DynamoDB',
    category: 'serverless',
    description: 'Serverless REST API with NoSQL storage. Zero servers to manage, scales to zero.',
    tags: ['Serverless', 'Lambda', 'DynamoDB', 'API Gateway'],
    resources: [
      'API Gateway HTTP API with CORS and stage',
      'Lambda function (Node.js 20.x) with X-Ray tracing',
      'DynamoDB table (PAY_PER_REQUEST, encrypted)',
      'IAM least-privilege roles',
      'CloudWatch Log Group with retention policy',
      'CloudWatch Alarms: Lambda errors & throttles',
    ],
    architecture: `Internet → API Gateway (HTTP API) → Lambda → DynamoDB`,
    configKeys: [
      { key: 'serviceName', default: 'my-service', description: 'Name prefix for all resources' },
      { key: 'env', default: 'dev', description: 'Environment (dev/staging/production)' },
      { key: 'tableName', default: 'my-table', description: 'DynamoDB table name suffix' },
      { key: 'tablePartitionKey', default: 'pk', description: 'DynamoDB partition key' },
      { key: 'lambdaMemoryMb', default: '512', description: 'Lambda memory in MB' },
      { key: 'lambdaTimeoutSeconds', default: '30', description: 'Lambda timeout' },
    ],
    deployCommand: 'cdk deploy -c serviceName=my-api -c env=dev -c tableName=items',
  },
  {
    id: 'ecs-fargate-rds',
    name: 'ECS Fargate + ALB + RDS',
    category: 'containers',
    description: 'Containerized service on ECS Fargate with a PostgreSQL database. The go-to pattern for Node.js and FastAPI services.',
    tags: ['ECS', 'Fargate', 'RDS', 'PostgreSQL', 'ALB', 'VPC'],
    resources: [
      'VPC (public / private / isolated subnets, Multi-AZ)',
      'ECR repository for container images',
      'ECS Cluster + Fargate Service with Container Insights',
      'Application Load Balancer (public)',
      'RDS PostgreSQL 16 (encrypted, automated backups)',
      'Secrets Manager for DB credentials',
      'CPU + memory-based Auto Scaling',
      'CloudWatch Alarms: ALB 5xx, ECS CPU, RDS CPU',
    ],
    architecture: `Internet → ALB → ECS Fargate (private) → RDS PostgreSQL (isolated)`,
    configKeys: [
      { key: 'serviceName', default: 'my-service', description: 'Name prefix for all resources' },
      { key: 'env', default: 'dev', description: 'Environment (dev/staging/production)' },
      { key: 'containerPort', default: '8000', description: 'Port the container listens on' },
      { key: 'containerCpu', default: '512', description: 'Fargate task CPU units' },
      { key: 'containerMemoryMb', default: '1024', description: 'Fargate task memory in MB' },
      { key: 'desiredCount', default: '2', description: 'Initial ECS task count' },
      { key: 'ecrImageTag', default: 'latest', description: 'Docker image tag to deploy' },
    ],
    deployCommand: 'cdk deploy -c serviceName=my-api -c env=dev -c ecrImageTag=abc1234',
  },
  {
    id: 'cache-layer',
    name: 'ElastiCache Redis (add-on)',
    category: 'addon',
    description: 'Add Redis caching to any existing service. Encrypted at rest and in transit, with Multi-AZ option for production.',
    tags: ['Redis', 'ElastiCache', 'Cache', 'Add-on'],
    resources: [
      'ElastiCache Redis replication group (encrypted)',
      'Security Group (app → Redis 6379 only)',
      'SSM Parameter Store: /<service>/<env>/redis/url',
      'CloudWatch Alarms: CPU, memory, evictions',
    ],
    architecture: `App → Security Group → ElastiCache Redis → SSM Parameter Store (URL)`,
    configKeys: [
      { key: 'redisNodeType', default: 'cache.t4g.micro', description: 'ElastiCache node type' },
      { key: 'multiAz', default: 'false', description: 'Enable Multi-AZ + auto-failover' },
      { key: 'vpcId', default: '—', description: 'Import existing VPC (optional)' },
      { key: 'appSecurityGroupId', default: '—', description: 'App SG allowed to reach Redis' },
    ],
    deployCommand: 'cdk deploy -c serviceName=my-api -c env=dev -c vpcId=vpc-xxx -c appSecurityGroupId=sg-xxx',
  },
  {
    id: 'event-driven',
    name: 'EventBridge + SQS + Lambda',
    category: 'addon',
    description: 'Full async event-driven pipeline. Producers publish to EventBridge, events route to SQS, Lambda processes them. Dead letter queue and alarms included.',
    tags: ['EventBridge', 'SQS', 'Lambda', 'Async', 'Event-driven'],
    resources: [
      'EventBridge custom Event Bus (with archive in production)',
      'SQS Queue + Dead Letter Queue',
      'Lambda consumer with partial batch response support',
      'SNS Topic for alerts',
      'CloudWatch Alarms: DLQ depth, queue age, Lambda errors',
      'IAM roles for producers and consumer',
    ],
    architecture: `Producer → EventBridge → SQS → Lambda Consumer\n                                 ↓\n                             DLQ + SNS Alerts`,
    configKeys: [
      { key: 'eventBusName', default: 'main', description: 'Event bus name suffix' },
      { key: 'maxReceiveCount', default: '3', description: 'Retries before moving to DLQ' },
      { key: 'lambdaMemoryMb', default: '256', description: 'Consumer Lambda memory' },
      { key: 'lambdaTimeoutSeconds', default: '60', description: 'Consumer Lambda timeout' },
    ],
    deployCommand: 'cdk deploy -c serviceName=my-api -c env=dev',
  },
  {
    id: 'secrets-and-config',
    name: 'Secrets Manager + SSM',
    category: 'addon',
    description: 'Centralized, encrypted secrets and configuration management for your service. KMS customer-managed key, least-privilege IAM policies, optional rotation.',
    tags: ['Secrets Manager', 'SSM', 'KMS', 'Security', 'Config'],
    resources: [
      'KMS Customer Managed Key with auto-rotation',
      'Secrets Manager secrets (encrypted with CMK)',
      'Optional automatic secret rotation',
      'SSM Parameter Store entries',
      'IAM role with least-privilege access to own secrets only',
    ],
    architecture: `Service → IAM Role → KMS Key → Secrets Manager / SSM Parameter Store`,
    configKeys: [
      { key: 'secrets', default: '[]', description: 'List of secrets to create' },
      { key: 'parameters', default: '[]', description: 'List of SSM parameters to create' },
      { key: 'enableRotation', default: 'false', description: 'Enable automatic secret rotation' },
      { key: 'rotationDays', default: '30', description: 'Rotation interval in days' },
    ],
    deployCommand: 'cdk deploy -c serviceName=my-api -c env=dev',
  },
];

// ─── Lookup helpers ───────────────────────────────────────────────────────────

export const getScaffold = (id: string): Scaffold | undefined =>
  scaffolds.find((s) => s.id === id);

export const getBlueprint = (id: string): Blueprint | undefined =>
  blueprints.find((b) => b.id === id);
