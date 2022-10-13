import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda';
exports.handler = async function (event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyResultV2> {
    console.log('handler called');
    return {
        statusCode: 200,
        body: 'kiriti',
    };
}