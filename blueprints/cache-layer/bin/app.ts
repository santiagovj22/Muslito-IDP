#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CacheLayerStack } from '../lib/stack';

const app = new cdk.App();
const serviceName = app.node.tryGetContext('serviceName') as string;
const env = app.node.tryGetContext('env') as string;
const region = app.node.tryGetContext('region') as string;

new CacheLayerStack(app, `${serviceName}-${env}-cache`, {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region },
  tags: { Service: serviceName, Environment: env, ManagedBy: 'idp-blueprint', Blueprint: 'cache-layer' },
});
