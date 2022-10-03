
import { configure, getLogger } from 'log4js';
import * as logConfiguration from './log4js.json';

configure(logConfiguration);

const log = getLogger('dbscriptsliquibase');
let logConfig: any = {};


export const setLogger = (event) => {
	logConfig = {
		reqContext: event.requestContext,
		queryParam: event.queryStringParameters
	};
};

export const logger = {
	error: (err) => {
		logConfig.messsage = err.message;
		logConfig.name = err.name;
		logConfig.trace = err.stack;
		logConfig.type = 'ERROR';
		log.error('printing specific error:', JSON.stringify(logConfig));
		delete logConfig.name;
		delete logConfig.trace;
	},
	debug: (message) => {
		logConfig.messsage = message;
		logConfig.type = 'DEBUG';
		log.info('printing system debug message:', JSON.stringify(logConfig));
	},
	info: (message) => {
		logConfig.messsage = message;
		logConfig.type = 'INFO';
		log.info('printing system info:', JSON.stringify(logConfig));
	},
	warn: (message) => {
		logConfig.messsage = message;
		logConfig.type = 'WARN';
		log.info('printing system warning:', JSON.stringify(logConfig));
	},
	fetal: (message) => {
		logConfig.messsage = message;
		logConfig.type = 'FETAL';
		log.info('printing system fetal issue:', JSON.stringify(logConfig));
	},
};