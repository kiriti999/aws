import { logger } from '../utils/logger';
import { APIGatewayEvent, Context, Handler } from 'aws-lambda';
import Response from '../utils/response';
import SendMessageToUserRole from '../services/userRoleProvision/sendMessageToUserRole';

export const userRoleApiHandler: Handler = async (event: APIGatewayEvent, context: Context) => {
    logger.info('handler:: userRoleProvisionApiHandler:: handler called');
    const response = new Response();
    try {
        const commandObj = new SendMessageToUserRole(event);
        const result = await commandObj.execute();
        logger.info('HANDLER:: userRoleProvisionApiHandler:: successfully send the message to user role provision');
        return response.success(result);
    } catch (error) {
        logger.error({ message: `HANDLER:: userRoleProvisionApiHandler:: failed to send message to user role provision ${JSON.stringify(error)}` });
        return response.serverError(error);
    }

};