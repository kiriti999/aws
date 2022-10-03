import { lambdaHandler as authorizeHandler } from "../../../src/handlers/authorizeRequest"
import { fakeEvent, expectedAllowPolicy, fakeTokenData, expectedDenyPolicy } from "../mocks/auth-request";
import { tokenValidatorService } from "../../../src/services/tokenValidator.service";

jest.mock("../../../src/services/tokenValidator.service", () => ({
    __esModule: true,
    tokenValidatorService: {
        validateAccessToken: jest.fn()
    }
}));

const context: any = {};

describe('Tests authorizer lambda handlers', function () {
    it('Should return allow policy for valid token', async () => {
        const accessTokenMock = tokenValidatorService.validateAccessToken as any;
        accessTokenMock.mockImplementation(async () => fakeTokenData);
        const event = { ...fakeEvent };
        const result = await authorizeHandler(event, context, () => { })
        expect(result).toMatchObject(expectedAllowPolicy);
    });

    it('Should return deny policy for invalid token', async () => {
        const accessTokenMock = tokenValidatorService.validateAccessToken as any;
        accessTokenMock.mockImplementation(async () => { throw new Error('Invalid audience') });
        const event = { ...fakeEvent };
        const result = await authorizeHandler(event, context, () => { })
        expect(result).toMatchObject(expectedDenyPolicy);
    });
});
