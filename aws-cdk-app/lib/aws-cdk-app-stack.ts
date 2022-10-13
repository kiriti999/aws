import * as cdk from 'aws-cdk-lib';
import { Bucket, BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from 'path';

export class AwsCdkAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new Bucket(this, 'MySimpleAppBucket', {
      encryption: BucketEncryption.S3_MANAGED
    });

    new cdk.CfnOutput(this, 'MySimpleAppBucketNameExport', {
      value: bucket.bucketName, exportName: 'MySimpleAppBucketName'
    })

    const fn = new lambda.Function(this, 'MySimpleLambda', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: './lambda-handler/index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda-handler'))
    });

    console.log('fn result ', fn);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'AwsCdkAppQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
