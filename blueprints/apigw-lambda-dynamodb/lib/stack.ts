import * as cdk from 'aws-cdk-lib';
import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

export class ApiGwLambdaDynamoStack extends cdk.Stack {
  public readonly api: apigatewayv2.HttpApi;
  public readonly fn: lambda.Function;
  public readonly table: dynamodb.Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ─── Context ────────────────────────────────────────────────────────────
    const serviceName = this.node.tryGetContext('serviceName') as string;
    const env = this.node.tryGetContext('env') as string;
    const tableName = this.node.tryGetContext('tableName') as string;
    const partitionKey = this.node.tryGetContext('tablePartitionKey') as string ?? 'pk';
    const sortKey = this.node.tryGetContext('tableSortKey') as string | undefined;
    const lambdaMemoryMb = Number(this.node.tryGetContext('lambdaMemoryMb') ?? 512);
    const lambdaTimeoutSec = Number(this.node.tryGetContext('lambdaTimeoutSeconds') ?? 30);
    const apiStageName = this.node.tryGetContext('apiStageName') as string ?? 'v1';
    const alarmErrorThreshold = Number(this.node.tryGetContext('alarmErrorThreshold') ?? 5);

    // ─── DynamoDB Table ──────────────────────────────────────────────────────
    this.table = new dynamodb.Table(this, 'Table', {
      tableName: `${serviceName}-${env}-${tableName}`,
      partitionKey: { name: partitionKey, type: dynamodb.AttributeType.STRING },
      ...(sortKey && {
        sortKey: { name: sortKey, type: dynamodb.AttributeType.STRING },
      }),
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      pointInTimeRecovery: env === 'production',
      removalPolicy: env === 'production'
        ? cdk.RemovalPolicy.RETAIN
        : cdk.RemovalPolicy.DESTROY,
    });

    // ─── Lambda Log Group ────────────────────────────────────────────────────
    const logGroup = new logs.LogGroup(this, 'LambdaLogGroup', {
      logGroupName: `/aws/lambda/${serviceName}-${env}`,
      retention: env === 'production'
        ? logs.RetentionDays.THREE_MONTHS
        : logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // ─── Lambda Function ─────────────────────────────────────────────────────
    this.fn = new lambda.Function(this, 'Handler', {
      functionName: `${serviceName}-${env}`,
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda'), // your service build output
      memorySize: lambdaMemoryMb,
      timeout: cdk.Duration.seconds(lambdaTimeoutSec),
      tracing: lambda.Tracing.ACTIVE, // X-Ray
      logGroup,
      environment: {
        NODE_ENV: env === 'production' ? 'production' : 'development',
        TABLE_NAME: this.table.tableName,
        SERVICE_NAME: serviceName,
      },
    });

    // Least-privilege DynamoDB access
    this.table.grantReadWriteData(this.fn);

    // ─── API Gateway (HTTP API) ──────────────────────────────────────────────
    this.api = new apigatewayv2.HttpApi(this, 'HttpApi', {
      apiName: `${serviceName}-${env}`,
      defaultIntegration: new integrations.HttpLambdaIntegration('LambdaIntegration', this.fn),
      corsPreflight: {
        allowHeaders: ['Content-Type', 'Authorization'],
        allowMethods: [apigatewayv2.CorsHttpMethod.ANY],
        allowOrigins: env === 'production' ? ['https://your-domain.com'] : ['*'],
        maxAge: cdk.Duration.days(1),
      },
      createDefaultStage: false,
    });

    this.api.addStage('Stage', {
      stageName: apiStageName,
      autoDeploy: true,
    });

    // ─── CloudWatch Alarms ───────────────────────────────────────────────────
    // Lambda error rate alarm
    new cloudwatch.Alarm(this, 'LambdaErrorAlarm', {
      alarmName: `${serviceName}-${env}-lambda-errors`,
      alarmDescription: 'Lambda function errors exceeded threshold',
      metric: this.fn.metricErrors({
        period: cdk.Duration.minutes(1),
        statistic: 'Sum',
      }),
      threshold: alarmErrorThreshold,
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });

    // Lambda throttles alarm
    new cloudwatch.Alarm(this, 'LambdaThrottleAlarm', {
      alarmName: `${serviceName}-${env}-lambda-throttles`,
      alarmDescription: 'Lambda function throttles detected',
      metric: this.fn.metricThrottles({
        period: cdk.Duration.minutes(5),
        statistic: 'Sum',
      }),
      threshold: 10,
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });

    // ─── Outputs ─────────────────────────────────────────────────────────────
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: `${this.api.url}${apiStageName}`,
      description: 'API Gateway URL',
      exportName: `${serviceName}-${env}-api-url`,
    });

    new cdk.CfnOutput(this, 'TableName', {
      value: this.table.tableName,
      description: 'DynamoDB Table Name',
      exportName: `${serviceName}-${env}-table-name`,
    });

    new cdk.CfnOutput(this, 'LambdaArn', {
      value: this.fn.functionArn,
      description: 'Lambda Function ARN',
    });
  }
}
