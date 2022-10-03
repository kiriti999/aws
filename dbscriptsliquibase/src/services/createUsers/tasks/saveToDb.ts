import { logger } from '../../../utils/logger';
import { query } from '../../../utils/db';
import { Client } from 'pg';

export default class SaveToDb {

    constructor() { }

    async AddUsers(client: Client, userId: string, orgId: string) {
        const result = await query(client, {
            text: 'INSERT INTO user (user_id, org_id) VALUES ($1, $2)',
            values: [userId, orgId]
        });
        logger.info('task:: saveUser:: Added user successfully');
        return result.rowCount;
    }

    async deleteUsers(client: Client, userId: string) {
        const queryText = `DELETE FROM user WHERE user_id = '${userId}'`;
        const result = await query(client, { text: queryText });
        logger.info('task:: deleteUser: delete matched user');
        return result;
    }
}