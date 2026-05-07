#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { SecretsAndConfigStack } from '../lib/stack';

const app = new cdk.App();
const serviceName = app.node.tryGetContext('serviceName') as string;
const env = app.node.tryGetContext('env') as string;
const region = app.node.tryGetContext('region') as string;

new SecretsAndConfigStack(app, `${serviceName}-${env}-secrets-config`, {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region },
  tags: { Service: serviceName, Environment: env, ManagedBy: 'idp-blueprint', Blueprint: 'secrets-and-config' },
});
