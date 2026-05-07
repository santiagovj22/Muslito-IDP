#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { EcsFargateRdsStack } from '../lib/stack';

const app = new cdk.App();

const serviceName = app.node.tryGetContext('serviceName') as string;
const env = app.node.tryGetContext('env') as string;
const region = app.node.tryGetContext('region') as string;

new EcsFargateRdsStack(app, `${serviceName}-${env}-ecs-fargate-rds`, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region,
  },
  tags: {
    Service: serviceName,
    Environment: env,
    ManagedBy: 'idp-blueprint',
    Blueprint: 'ecs-fargate-rds',
  },
});
