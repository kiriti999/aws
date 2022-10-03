import { Client, ClientConfig, QueryConfig, QueryResult } from 'pg';
import { envConfig } from '../config/environment';
import { logger } from '../logger';

/**
 * @description Connect with postgres db
 */
export const connectClient = async (orgId: string | undefined) => {
	const { host, port, user, database, password, connectionTimeoutMillis } = envConfig;
	const dbConfig: ClientConfig = {
		host,
		port,
		user,
		password,
		database,
		connectionTimeoutMillis
	};
	const client = new Client(dbConfig);
	await client.connect();
	if (orgId) {
		await client.query(`SET app.current_tenant = "${orgId}"`);
	}
	logger.info('db:: connectClient:: connected to db');
	return client;
};

/**
 * @description Disconnect postgres db connection
 */
export const closeClient = async (client: Client) => {
	await client.end();
	logger.info('db:: closeClient:: closed db connection');
};

/**
 * @param queryStr: query string
 * @returns Returns db query result
 */
export const query = async (client, queryStr: string | QueryConfig) => {
	try {
		const res = await client.query(queryStr);
		logger.info('db:: query:: received db response');
		return res as QueryResult;
	} catch (ex) {
		logger.error({ message: `query:: db response ${ex}` });
		throw ex;
	}
};

