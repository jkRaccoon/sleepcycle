#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { SleepcycleCertStack, SleepcycleStack } from '../lib/sleepcycle-stack';

const app = new cdk.App();
const account = '778021795831';

const certStack = new SleepcycleCertStack(app, 'SleepcycleCert', {
  env: { account, region: 'us-east-1' },
  crossRegionReferences: true,
});

const siteStack = new SleepcycleStack(app, 'Sleepcycle', {
  env: { account, region: 'ap-northeast-2' },
  crossRegionReferences: true,
  certificate: certStack.certificate,
});

siteStack.addDependency(certStack);
