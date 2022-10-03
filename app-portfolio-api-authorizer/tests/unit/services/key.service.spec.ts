
export const fakeKey: string = "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtVKUtcx/n9rt5afY/2WF\nNvU6PlFMggCatsZ3l4RjKxH0jgdLq6CScb0P3ZGXYbPzXvmmLiWZizpb+h0qup5j\nznOvOr+Dhw9908584BSgC83YacjWNqEK3urxhyE2jWjwRm2N95WGgb5mzE5XmZIv\nkvyXnn7X8dvgFPF5QwIngGsDG8LyHuJWlaDhr/EPLMW4wHvH0zZCuRMARIJmmqiM\ny3VD4ftq4nS5s8vJL0pVSrkuNojtokp84AtkADCDU/BUhrc2sIgfnvZ03koCQRoZ\nmWiHu86SuJZYkDFstVTVSR0hiXudFlfQ2rOhPlpObmku68lXw+7V+P7jwrQRFfQV\nXwIDAQAB\n-----END PUBLIC KEY-----";
const getSigningKey = () => Promise.resolve({ getPublicKey: () => fakeKey })
const JwksClient = jest.fn();
JwksClient.mockImplementation(() => ({ getSigningKey }));
jest.mock('jwks-rsa', () => ({ JwksClient }));
delete process.env.LOCALKEY;

describe('Tests Key Service', function () {
    let keyService: any;

    beforeEach(() => {
        return import('../../../src/services/key.service').then(module => {
            keyService = module.keyService;
            jest.resetModules();
        });
    });

    afterEach(()=>{
        process.env.LOCALKEY = fakeKey;
    })
    it('Should fetch publick key from azure B2C', async () => {
        const result = await keyService.getPublicKey(fakeKey);
        expect(result).toEqual(fakeKey);
    });

    it('Should load the public key from env value', async () => {
        const result = await keyService.getPublicKey(fakeKey);
        expect(result).toEqual(fakeKey);
    });
});
