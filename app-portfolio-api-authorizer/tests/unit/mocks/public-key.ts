import * as https from "https";
const jwksClient = require("jwks-rsa");

export const fakeKey: string = 'fake key';

export const  fakeKeyConfig = {
    keyUri: 'keyUri',
    timeout: 1,
    keepAlive: true,
    rejectUnauthorized:  true,
    zscallerKey: 'zscallerKey',
    localKey: 'localKey',
    region: 'region'
}

export const fakeClient = jwksClient({
    jwksUri: fakeKeyConfig.keyUri,
    requestHeaders: {},
    timeout: fakeKeyConfig.timeout,
    requestAgent: new https.Agent({
        keepAlive: fakeKeyConfig.keepAlive,
        rejectUnauthorized: fakeKeyConfig.rejectUnauthorized,
        ca: fakeKeyConfig.zscallerKey,
    })
})

export const expectedKey = {
    kid: 'wjkbgrkbgj'
}

export const expectedDeniedKey = {
    kid: null
}