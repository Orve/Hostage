#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { HostageSecretsStack } from '../lib/secrets-stack';
import { HostageLambdaStack } from '../lib/lambda-stack';

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION ?? 'ap-northeast-1',
};

const secretsStack = new HostageSecretsStack(app, 'HostageSecretsStack', { env });

new HostageLambdaStack(app, 'HostageLambdaStack', {
  env,
  secretsStack,
});
