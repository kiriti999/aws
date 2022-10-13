import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda';
import { S3 } from 'aws-sdk';

const bucketName = process.env.PHOTO_BUCKET_NAME!;

const s3 = new S3();

exports.handler = async function (event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyResultV2> {
    try {
        console.log('handler called with bucket name: ', bucketName);
        const { Contents: results } = await s3.listObjects({ Bucket: bucketName }).promise();
        const photos = await Promise.all(results!.map((item) => generateUrl(item)));
        return {
            statusCode: 200,
            body: JSON.stringify(photos),
        };
    } catch (error) {
        console.log('file: index.ts :: line 14 :: err', error);
        return {
            statusCode: 500,
            body: 'error occurred'
        };
    }

}
async function generateUrl(object: S3.Object) {
    // Implement
    const url = await s3.getSignedUrlPromise('getObject', {
        Bucket: bucketName,
        Key: object.Key,
        Expires: (24 * 60 * 60)
    });

    return {
        fileName: object.Key!,
        url
    }
}