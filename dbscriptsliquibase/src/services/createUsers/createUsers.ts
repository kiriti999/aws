import { Client } from 'pg';
import { APIGatewayEvent } from 'aws-lambda';
import { closeClient, connectClient } from '../../utils/db';
import { logger } from '../../utils/logger';
import SaveToDb from './tasks/saveToDb';

export default class UserProvision {

	private _event: any;
	private _saveToDb: SaveToDb;

	constructor(event: APIGatewayEvent) {
		this._event = event;
		// this._getFromDb = new GetFromDb();
	}

	public async execute() {
		logger.info('SERVICE:: UserProvision:: UserProvision called');

		try {
			// const userData: User = JSON.parse(this._event);
			const { userId, orgId } = this._event;
			const client = await connectClient(orgId);
			const numOfUserAssigned = await this.createUsers(client, userId, orgId);
			logger.info('SERVICE:: UserProvision:: Successfully sent message to user provision');
			await closeClient(client);
			if (numOfUserAssigned) {
				return { userId };
			}
			return false;
		} catch (error: any) {
			logger.error({ message: 'SERVICE:: UserProvision:: Unable to Assign to user' });
			throw error;
		}
	}

	private async createUsers(client: Client, userId: string, orgId: string) {
		// const hasDuplicateUserRole = await this.isDuplicateUser(client, userId, roleId);
		// if (!hasDuplicateUserRole) {
		const numOfUserAssigned = await this._saveToDb.AddUsers(client, userId, orgId);
		return numOfUserAssigned;
		// }
	}

}