import { getDbConfig, getKeyConfig, isDevelopmentMode } from "../config/config"
import { getLogger } from "log4js";
import { DbConfig } from "../types/db.config";
import { KeyConfig } from "../types/key.config";
import * as https from "https";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const logger = getLogger("lambda.resource");
const AWS = require("aws-sdk");
const AmazonDaxClient = require('amazon-dax-client');

class DatabaseService {
    private dbClient: DocumentClient;
    private dbConfig: DbConfig;
    private keyConfig: KeyConfig;
    private daxClient: any;

    constructor() {
        this.dbConfig = getDbConfig();
        this.keyConfig = getKeyConfig();

        if (isDevelopmentMode())
            this.awsConfigUpdateLocal();
        else
            this.awsConfigUpdate();
            const daxService = new AmazonDaxClient({ endpoints: [process.env.DAX_ENDPOINT], region: this.keyConfig.region });
            this.daxClient = new DocumentClient({ service: daxService });
            // For Fallback if the cache instance is unavailable
            this.dbClient = new DocumentClient({ apiVersion: this.dbConfig.apiVersion });
    }

    /**
     * Gets available client either dax or db
     * @returns  db client
     */
    getClient() {
        const client: any = this.daxClient != null ? this.daxClient : this.dbClient;
        return client;
    }

    /**
     * Saves public key
     * @param publicKey
     */
    async savePublicKey(kid: String, publicKey: String) {
        try {
            var params = {
                Item: {
                    kid: `b2c-${kid}`,
                    publicKey: publicKey
                },
                TableName: this.dbConfig.signingKeyTableName,
                ReturnConsumedCapacity: "TOTAL"
            };
            const result = await this.dbClient.put(params).promise();
            logger.info("Authorizer:: DatabaseService:: savePublicKey::  result", JSON.stringify(result));
        } catch (error) {
            console.log('error ', error);
        }
    }

    /**
     * update public key
     * @param publicKey
     */
    async updatePublicKey(kid: String, publicKey: String) {
        try {
            var params = {
                Key: {
                    kid: `b2c-${kid}`,
                },
                UpdateExpression: "set publicKey = :newPublicKey",
                ExpressionAttributeValues: {
                    ":newPublicKey": publicKey
                },
                ReturnValues: "ALL_NEW",
                TableName: this.dbConfig.signingKeyTableName,
                ReturnConsumedCapacity: "TOTAL"
            };
            const result = await this.dbClient.update(params).promise();
            logger.info("Authorizer:: DatabaseService:: updatePublicKey::  result", JSON.stringify(result));
        } catch (error) {
            console.log('error ', error);
        }
    }

    /**
     * Gets permissions or scope for each arn
     * @param event
     * @returns permissions
     */
    async getPermissions(event: any) {
        logger.info(`Authorizer:: DatabaseService:: getPermissions Trying to obtain permissions from DB: ${this.keyConfig.region} & ${this.dbConfig.tableName}`);
        try {
            const params = {
                TableName: this.dbConfig.tableName,
                Key: {
                    arn: event.methodArn
                }
            };

            const client: any = this.getClient();
            const result = await client.get(params).promise();
            logger.info(`Authorizer:: DatabaseService:: getPermissions obtained permissions from DB for ${JSON.stringify(result)}`);
            return result;
        } catch (err) {
            logger.error(`Authorizer:: DatabaseService:: getPermissions Error Occurred`, err);
        }
    }

    private awsConfigUpdate() {
        logger.info(`Authorizer:: DatabaseService:: awsConfigUpdate:: Setting region ${this.keyConfig.region}`);
        AWS.config.update({
            region: this.keyConfig.region
        });
    }

    private awsConfigUpdateLocal() {
        logger.info(`Authorizer:: DatabaseService:: awsConfigUpdateLocal:: Setting region ${this.keyConfig.region}`);
        AWS.config.update({
            region: this.keyConfig.region,
            httpOptions: {
                agent: new https.Agent({
                    ca: this.keyConfig.zscallerKey
                })
            }
        });
    }
}

export const databaseService = new DatabaseService();
