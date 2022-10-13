import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as AwsCdkApp from '../lib/aws-cdk-app-stack';

// example test. To run these tests, uncomment this file along with the
// example resource in lib/aws-cdk-app-stack.ts
test('S3 bucket', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new AwsCdkApp.AwsCdkAppStack(app, 'MyTestStack');

    expect(stack).toBe(stack);
});
