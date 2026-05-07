import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

interface SecretDef {
  name: string;
  description: string;
}

interface ParamDef {
  name: string;
  value: string;
  description: string;
}

export class SecretsAndConfigStack extends cdk.Stack {
  public readonly kmsKey: kms.Key;
  public readonly serviceRole: iam.Role;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const serviceName = this.node.tryGetContext('serviceName') as string;
    const env = this.node.tryGetContext('env') as string;
    const secretDefs = (this.node.tryGetContext('secrets') ?? []) as SecretDef[];
    const paramDefs = (this.node.tryGetContext('parameters') ?? []) as ParamDef[];
    const enableRotation = Boolean(this.node.tryGetContext('enableRotation') ?? false);
    const rotationDays = Number(this.node.tryGetContext('rotationDays') ?? 30);
    const isProduction = env === 'production';

    // ─── KMS Customer Managed Key ─────────────────────────────────────────────
    this.kmsKey = new kms.Key(this, 'Key', {
      alias: `${serviceName}-${env}`,
      description: `CMK for ${serviceName} ${env} secrets`,
      enableKeyRotation: true,
      removalPolicy: isProduction ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
    });

    // ─── IAM Role for the service ─────────────────────────────────────────────
    this.serviceRole = new iam.Role(this, 'ServiceRole', {
      roleName: `${serviceName}-${env}-service-role`,
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'), // change to ecs-tasks / ec2 as needed
      description: `Service role for ${serviceName} (${env})`,
    });

    // Allow service to use the KMS key
    this.kmsKey.grantDecrypt(this.serviceRole);

    const secretArns: string[] = [];

    // ─── Secrets Manager ──────────────────────────────────────────────────────
    for (const def of secretDefs) {
      const secret = new secretsmanager.Secret(this, `Secret-${def.name}`, {
        secretName: `/${serviceName}/${env}/${def.name}`,
        description: def.description,
        encryptionKey: this.kmsKey,
        generateSecretString: {
          passwordLength: 32,
          excludePunctuation: false,
        },
        removalPolicy: isProduction ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
      });

      // Auto-rotation (Lambda-backed)
      if (enableRotation) {
        secret.addRotationSchedule(`Rotation-${def.name}`, {
          automaticallyAfter: cdk.Duration.days(rotationDays),
          hostedRotation: secretsmanager.HostedRotation.mysqlSingleUser(), // swap for your DB type
        });
      }

      // Grant read to service role
      secret.grantRead(this.serviceRole);
      secretArns.push(secret.secretArn);

      new cdk.CfnOutput(this, `SecretArn-${def.name}`, {
        value: secret.secretArn,
        description: `ARN for secret ${def.name}`,
      });
    }

    // ─── SSM Parameter Store ──────────────────────────────────────────────────
    for (const def of paramDefs) {
      const param = new ssm.StringParameter(this, `Param-${def.name}`, {
        parameterName: `/${serviceName}/${env}/${def.name}`,
        stringValue: def.value,
        description: def.description,
        tier: ssm.ParameterTier.STANDARD,
      });

      param.grantRead(this.serviceRole);

      new cdk.CfnOutput(this, `ParamName-${def.name}`, {
        value: param.parameterName,
        description: `SSM parameter for ${def.name}`,
      });
    }

    // ─── IAM Policy summary ───────────────────────────────────────────────────
    // Explicit deny — service can ONLY read its own secrets, not others
    this.serviceRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.DENY,
        actions: ['secretsmanager:*'],
        resources: ['*'],
        conditions: {
          StringNotLike: {
            'secretsmanager:ResourceTag/Service': serviceName,
          },
        },
      }),
    );

    // ─── Outputs ──────────────────────────────────────────────────────────────
    new cdk.CfnOutput(this, 'KmsKeyArn', { value: this.kmsKey.keyArn });
    new cdk.CfnOutput(this, 'ServiceRoleArn', { value: this.serviceRole.roleArn });
  }
}
