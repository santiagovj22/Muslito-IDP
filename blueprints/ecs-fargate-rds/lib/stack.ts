import * as cdk from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

export class EcsFargateRdsStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;
  public readonly cluster: ecs.Cluster;
  public readonly service: ecs.FargateService;
  public readonly database: rds.DatabaseInstance;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ─── Context ────────────────────────────────────────────────────────────
    const serviceName = this.node.tryGetContext('serviceName') as string;
    const env = this.node.tryGetContext('env') as string;
    const containerPort = Number(this.node.tryGetContext('containerPort') ?? 8000);
    const cpu = Number(this.node.tryGetContext('containerCpu') ?? 512);
    const memoryMb = Number(this.node.tryGetContext('containerMemoryMb') ?? 1024);
    const desiredCount = Number(this.node.tryGetContext('desiredCount') ?? 2);
    const minCapacity = Number(this.node.tryGetContext('minCapacity') ?? 1);
    const maxCapacity = Number(this.node.tryGetContext('maxCapacity') ?? 10);
    const dbName = this.node.tryGetContext('dbName') as string ?? 'appdb';
    const dbInstanceClass = this.node.tryGetContext('dbInstanceClass') as string ?? 't4g.small';
    const dbAllocatedStorage = Number(this.node.tryGetContext('dbAllocatedStorageGb') ?? 20);
    const dbMaxAllocatedStorage = Number(this.node.tryGetContext('dbMaxAllocatedStorageGb') ?? 100);
    const ecrImageTag = this.node.tryGetContext('ecrImageTag') as string ?? 'latest';
    const healthCheckPath = this.node.tryGetContext('healthCheckPath') as string ?? '/api/v1/health';
    const isProduction = env === 'production';

    // ─── VPC ─────────────────────────────────────────────────────────────────
    this.vpc = new ec2.Vpc(this, 'Vpc', {
      vpcName: `${serviceName}-${env}-vpc`,
      maxAzs: isProduction ? 3 : 2,
      natGateways: isProduction ? 2 : 1,
      subnetConfiguration: [
        { name: 'Public', subnetType: ec2.SubnetType.PUBLIC, cidrMask: 24 },
        { name: 'Private', subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS, cidrMask: 24 },
        { name: 'Isolated', subnetType: ec2.SubnetType.PRIVATE_ISOLATED, cidrMask: 28 },
      ],
    });

    // ─── ECR Repository ──────────────────────────────────────────────────────
    const repository = new ecr.Repository(this, 'EcrRepo', {
      repositoryName: `${serviceName}-${env}`,
      removalPolicy: isProduction ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
      lifecycleRules: [{ maxImageCount: 10 }],
    });

    // ─── RDS Database Credentials ────────────────────────────────────────────
    const dbSecret = new secretsmanager.Secret(this, 'DbSecret', {
      secretName: `/${serviceName}/${env}/db-credentials`,
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'appuser' }),
        generateStringKey: 'password',
        excludePunctuation: true,
        includeSpace: false,
        passwordLength: 32,
      },
    });

    // ─── Security Groups ─────────────────────────────────────────────────────
    const appSg = new ec2.SecurityGroup(this, 'AppSg', {
      vpc: this.vpc,
      securityGroupName: `${serviceName}-${env}-app-sg`,
      description: 'Security group for ECS Fargate tasks',
    });

    const dbSg = new ec2.SecurityGroup(this, 'DbSg', {
      vpc: this.vpc,
      securityGroupName: `${serviceName}-${env}-db-sg`,
      description: 'Security group for RDS database',
    });

    // Only allow app → DB, nothing else
    dbSg.addIngressRule(appSg, ec2.Port.tcp(5432), 'Allow app to connect to DB');

    // ─── RDS PostgreSQL ──────────────────────────────────────────────────────
    this.database = new rds.DatabaseInstance(this, 'Database', {
      instanceIdentifier: `${serviceName}-${env}-db`,
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_16,
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T4G,
        ec2.InstanceSize[dbInstanceClass.split('.')[1].toUpperCase() as keyof typeof ec2.InstanceSize]
      ),
      vpc: this.vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      securityGroups: [dbSg],
      credentials: rds.Credentials.fromSecret(dbSecret),
      databaseName: dbName,
      allocatedStorage: dbAllocatedStorage,
      maxAllocatedStorage: dbMaxAllocatedStorage,
      storageEncrypted: true,
      backupRetention: cdk.Duration.days(isProduction ? 7 : 1),
      deletionProtection: isProduction,
      multiAz: isProduction,
      removalPolicy: isProduction ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
    });

    // ─── ECS Cluster ─────────────────────────────────────────────────────────
    this.cluster = new ecs.Cluster(this, 'Cluster', {
      clusterName: `${serviceName}-${env}`,
      vpc: this.vpc,
      containerInsights: true, // Container Insights enabled
    });

    // ─── CloudWatch Log Group ────────────────────────────────────────────────
    const logGroup = new logs.LogGroup(this, 'AppLogGroup', {
      logGroupName: `/ecs/${serviceName}-${env}`,
      retention: isProduction ? logs.RetentionDays.THREE_MONTHS : logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // ─── Task Definition ─────────────────────────────────────────────────────
    const taskDef = new ecs.FargateTaskDefinition(this, 'TaskDef', {
      family: `${serviceName}-${env}`,
      cpu,
      memoryLimitMiB: memoryMb,
    });

    // Grant task access to DB secret
    dbSecret.grantRead(taskDef.taskRole);

    taskDef.addContainer('AppContainer', {
      image: ecs.ContainerImage.fromEcrRepository(repository, ecrImageTag),
      portMappings: [{ containerPort, protocol: ecs.Protocol.TCP }],
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: serviceName, logGroup }),
      environment: {
        NODE_ENV: isProduction ? 'production' : 'development',
        APP_ENV: isProduction ? 'production' : 'development',
        SERVICE_NAME: serviceName,
        PORT: containerPort.toString(),
        APP_PORT: containerPort.toString(),
      },
      secrets: {
        DB_SECRET: ecs.Secret.fromSecretsManager(dbSecret),
      },
      healthCheck: {
        command: ['CMD-SHELL', `wget -qO- http://localhost:${containerPort}${healthCheckPath} || exit 1`],
        interval: cdk.Duration.seconds(30),
        timeout: cdk.Duration.seconds(5),
        retries: 3,
        startPeriod: cdk.Duration.seconds(15),
      },
    });

    // ─── Fargate Service + ALB ───────────────────────────────────────────────
    const albService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'AlbService', {
      serviceName: `${serviceName}-${env}`,
      cluster: this.cluster,
      taskDefinition: taskDef,
      desiredCount,
      securityGroups: [appSg],
      taskSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      publicLoadBalancer: true,
      listenerPort: 80,
      healthCheckGracePeriod: cdk.Duration.seconds(30),
    });

    // Configure ALB health check
    albService.targetGroup.configureHealthCheck({
      path: healthCheckPath,
      interval: cdk.Duration.seconds(30),
      healthyThresholdCount: 2,
      unhealthyThresholdCount: 3,
    });

    this.service = albService.service;

    // ─── Auto Scaling ────────────────────────────────────────────────────────
    const scaling = this.service.autoScaleTaskCount({
      minCapacity,
      maxCapacity,
    });

    scaling.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: 70,
      scaleInCooldown: cdk.Duration.seconds(60),
      scaleOutCooldown: cdk.Duration.seconds(30),
    });

    scaling.scaleOnMemoryUtilization('MemoryScaling', {
      targetUtilizationPercent: 80,
      scaleInCooldown: cdk.Duration.seconds(60),
      scaleOutCooldown: cdk.Duration.seconds(30),
    });

    // ─── CloudWatch Alarms ───────────────────────────────────────────────────
    // ALB 5xx alarm
    new cloudwatch.Alarm(this, 'Alb5xxAlarm', {
      alarmName: `${serviceName}-${env}-alb-5xx`,
      alarmDescription: 'ALB returning too many 5xx errors',
      metric: albService.loadBalancer.metricHttpCodeTarget(
        elbv2.HttpCodeTarget.TARGET_5XX_COUNT,
        { period: cdk.Duration.minutes(1), statistic: 'Sum' }
      ),
      threshold: 10,
      evaluationPeriods: 2,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });

    // ECS CPU alarm
    new cloudwatch.Alarm(this, 'EcsCpuAlarm', {
      alarmName: `${serviceName}-${env}-ecs-cpu-high`,
      alarmDescription: 'ECS service CPU utilization is high',
      metric: this.service.metricCpuUtilization({
        period: cdk.Duration.minutes(5),
        statistic: 'Average',
      }),
      threshold: 85,
      evaluationPeriods: 3,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });

    // RDS CPU alarm
    new cloudwatch.Alarm(this, 'RdsCpuAlarm', {
      alarmName: `${serviceName}-${env}-rds-cpu-high`,
      alarmDescription: 'RDS CPU utilization is high',
      metric: this.database.metricCPUUtilization({
        period: cdk.Duration.minutes(5),
        statistic: 'Average',
      }),
      threshold: 80,
      evaluationPeriods: 3,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });

    // ─── Outputs ─────────────────────────────────────────────────────────────
    new cdk.CfnOutput(this, 'AlbDnsName', {
      value: albService.loadBalancer.loadBalancerDnsName,
      description: 'Application Load Balancer DNS Name',
    });

    new cdk.CfnOutput(this, 'EcrRepoUri', {
      value: repository.repositoryUri,
      description: 'ECR Repository URI',
      exportName: `${serviceName}-${env}-ecr-uri`,
    });

    new cdk.CfnOutput(this, 'DbEndpoint', {
      value: this.database.dbInstanceEndpointAddress,
      description: 'RDS Endpoint',
    });

    new cdk.CfnOutput(this, 'DbSecretArn', {
      value: dbSecret.secretArn,
      description: 'DB Credentials Secret ARN',
    });
  }
}
