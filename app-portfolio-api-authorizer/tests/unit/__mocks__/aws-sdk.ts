export const promiseResponse = jest.fn().mockReturnValue(Promise.resolve(true));
const mockGetFunction = jest.fn().mockImplementation(() => ({promise: promiseResponse}));

class DocumentClient {
    get = mockGetFunction
}

const awsConfig = { update: jest.fn() };

export const DynamoDB = { DocumentClient };
export const config = awsConfig;
