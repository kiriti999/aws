import {Handler} from "aws-lambda"
import {logLayout} from "../logger/logLayout";
import * as logConfiguration from "../logger/log4js.json";
import {addLayout, configure} from "log4js";
import {policyGenerator} from "../utils/policyGenerator";
import {logger, setLogger} from "../logger";
import {Effect} from "../types/effect";
import { tokenValidationService } from "../services/tokenValidator.service";

addLayout('json', logLayout.json);
configure(logConfiguration);

type ProxyHandler = Handler
/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
export const lambdaHandler: ProxyHandler =
    async (event, context) => {
        setLogger(event);
        logger.info('Authorizer:: lambdaHandler:: begins');
        logger.info('Authorizer:: lambdaHandler:: begins');
        try {
            logger.info('Authorizer:: lambdaHandler:: Setting Logger');
            logger.info('Authorizer:: lambdaHandler:: Scanning Headers');
            logger.info(`Authorizer:: lambdaHandler:: Headers Received ${JSON.stringify(event.headers)}`);
            const result = await tokenValidationService.validateAccessToken(event);
            const policy = policyGenerator.generatePolicy(result)
            logger.info(`Authorizer:: lambdaHandler:: returning the policy document ${JSON.stringify(policy)}`);
            return policy;
        } catch (err: any) {
            logger.error(`Authorizer:: lambdaHandler:: Exception Log`, err);
            const policy = policyGenerator.generatePolicy({
                effect: Effect.Deny,
                principalId: 'null',
                action: event.requestContext.httpMethod,
                methodArn: event.methodArn
            })
            logger.error(`Authorizer:: lambdaHandler:: Error logged and now returning the denied policy ${JSON.stringify(policy)}`);
            return policy;
        }
    };

