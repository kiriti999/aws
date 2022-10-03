import {Effect} from "../../../src/types/effect";

export const tokenResponse = {
    Action: "execute-api:Invoke",
    effect: Effect.Allow,
    Resource: "arn:aws:execute-api:eu-west-1:211614003246:a5iesqw19f/Prod/GET/hello/",
    methodArn: "arn:aws:execute-api:eu-west-1:211614003246:a5iesqw19f/Prod/GET/hello/"
}
