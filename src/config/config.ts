import {DbConfig} from "../types/db.config";
import {KeyConfig} from "../types/key.config";
import {JwtConfig} from "../types/jwt.config";

export const getJWTConfig = (): JwtConfig => {
    const jwtConfig: JwtConfig = {
        audience: process.env.AUDIENCE!,
        issuer: process.env.ISSUER!,
        clockTolerance: +process.env.CLOCKTOLERANCE!,
    };
    return jwtConfig;
}

export const getDbConfig = (): DbConfig => {
    const dbConfig: DbConfig = {
        apiVersion: process.env.API_VERSION!,
        tableName: process.env.TABLE_NAME!,
        signingKeyTableName: process.env.SIGNING_KEY_TABLE_NAME!
    }
    return dbConfig;
}

export const getKeyConfig = () : KeyConfig => {
    const keyConfig: KeyConfig = {
        keyUri: process.env.KEY_URI!,
        timeout: process.env.TIMEOUT ? +process.env.TIMEOUT : 15000,
        keepAlive: process.env.KEEPALIVE ? (process.env.KEEPALIVE == 'true') : true,
        rejectUnauthorized:  process.env.ZSCALLERKEY ? (process.env.ZSCALLERKEY == 'true') : true,
        zscallerKey: process.env.ZSCALLERKEY!,
        localKey: process.env.LOCALKEY!,
        region: process.env.AWS_REGION!,
    }
    return keyConfig;
}

export const isDevelopmentMode = () => {
    const env = process.env.NODE_ENV == 'local';
    console.log(`The env config is ${env}`);
    return env;
}

export const logConfiguration = {
    "appenders": { "lambda-log": { "type": "console" } },
    "categories": { "default": { "appenders": ["lambda-log"], "level": "info" } }
};
