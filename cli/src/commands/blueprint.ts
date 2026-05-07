import { Command } from 'commander';
import chalk from 'chalk';

// ─── Blueprint catalog ───────────────────────────────────────────────────────
const BLUEPRINTS: Record<string, {
  name: string;
  description: string;
  resources: string[];
  deployCommand: (ctx: Record<string, string>) => string;
}> = {
  'apigw-lambda-dynamodb': {
    name: 'API Gateway + Lambda + DynamoDB',
    description: 'Serverless REST API with NoSQL storage.',
    resources: [
      'API Gateway (HTTP API)',
      'Lambda function (Node.js 20.x)',
      'DynamoDB table (PAY_PER_REQUEST)',
      'IAM least-privilege roles',
      'CloudWatch Alarms (errors, throttles)',
      'X-Ray tracing',
    ],
    deployCommand: (ctx) =>
      `cd blueprints/apigw-lambda-dynamodb && npm install && cdk deploy ` +
      `-c serviceName=${ctx.name} -c env=${ctx.env} -c region=${ctx.region}`,
  },
  'ecs-fargate-rds': {
    name: 'ECS Fargate + ALB + RDS PostgreSQL',
    description: 'Containerized service with a relational database.',
    resources: [
      'VPC (public/private/isolated subnets)',
      'ECR repository',
      'ECS Cluster + Fargate service',
      'Application Load Balancer',
      'RDS PostgreSQL 16 (encrypted, automated backups)',
      'Secrets Manager (DB credentials)',
      'Auto Scaling (CPU + memory)',
      'CloudWatch Alarms (ALB 5xx, ECS CPU, RDS CPU)',
    ],
    deployCommand: (ctx) =>
      `cd blueprints/ecs-fargate-rds && npm install && cdk deploy ` +
      `-c serviceName=${ctx.name} -c env=${ctx.env} -c region=${ctx.region}`,
  },
  'cache-layer': {
    name: 'ElastiCache Redis (add-on)',
    description: 'Add Redis caching to an existing service.',
    resources: [
      'ElastiCache Redis cluster',
      'Security Group (app → Redis only)',
      'SSM Parameter Store (connection string)',
      'CloudWatch Alarms (CPU, memory, evictions)',
    ],
    deployCommand: (ctx) =>
      `cd blueprints/cache-layer && npm install && cdk deploy -c serviceName=${ctx.name} -c env=${ctx.env}`,
  },
  'event-driven': {
    name: 'EventBridge + SQS + Lambda (add-on)',
    description: 'Async event-driven processing.',
    resources: [
      'EventBridge Event Bus',
      'SQS Queue + Dead Letter Queue',
      'Lambda consumer function',
      'SNS Topic for notifications',
    ],
    deployCommand: (ctx) =>
      `cd blueprints/event-driven && npm install && cdk deploy -c serviceName=${ctx.name} -c env=${ctx.env}`,
  },
  'secrets-and-config': {
    name: 'Secrets Manager + SSM Parameter Store',
    description: 'Centralized secrets and configuration management.',
    resources: [
      'Secrets Manager secrets',
      'SSM Parameter Store (SecureString)',
      'IAM policies per service',
    ],
    deployCommand: (ctx) =>
      `cd blueprints/secrets-and-config && npm install && cdk deploy -c serviceName=${ctx.name} -c env=${ctx.env}`,
  },
};

// ─── Commands ────────────────────────────────────────────────────────────────
export const blueprintCommand = (): Command => {
  const blueprint = new Command('blueprint').description('Manage infrastructure blueprints');

  // idp blueprint list
  blueprint
    .command('list')
    .description('List all available blueprints')
    .action(() => {
      console.log('\n' + chalk.bold('Available blueprints:\n'));
      for (const [key, b] of Object.entries(BLUEPRINTS)) {
        console.log(`  ${chalk.cyan(key.padEnd(30))} ${chalk.bold(b.name)}`);
        console.log(`  ${' '.repeat(30)} ${chalk.gray(b.description)}\n`);
      }
    });

  // idp blueprint info <name>
  blueprint
    .command('info <name>')
    .description('Show details about a blueprint')
    .action((name: string) => {
      const bp = BLUEPRINTS[name];
      if (!bp) {
        console.error(chalk.red(`\n✗ Blueprint "${name}" not found. Run 'idp blueprint list' to see options.`));
        process.exit(1);
      }
      console.log(`\n${chalk.bold(bp.name)}`);
      console.log(chalk.gray(bp.description));
      console.log('\n' + chalk.bold('Resources provisioned:'));
      bp.resources.forEach((r) => console.log(`  ${chalk.green('✓')} ${r}`));
      console.log('\n' + chalk.bold('Deploy:'));
      console.log(chalk.gray(`  idp blueprint deploy ${name} --name <service> --env <dev|staging|production>`));
      console.log('');
    });

  // idp blueprint deploy <name>
  blueprint
    .command('deploy <name>')
    .description('Show the CDK deploy command for a blueprint')
    .requiredOption('-n, --name <name>', 'Service name')
    .option('-e, --env <env>', 'Environment (dev|staging|production)', 'dev')
    .option('-r, --region <region>', 'AWS region', 'us-east-1')
    .action((name: string, opts) => {
      const bp = BLUEPRINTS[name];
      if (!bp) {
        console.error(chalk.red(`\n✗ Blueprint "${name}" not found.`));
        process.exit(1);
      }

      console.log(`\n${chalk.bold(`Deploying blueprint: ${chalk.cyan(name)}`)}`);
      console.log(chalk.gray(`Service: ${opts.name} | Env: ${opts.env} | Region: ${opts.region}\n`));

      const cmd = bp.deployCommand({ name: opts.name, env: opts.env, region: opts.region });

      console.log(chalk.bold('Run the following from the IDP monorepo root:'));
      console.log('\n' + chalk.yellow(`  ${cmd}`) + '\n');

      console.log(chalk.gray('Tip: Configure blueprint parameters in the blueprint\'s cdk.json before deploying.'));
    });

  return blueprint;
};
