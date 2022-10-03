import SQS from 'aws-sdk/clients/sqs';
import { envConfig } from '../config/environment';
import { logger } from '../logger';

export default async (message: any, queueUrl: string) => {
    try {
        const { awsRegion, awsApiVerison } = envConfig;
        const params: any = {
            MessageBody: JSON.stringify(message),
            QueueUrl: queueUrl
        };
        const sqs = new SQS({
            region: awsRegion, apiVersion: awsApiVerison
        });
        logger.info(`Sending Message, PARAMS:: ${JSON.stringify(params)}`);
        const sendSqsMessage = await sqs.sendMessage(params).promise();
        logger.info(`Message sent:: Respose Message Id: ${sendSqsMessage.MessageId}`);
        return sendSqsMessage;
        // sendSqsMessage && sendSqsMessage.MessageId ? true : false
    } catch (ex) {
        logger.error({ message: `SendMessageToSQS:: exception ${ex}` });
        throw ex;
    }
};