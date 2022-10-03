
import { getLogger } from "log4js";

const log = getLogger("invoke");
let logConfig: any;

export const setLogger = (event: any) => {
    logConfig = {
        reqContext: event.requestContext,
        queryParam: event.queryStringParameters
    };
}

const formatMessage = () => {
    const { reqContext } = logConfig
    if (reqContext) {
        log.addContext('requestId', reqContext.requestId);
        log.addContext('host', reqContext.identity.sourceIp);
        log.addContext('method', reqContext.httpMethod);
        log.addContext('uri', reqContext.path);
        log.addContext('userAgent', reqContext.identity.userAgent);
        log.addContext('stage', reqContext.stage);
        log.addContext('sourceIP', reqContext.identity.sourceIP);
        log.addContext('requestTime', reqContext.requestTime);
        log.addContext('xReqIdOrig', reqContext.identity.principalOrgId);
    }
};

export const logger = {
    error: (...messageArgs: any[]) => {
        const [message, ...args] = messageArgs;
        logConfig.type = 'ERROR';
        formatMessage();
        log.error(message, ...args);
    },
    debug: (...messageArgs: any[]) => {
        logConfig.type = 'DEBUG';
        const [message, ...args] = messageArgs;
        formatMessage();
        log.debug(message, ...args);
    },
    info: (...messageArgs: any[]) => {
        const [message, ...args] = messageArgs;
        logConfig.type = 'INFO';
        formatMessage();
        log.info(message, ...args);
    },
    warn: (...messageArgs: any[]) => {
        const [message, ...args] = messageArgs;
        logConfig.type = 'WARN';
        formatMessage();
        log.warn(message, ...args);
    },
    fatal: (...messageArgs: any[]) => {
        const [message, ...args] = messageArgs;
        logConfig.type = 'FETAL';
        formatMessage();
        log.fatal(message, ...args);
    },
}
