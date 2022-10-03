import {Effect} from "../../../src/types/effect";

export const policyResponse = {
    principalId: "test@user.org",
    policyDocument: {
        Version: '2012-10-17',
        Statement: [
            {
                Action: "execute-api:Invoke",
                Effect: Effect.Allow,
                Resource: "arn:aws:execute-api:eu-west-1:211614003246:a5iesqw19f/Prod/GET/hello/"
            }
        ]
    }
}
