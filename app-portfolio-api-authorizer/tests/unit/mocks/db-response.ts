import {tokenResponse} from "./token-response";

export const dbResponse = {
    arn: tokenResponse.methodArn,
    role: 'Admin',
    scope: 'app.everyone'
}
