import { Effect } from "../../../src/types/effect";

export const fakeEvent = {
    headers: { Authorization: 'Bearer: Blah blah' },
    methodArn: '12567:arn:tyuert',
    requestContext: { httpMethod: 'GET', identity: {} }
}

export const fakeTokenData = {
    effect: Effect.Allow,
    principalId: '17654392',
    action: 'GET',
    resource: 'xjypqxt'
};
export const expectedAllowPolicy = {
    principalId: "17654392",
    policyDocument: {
        Version: "2012-10-17",
        Statement: [
            {
                Action: "execute-api:Invoke",
                Effect: "Allow",
                Resource: "xjypqxt",
            },
        ],
    },
}

export const expectedDenyPolicy = {
    principalId: "null",
    policyDocument: {
        Version: "2012-10-17",
        Statement: [
            {
                Action: "execute-api:Invoke",
                Effect: "Deny",
                Resource: "12567:arn:tyuert",
            },
        ],
    },
}
