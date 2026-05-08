"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blueprintCommand = void 0;
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const ora_1 = __importDefault(require("ora"));
const exec_1 = require("../lib/exec");
const prompt_1 = require("../lib/prompt");
// ─── Helpers ─────────────────────────────────────────────────────────────────
const getBlueprintsRoot = () => path_1.default.resolve(__dirname, '../../../blueprints');
// ─── Blueprint catalog ───────────────────────────────────────────────────────
const BLUEPRINTS = {
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
        deployCommand: (ctx) => `cd blueprints/apigw-lambda-dynamodb && npm install && cdk deploy ` +
            `-c serviceName=${ctx.name} -c env=${ctx.env} -c region=${ctx.region}`,
        cdkFlags: (ctx) => [
            'deploy',
            '-c', `serviceName=${ctx.name}`,
            '-c', `env=${ctx.env}`,
            '-c', `region=${ctx.region}`,
        ],
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
        deployCommand: (ctx) => `cd blueprints/ecs-fargate-rds && npm install && cdk deploy ` +
            `-c serviceName=${ctx.name} -c env=${ctx.env} -c region=${ctx.region}`,
        cdkFlags: (ctx) => [
            'deploy',
            '-c', `serviceName=${ctx.name}`,
            '-c', `env=${ctx.env}`,
            '-c', `region=${ctx.region}`,
        ],
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
        deployCommand: (ctx) => `cd blueprints/cache-layer && npm install && cdk deploy -c serviceName=${ctx.name} -c env=${ctx.env}`,
        cdkFlags: (ctx) => [
            'deploy',
            '-c', `serviceName=${ctx.name}`,
            '-c', `env=${ctx.env}`,
        ],
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
        deployCommand: (ctx) => `cd blueprints/event-driven && npm install && cdk deploy -c serviceName=${ctx.name} -c env=${ctx.env}`,
        cdkFlags: (ctx) => [
            'deploy',
            '-c', `serviceName=${ctx.name}`,
            '-c', `env=${ctx.env}`,
        ],
    },
    'secrets-and-config': {
        name: 'Secrets Manager + SSM Parameter Store',
        description: 'Centralized secrets and configuration management.',
        resources: [
            'Secrets Manager secrets',
            'SSM Parameter Store (SecureString)',
            'IAM policies per service',
        ],
        deployCommand: (ctx) => `cd blueprints/secrets-and-config && npm install && cdk deploy -c serviceName=${ctx.name} -c env=${ctx.env}`,
        cdkFlags: (ctx) => [
            'deploy',
            '-c', `serviceName=${ctx.name}`,
            '-c', `env=${ctx.env}`,
        ],
    },
};
// ─── Commands ─────────────────────────────────────────────────────────────────
const blueprintCommand = () => {
    const blueprint = new commander_1.Command('blueprint').description('Manage infrastructure blueprints');
    // idp blueprint list
    blueprint
        .command('list')
        .description('List all available blueprints')
        .action(() => {
        console.log('\n' + chalk_1.default.bold('Available blueprints:\n'));
        for (const [key, b] of Object.entries(BLUEPRINTS)) {
            console.log(`  ${chalk_1.default.cyan(key.padEnd(30))} ${chalk_1.default.bold(b.name)}`);
            console.log(`  ${' '.repeat(30)} ${chalk_1.default.gray(b.description)}\n`);
        }
    });
    // idp blueprint info <name>
    blueprint
        .command('info <name>')
        .description('Show details about a blueprint')
        .action((name) => {
        const bp = BLUEPRINTS[name];
        if (!bp) {
            console.error(chalk_1.default.red(`\n✗ Blueprint "${name}" not found. Run 'idp blueprint list' to see options.`));
            process.exit(1);
        }
        console.log(`\n${chalk_1.default.bold(bp.name)}`);
        console.log(chalk_1.default.gray(bp.description));
        console.log('\n' + chalk_1.default.bold('Resources provisioned:'));
        bp.resources.forEach((r) => console.log(`  ${chalk_1.default.green('✓')} ${r}`));
        console.log('\n' + chalk_1.default.bold('Deploy:'));
        console.log(chalk_1.default.gray(`  idp blueprint deploy ${name} --name <service> --env <dev|staging|production>`));
        console.log('');
    });
    // idp blueprint deploy <name>
    blueprint
        .command('deploy <name>')
        .description('Print or execute the CDK deploy command for a blueprint')
        .requiredOption('-n, --name <name>', 'Service name')
        .option('-e, --env <env>', 'Environment (dev|staging|production)', 'dev')
        .option('-r, --region <region>', 'AWS region', 'us-east-1')
        .option('--run', 'Execute the CDK deploy instead of printing the command')
        .option('-y, --yes', 'Skip the confirmation prompt (use with --run)')
        .action(async (name, opts) => {
        const bp = BLUEPRINTS[name];
        if (!bp) {
            console.error(chalk_1.default.red(`\n✗ Blueprint "${name}" not found.`));
            process.exit(1);
        }
        const ctx = { name: opts.name, env: opts.env, region: opts.region };
        // ── Print path (default, no --run) ──────────────────────────────────────
        if (!opts.run) {
            console.log(`\n${chalk_1.default.bold(`Deploying blueprint: ${chalk_1.default.cyan(name)}`)}`);
            console.log(chalk_1.default.gray(`Service: ${opts.name} | Env: ${opts.env} | Region: ${opts.region}\n`));
            const cmd = bp.deployCommand(ctx);
            console.log(chalk_1.default.bold('Run the following from the IDP monorepo root:'));
            console.log('\n' + chalk_1.default.yellow(`  ${cmd}`) + '\n');
            console.log(chalk_1.default.gray("Tip: Configure blueprint parameters in the blueprint's cdk.json before deploying."));
            return;
        }
        // ── Run path (--run) ─────────────────────────────────────────────────────
        const blueprintDir = path_1.default.join(getBlueprintsRoot(), name);
        // Guard: blueprint directory must exist on disk
        if (!(await fs_extra_1.default.pathExists(blueprintDir))) {
            console.error(chalk_1.default.red(`\n✗ Blueprint directory not found: ${blueprintDir}`));
            console.error(chalk_1.default.gray('  Make sure you are running this command from the IDP monorepo root.\n'));
            process.exit(1);
        }
        // Guard: cdk must be on PATH
        if (!(await (0, exec_1.commandExists)('cdk'))) {
            console.error(chalk_1.default.red('\n✗ "cdk" not found on PATH. Install it with:'));
            console.error(chalk_1.default.yellow('  npm install -g aws-cdk\n'));
            process.exit(1);
        }
        // Confirmation (skipped with --yes)
        if (!opts.yes) {
            const confirmed = await (0, prompt_1.confirm)(`\n  Deploy ${chalk_1.default.cyan(name)} to ${chalk_1.default.bold(opts.env)} (${opts.region})? ${chalk_1.default.gray('[y/N]')} `);
            if (!confirmed) {
                console.log(chalk_1.default.gray('\n  Deployment cancelled.\n'));
                process.exit(0);
            }
        }
        console.log('');
        // Step 1: npm install (output piped — only shown on failure)
        const installSpinner = (0, ora_1.default)('Installing dependencies...').start();
        const installResult = await (0, exec_1.runPiped)('npm', ['install'], blueprintDir);
        if (installResult.code !== 0) {
            installSpinner.fail(chalk_1.default.red('npm install failed'));
            if (installResult.stdout)
                process.stdout.write(installResult.stdout);
            if (installResult.stderr)
                process.stderr.write(installResult.stderr);
            process.exit(1);
        }
        installSpinner.succeed('Dependencies installed');
        // Step 2: cdk deploy (output streamed directly to terminal)
        console.log('\n' + chalk_1.default.bold('Deploying stack...') + '\n');
        const deployCode = await (0, exec_1.runInherited)('cdk', bp.cdkFlags(ctx), blueprintDir);
        if (deployCode !== 0) {
            console.error(chalk_1.default.red(`\n✗ CDK deploy failed (exit code ${deployCode})\n`));
            process.exit(1);
        }
        console.log(`\n${chalk_1.default.green('✓')} Blueprint ${chalk_1.default.cyan(name)} deployed successfully ` +
            `to ${chalk_1.default.bold(opts.env)} (${opts.region})\n`);
    });
    return blueprint;
};
exports.blueprintCommand = blueprintCommand;
//# sourceMappingURL=blueprint.js.map