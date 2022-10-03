import { hostname } from "os";

const resourceLogParams = ['resourceName'];
const lambdaLogParams = [
    'requestId', 'xReqIdOrig', 'userAgent', 'sourceIP', 'statusCode', 'method', 'uri', 'stage', 'orgId'
];
const logParams = [...lambdaLogParams, 'logLevel', 'appName', 'version', 'requestTime', ...resourceLogParams, 'host', 'message', 'category', 'processId'];
const appName = 'sam-node-template';
const lambdaLog = 'lambda.invoke';
const lambdaReSource = 'lambda.resource';

function constructLogMessage(dataObj: any) {
    let message = '';
    dataObj.forEach((data: any) => { message = `${message} ${data}`; });
    return JSON.stringify(message.replace(/[\r\n]/g, ' | ').trim());
}

export const logLayout = {
    json: function json() {
        return (logEvent: any) => {
            const category = logEvent.categoryName;
            const host = hostname() ? hostname() : '';
            const message = constructLogMessage(logEvent.data);
            const logContext = {
                appName,
                host,
                message,
                category,
                processId: logEvent.pid,
                logLevel: logEvent.level.levelStr,
                ...logEvent.context
            };
            let logMessage = '';
            logParams.forEach((logParam) => {
                if (lambdaLogParams.includes(logParam) && category !== lambdaLog) {
                    logMessage += '';
                } else if (resourceLogParams.includes(logParam) && category !== lambdaReSource) {
                    logMessage += '';
                } else {
                    logMessage += `${logParam}: ${logContext[logParam] || ''}\t`;
                }
            });

            return logMessage;
        };
    }
};
