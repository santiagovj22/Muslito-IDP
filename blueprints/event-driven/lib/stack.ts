import * as cdk from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';

export class EventDrivenStack extends cdk.Stack {
  public readonly eventBus: events.EventBus;
  public readonly queue: sqs.Queue;
  public readonly dlq: sqs.Queue;
  public readonly consumer: lambda.Function;
  public readonly alertTopic: sns.Topic;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const serviceName = this.node.tryGetContext('serviceName') as string;
    const env = this.node.tryGetContext('env') as string;
    const eventBusName = this.node.tryGetContext('eventBusName') as string ?? 'main';
    const visibilityTimeout = Number(this.node.tryGetContext('queueVisibilityTimeoutSeconds') ?? 300);
    const maxReceiveCount = Number(this.node.tryGetContext('maxReceiveCount') ?? 3);
    const lambdaMemory = Number(this.node.tryGetContext('lambdaMemoryMb') ?? 256);
    const lambdaTimeout = Number(this.node.tryGetContext('lambdaTimeoutSeconds') ?? 60);
    const alarmThreshold = Number(this.node.tryGetContext('alarmErrorThreshold') ?? 5);
    const isProduction = env === 'production';

    // ─── SNS Alert Topic ──────────────────────────────────────────────────────
    this.alertTopic = new sns.Topic(this, 'AlertTopic', {
      topicName: `${serviceName}-${env}-alerts`,
      displayName: `${serviceName} ${env} alerts`,
    });

    // ─── Dead Letter Queue ────────────────────────────────────────────────────
    this.dlq = new sqs.Queue(this, 'Dlq', {
      queueName: `${serviceName}-${env}-dlq`,
      retentionPeriod: cdk.Duration.days(14),
      encryption: sqs.QueueEncryption.SQS_MANAGED,
    });

    // ─── Main Queue ───────────────────────────────────────────────────────────
    this.queue = new sqs.Queue(this, 'Queue', {
      queueName: `${serviceName}-${env}-queue`,
      visibilityTimeout: cdk.Duration.seconds(visibilityTimeout),
      retentionPeriod: cdk.Duration.days(4),
      encryption: sqs.QueueEncryption.SQS_MANAGED,
      deadLetterQueue: { queue: this.dlq, maxReceiveCount },
    });

    // ─── EventBridge Event Bus ────────────────────────────────────────────────
    this.eventBus = new events.EventBus(this, 'EventBus', {
      eventBusName: `${serviceName}-${env}-${eventBusName}`,
    });

    // Archive events in production for replay capability
    if (isProduction) {
      this.eventBus.archive('EventArchive', {
        archiveName: `${serviceName}-${env}-archive`,
        description: 'Event archive for replay',
        retention: cdk.Duration.days(90),
        eventPattern: { source: [`${serviceName}`] },
      });
    }

    // ─── Lambda Consumer Log Group ────────────────────────────────────────────
    const logGroup = new logs.LogGroup(this, 'ConsumerLogGroup', {
      logGroupName: `/aws/lambda/${serviceName}-${env}-consumer`,
      retention: isProduction ? logs.RetentionDays.THREE_MONTHS : logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // ─── Lambda Consumer ──────────────────────────────────────────────────────
    this.consumer = new lambda.Function(this, 'Consumer', {
      functionName: `${serviceName}-${env}-consumer`,
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        exports.handler = async (event) => {
          console.log('Received event:', JSON.stringify(event, null, 2));
          // Replace with your actual consumer logic
          for (const record of event.Records) {
            const body = JSON.parse(record.body);
            console.log('Processing:', body);
          }
        };
      `),
      memorySize: lambdaMemory,
      timeout: cdk.Duration.seconds(lambdaTimeout),
      tracing: lambda.Tracing.ACTIVE,
      logGroup,
      environment: {
        SERVICE_NAME: serviceName,
        NODE_ENV: isProduction ? 'production' : 'development',
        EVENT_BUS_NAME: this.eventBus.eventBusName,
      },
    });

    // Wire SQS → Lambda
    this.consumer.addEventSource(
      new lambdaEventSources.SqsEventSource(this.queue, {
        batchSize: 10,
        maxBatchingWindow: cdk.Duration.seconds(5),
        reportBatchItemFailures: true, // partial batch response support
      }),
    );

    // ─── EventBridge Rule: route service events → SQS ────────────────────────
    new events.Rule(this, 'ServiceEventRule', {
      ruleName: `${serviceName}-${env}-to-queue`,
      eventBus: this.eventBus,
      description: `Route ${serviceName} events to processing queue`,
      eventPattern: {
        source: [`${serviceName}`],
        // Add detail-type filters here:
        // detailType: ['order.created', 'user.registered'],
      },
      targets: [new targets.SqsQueue(this.queue)],
    });

    // ─── CloudWatch Alarms ────────────────────────────────────────────────────
    // DLQ depth alarm (messages landing in DLQ = consumer errors)
    new cloudwatch.Alarm(this, 'DlqDepthAlarm', {
      alarmName: `${serviceName}-${env}-dlq-depth`,
      alarmDescription: 'Messages appearing in DLQ — consumer is failing',
      metric: this.dlq.metricApproximateNumberOfMessagesVisible({
        period: cdk.Duration.minutes(1),
        statistic: 'Sum',
      }),
      threshold: 1,
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });

    // Queue age alarm (messages not being processed fast enough)
    new cloudwatch.Alarm(this, 'QueueAgeAlarm', {
      alarmName: `${serviceName}-${env}-queue-age`,
      alarmDescription: 'Messages waiting too long in queue',
      metric: this.queue.metricApproximateAgeOfOldestMessage({
        period: cdk.Duration.minutes(5),
        statistic: 'Maximum',
      }),
      threshold: 300, // 5 minutes
      evaluationPeriods: 2,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });

    // Lambda errors alarm
    new cloudwatch.Alarm(this, 'ConsumerErrorAlarm', {
      alarmName: `${serviceName}-${env}-consumer-errors`,
      alarmDescription: 'Lambda consumer errors exceeded threshold',
      metric: this.consumer.metricErrors({ period: cdk.Duration.minutes(1), statistic: 'Sum' }),
      threshold: alarmThreshold,
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });

    // ─── Outputs ──────────────────────────────────────────────────────────────
    new cdk.CfnOutput(this, 'EventBusName', {
      value: this.eventBus.eventBusName,
      exportName: `${serviceName}-${env}-event-bus-name`,
    });
    new cdk.CfnOutput(this, 'QueueUrl', { value: this.queue.queueUrl });
    new cdk.CfnOutput(this, 'DlqUrl', { value: this.dlq.queueUrl });
    new cdk.CfnOutput(this, 'AlertTopicArn', { value: this.alertTopic.topicArn });
  }
}
