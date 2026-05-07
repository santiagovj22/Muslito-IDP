import * as cdk from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elasticache from 'aws-cdk-lib/aws-elasticache';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

export class CacheLayerStack extends cdk.Stack {
  public readonly replicationGroup: elasticache.CfnReplicationGroup;
  public readonly connectionStringParam: ssm.StringParameter;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const serviceName = this.node.tryGetContext('serviceName') as string;
    const env = this.node.tryGetContext('env') as string;
    const nodeType = this.node.tryGetContext('redisNodeType') as string ?? 'cache.t4g.micro';
    const engineVersion = this.node.tryGetContext('redisEngineVersion') as string ?? '7.1';
    const multiAz = Boolean(this.node.tryGetContext('multiAz') ?? false);
    const numCacheClusters = Number(this.node.tryGetContext('numCacheClusters') ?? 1);
    const vpcId = this.node.tryGetContext('vpcId') as string | undefined;
    const appSgId = this.node.tryGetContext('appSecurityGroupId') as string | undefined;
    const isProduction = env === 'production';

    // ─── VPC (import existing or create minimal) ─────────────────────────────
    const vpc = vpcId
      ? ec2.Vpc.fromLookup(this, 'Vpc', { vpcId })
      : new ec2.Vpc(this, 'Vpc', { maxAzs: isProduction ? 3 : 2, natGateways: 1 });

    // ─── Security Groups ──────────────────────────────────────────────────────
    const redisSg = new ec2.SecurityGroup(this, 'RedisSg', {
      vpc,
      securityGroupName: `${serviceName}-${env}-redis-sg`,
      description: 'Allow only app traffic to Redis',
    });

    if (appSgId) {
      const appSg = ec2.SecurityGroup.fromSecurityGroupId(this, 'AppSg', appSgId);
      redisSg.addIngressRule(appSg, ec2.Port.tcp(6379), 'App → Redis');
    } else {
      // Dev convenience: allow from within VPC
      redisSg.addIngressRule(ec2.Peer.ipv4(vpc.vpcCidrBlock), ec2.Port.tcp(6379), 'VPC → Redis');
    }

    // ─── Subnet Group ────────────────────────────────────────────────────────
    const subnetGroup = new elasticache.CfnSubnetGroup(this, 'SubnetGroup', {
      description: `${serviceName}-${env} Redis subnet group`,
      subnetIds: vpc.privateSubnets.map((s) => s.subnetId),
      cacheSubnetGroupName: `${serviceName}-${env}-redis-subnets`,
    });

    // ─── Redis Replication Group ──────────────────────────────────────────────
    this.replicationGroup = new elasticache.CfnReplicationGroup(this, 'Redis', {
      replicationGroupDescription: `${serviceName}-${env} Redis cache`,
      replicationGroupId: `${serviceName}-${env}-redis`,
      cacheNodeType: nodeType,
      engine: 'redis',
      engineVersion,
      numCacheClusters: multiAz ? Math.max(numCacheClusters, 2) : numCacheClusters,
      automaticFailoverEnabled: multiAz,
      multiAzEnabled: multiAz,
      atRestEncryptionEnabled: true,
      transitEncryptionEnabled: true,
      cacheSubnetGroupName: subnetGroup.ref,
      securityGroupIds: [redisSg.securityGroupId],
      snapshotRetentionLimit: isProduction ? 7 : 1,
      autoMinorVersionUpgrade: true,
    });

    // ─── SSM Parameter — connection string ────────────────────────────────────
    this.connectionStringParam = new ssm.StringParameter(this, 'RedisUrlParam', {
      parameterName: `/${serviceName}/${env}/redis/url`,
      stringValue: cdk.Fn.join('', [
        'redis://',
        this.replicationGroup.attrPrimaryEndPointAddress,
        ':',
        this.replicationGroup.attrPrimaryEndPointPort,
      ]),
      description: `Redis primary endpoint for ${serviceName} (${env})`,
    });

    // ─── CloudWatch Alarms ────────────────────────────────────────────────────
    const metricBase = {
      dimensions: { ReplicationGroupId: this.replicationGroup.ref },
      namespace: 'AWS/ElastiCache',
      period: cdk.Duration.minutes(5),
      statistic: 'Average',
    };

    new cloudwatch.Alarm(this, 'CpuAlarm', {
      alarmName: `${serviceName}-${env}-redis-cpu`,
      alarmDescription: 'Redis CPU utilization high',
      metric: new cloudwatch.Metric({ ...metricBase, metricName: 'EngineCPUUtilization' }),
      threshold: 80,
      evaluationPeriods: 2,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });

    new cloudwatch.Alarm(this, 'MemoryAlarm', {
      alarmName: `${serviceName}-${env}-redis-memory`,
      alarmDescription: 'Redis memory usage high',
      metric: new cloudwatch.Metric({ ...metricBase, metricName: 'DatabaseMemoryUsagePercentage' }),
      threshold: 80,
      evaluationPeriods: 2,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });

    new cloudwatch.Alarm(this, 'EvictionsAlarm', {
      alarmName: `${serviceName}-${env}-redis-evictions`,
      alarmDescription: 'Redis evictions detected — consider scaling',
      metric: new cloudwatch.Metric({ ...metricBase, metricName: 'Evictions', statistic: 'Sum' }),
      threshold: 100,
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });

    // ─── Outputs ─────────────────────────────────────────────────────────────
    new cdk.CfnOutput(this, 'RedisPrimaryEndpoint', {
      value: this.replicationGroup.attrPrimaryEndPointAddress,
      description: 'Redis primary endpoint',
      exportName: `${serviceName}-${env}-redis-endpoint`,
    });

    new cdk.CfnOutput(this, 'RedisUrlParamName', {
      value: this.connectionStringParam.parameterName,
      description: 'SSM Parameter name for Redis URL',
    });
  }
}
