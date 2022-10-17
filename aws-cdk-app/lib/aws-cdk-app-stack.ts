import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import { Bucket, BucketEncryption } from '@aws-cdk/aws-s3';
import * as lambda from "@aws-cdk/aws-lambda-nodejs";
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import { HttpApi } from '@aws-cdk/aws-apigatewayv2';
import { HttpMethod } from '@aws-cdk/aws-events';
import { Runtime } from '@aws-cdk/aws-lambda';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';

interface AwsCdkAppStackProps extends cdk.StackProps {
  envName?: string
}

export class AwsCdkAppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: AwsCdkAppStackProps) {
    super(scope, id, props);

    const bucket = new Bucket(this, 'MySimpleAppBucket', {
      encryption: props?.envName === 'dev' ? BucketEncryption.S3_MANAGED : BucketEncryption.UNENCRYPTED
    });

    const policy = new PolicyStatement();
    policy.addResources(bucket.bucketArn);
    policy.addActions('s3:ListBucket');

    const bucketPermissions = new PolicyStatement();
    bucketPermissions.addResources(`${bucket.bucketArn}/*`);
    bucketPermissions.addActions('s3:GetObject', 's3:PutObject');

    new BucketDeployment(this, 'MySimpleAppPhotos', {
      sources: [
        Source.asset(path.join(__dirname, 'photos'))
      ],
      destinationBucket: bucket
    });

    const getPhotos = new lambda.NodejsFunction(this, 'MySimpleLambda', {
      runtime: Runtime.NODEJS_16_X,
      entry: (path.join(__dirname, 'lambda-handler', 'index.ts')),
      handler: 'handler',
      environment: {
        PHOTO_BUCKET_NAME: bucket.bucketName
      }
    });

    const httpApi = new HttpApi(this, 'HttpApi', {
      corsPreflight: {
        allowOrigins: ['*'],
        allowHeaders: [HttpMethod.GET]
      },
      apiName: 'photo-api',
      createDefaultStage: true
    });

    const lambdaIntegration = new HttpLambdaIntegration('LambdaProxyIntegration', getPhotos);

    httpApi.addRoutes({
      path: '/getPhotos',
      methods: [HttpMethod.GET],
      integration: lambdaIntegration
    });

    getPhotos.addToRolePolicy(policy);
    getPhotos.addToRolePolicy(bucketPermissions);


    new cdk.CfnOutput(this, 'MySimpleAppBucketNameExport', {
      value: bucket.bucketName, exportName: `MySimpleAppBucketName`
    });
    new cdk.CfnOutput(this, 'MySimpleAppApi', {
      value: httpApi.url!, exportName: `MySimpleAppApiEndPoint`
    });

  }
}
