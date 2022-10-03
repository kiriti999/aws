import { logger } from '../utils/logger';
import { APIGatewayEvent, Context, Handler } from 'aws-lambda';
import Response from '../utils/response';
import createUsers from '../services/createUsers/createUsers';

export const createUsersApiHandler: Handler = async (event: APIGatewayEvent, context: Context) => {
    logger.info('handler:: createUsersApiHandler:: handler called');
    const response = new Response();
    try {
        const commandObj = new createUsers(event);
        const result = await commandObj.execute();
        logger.info('HANDLER:: createUsersApiHandler:: successfully send the message to user provision');
        return response.success(result);
    } catch (error) {
        logger.error({ message: `HANDLER:: createUsersApiHandler:: failed to send message to user provision ${JSON.stringify(error)}` });
        return response.serverError(error);
    }

};
