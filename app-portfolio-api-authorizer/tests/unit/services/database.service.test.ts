import { DynamoDB, promiseResponse } from "../__mocks__/aws-sdk";
import { databaseService } from "../../../src/services/database.service";
import { dbResponse } from "../mocks/db-response";

jest.mock('../../../src/services/database.service');

describe('Testing the Database Service', function () {
    const db = new DynamoDB.DocumentClient();

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('Testing the DB Call to DynamoDD Document Client', async () => {
        await databaseService.getPermissions(dbResponse.arn);
        expect(db.get).toBeCalledTimes(1);
    });

    it('Testing the DB Call', async () => {
        const expectedResult = dbResponse;
        promiseResponse.mockReturnValueOnce(Promise.resolve(dbResponse));
        const result = await databaseService.getPermissions(dbResponse.arn);
        expect(result).toEqual(expectedResult);
    });

    it('Test: Should verify if key is saved', async () => {
        jest.spyOn(databaseService, "savePublicKey").mockImplementation(() => Promise.resolve());
        const result = await databaseService.savePublicKey('123', '1a2b3c');
        expect(result).toEqual(undefined);
    });

    it('Test: Should verify if key is updated', async () => {
        jest.spyOn(databaseService, "updatePublicKey").mockImplementation(() => Promise.resolve());
        await expect(databaseService.updatePublicKey('123', '1a2b3c')).resolves.toBe(undefined);
    });

});
