import * as cdk from 'aws-cdk-lib';
import { Bucket, BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from 'path';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

export class AwsCdkAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new Bucket(this, 'MySimpleAppBucket', {
      encryption: BucketEncryption.S3_MANAGED
    });

    const policy = new PolicyStatement();
    policy.addResources(bucket.bucketArn);
    policy.addActions('s3:ListBucket');

    const bucketPermissions = new PolicyStatement();
    bucketPermissions.addResources(`${bucket.bucketArn}/*`);
    bucketPermissions.addActions('s3:GetObject', 's3:PutObject');

    new cdk.CfnOutput(this, 'MySimpleAppBucketNameExport', {
      value: bucket.bucketName, exportName: 'MySimpleAppBucketName'
    });

    new BucketDeployment(this, 'MySimpleAppPhotos', {
      sources: [
        Source.asset(path.join(__dirname, 'photos'))
      ],
      destinationBucket: bucket
    });

    const getPhotos = new lambda.Function(this, 'MySimpleLambda', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: './lambda-handler/index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda-handler')),
      environment: {
        PHOTO_BUCKET_NAME: bucket.bucketName
      }
    });

    getPhotos.addToRolePolicy(policy);
    getPhotos.addToRolePolicy(bucketPermissions);
  }
}
