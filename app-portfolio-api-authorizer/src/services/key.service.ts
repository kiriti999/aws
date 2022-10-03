import {getKeyConfig, isDevelopmentMode} from "../config/config";
import { getLogger } from "log4js";

import { Agent } from "https";
import { KeyConfig } from "../types/key.config";
import { JwksClient } from "jwks-rsa";
const logger = getLogger("lambda.resource");

export class KeyService {
    private keyConfig: KeyConfig;
    private isDevelopmentMode: boolean = false;

    constructor() {
        this.keyConfig = getKeyConfig();
        this.isDevelopmentMode = isDevelopmentMode();
    }

    async getPublicKey(kid: string) {
        logger.info(`Authorizer:: KeyService:: getCertificate:: Trying to resolve the public key`);
        const localKeyFile = this.readLocalKeyFile();
        if (this.isDevelopmentMode && localKeyFile) {
            logger.info(`Authorizer:: KeyService:: getCertificate:: Local Key file found and returning results`);
            return localKeyFile;
        }

        logger.info(`Authorizer:: KeyService:: getCertificate:: Setting the client to obtain the token from Azure B2C`);
        let client = new JwksClient({
            jwksUri: this.keyConfig.keyUri,
            requestHeaders: {},
            timeout: this.keyConfig.timeout,
            requestAgent: new Agent({
                keepAlive: this.keyConfig.keepAlive,
                rejectUnauthorized: this.keyConfig.rejectUnauthorized,
            })
        });

        if(this.isDevelopmentMode) {
            client = new JwksClient({
                jwksUri: this.keyConfig.keyUri,
                requestHeaders: {},
                timeout: this.keyConfig.timeout,
                requestAgent: new Agent({
                    keepAlive: this.keyConfig.keepAlive,
                    rejectUnauthorized: this.keyConfig.rejectUnauthorized,
                    ca: this.keyConfig.zscallerKey
                })
            });
        }

        logger.info(`Authorizer:: KeyService:: getCertificate:: Done Setting the client`);
        try {
            logger.info(`Authorizer:: KeyService:: getCertificate:: Trying to fetch key from B2C for ${kid}`);
            const keyFromServer = await client.getSigningKey(kid);
            logger.info(`Authorizer:: KeyService:: getCertificate:: Got response from the server for ${kid}: Response: ${JSON.stringify(keyFromServer)}`);
            if (keyFromServer) {
                return keyFromServer.getPublicKey();
            }
            return null;
        }
        catch (err) {
            logger.error(`Authorizer:: KeyService:: getCertificate:: Error occurred while trying to read the key file`, err);
            throw err;
        }
    }

    private readLocalKeyFile() {
        try {
            logger.info(`Authorizer:: KeyService:: readLocalKeyFile:: Trying to resolve the public key from local file`);
            const file = this.keyConfig.localKey;
            logger.info(`Authorizer:: KeyService:: readLocalKeyFile:: Completed the reading from local file: result ${JSON.stringify(file)}`);
            return file;
        } catch (err: any) {
            logger.error(`Authorizer:: KeyService:: readLocalKeyFile:: Error occurred while trying to read the local file`, err);
            console.log(err.message);
            return null;
        }
    }
}

export const keyService =  new KeyService();
