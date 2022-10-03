import { getJWTConfig } from "../config/config"
import { getLogger } from "log4js";
import { AuthorizationRequestData } from "../types/authorizationRequestData";
import { PolicyGeneratorData } from "../types/policyGeneratorData";
import { keyService } from "./key.service";
import { Effect } from "../types/effect";
import { JwtConfig } from "../types/jwt.config";
import { databaseService } from "./database.service";

const jwt = require('jsonwebtoken');
const logger = getLogger("lambda.resource");

export class TokenValidationService {
    private config: JwtConfig;

    constructor() {
        this.config = getJWTConfig();
    }

    async validateAccessToken(event: any): Promise<PolicyGeneratorData> {
        try {
            logger.info('Authorizer:: TokenValidatorService:: validateAccessToken:: Validating headers')
            const requestAuthHeader = TokenValidationService.requestHeaders(event.headers)
            logger.info(`Authorizer:: TokenValidatorService:: validateAccessToken:: Done validating headers: Result is ${requestAuthHeader ? 'Valid' : 'Invalid'}`);
            if (!requestAuthHeader) {
                throw Error('Invalid Request Header');
            }
            // TODO: Once the role permissions sorted out enable this: task 84985
            const scopesFromDb = await databaseService.getPermissions(event);

            logger.info(`Authorizer:: TokenValidatorService:: validateAccessToken:: Attempting to decode the token`);
            const decodedJwt = TokenValidationService.processJwtToken(event);
            if (!decodedJwt.appRole) {
                throw Error('App role missing on Header');
            }

            // STEP 2: check if the user has roles needed OR check if the API needs a role
            const rolesFromDb = await databaseService.getPermissions(decodedJwt.methodArn);
            let isRolesValid: boolean;
            if (rolesFromDb && rolesFromDb.Item) {
                // Roles from DB are in a list
                logger.info(`Authorizer:: TokenValidatorService:: validateAccessToken:: decodedJwt.appRole ${JSON.stringify(rolesFromDb.Item.role.values)}`);
                const roleListThatHasAccess = rolesFromDb.Item.role.values;

                isRolesValid = roleListThatHasAccess.some((p: string) => {
                    if (decodedJwt.appRole.includes(p))
                        return true;
                });
            }
            else {
                // Skipping the validation since a API - Role Map is not defined on the DB
                isRolesValid = true;
            }
            logger.debug(`Authorizer:: TokenValidatorService:: validateAccessToken:: hasFoundNeededRoleOrSkip: ${isRolesValid}`);
            if (!isRolesValid) {
                throw Error('User do not have the role needed for this operation');
            }

            // Step 3: Verify the JWT Token
            logger.debug(`Authorizer:: TokenValidatorService:: validateAccessToken:: Done Decoding the Token ${JSON.stringify(decodedJwt)}`);
            const publicKey = await TokenValidationService.getPublicKey(decodedJwt.kid);
            if (!publicKey) {
                throw Error('Unable to obtain the private key');
            }

            await databaseService.savePublicKey(decodedJwt.kid, publicKey);

            // validating the JWT Token with signed key
            let isValidJWT = await this.validateSignedJWT(requestAuthHeader, publicKey);
            // Checking if the token is not valid than call retry function
            isValidJWT = isValidJWT ? true : await this.retryGetPublicKey(decodedJwt, requestAuthHeader);
            logger.info(`Authorizer:: TokenValidatorService:: validateAccessToken:: JWT Validation result: ${isValidJWT}`);
            // Validating the scopes in DB vs Scope provided in request
            const isValidScopes = true; // decodedJwt.scopes.includes(scopesFromDb.Item.);
            logger.info(`Authorizer:: TokenValidatorService:: validateAccessToken:: Scope Validation result: ${isValidScopes}`);
            return {
                effect: isValidJWT && isRolesValid ? Effect.Allow : Effect.Deny,
                principalId: decodedJwt.user,
                action: decodedJwt.httpMethod,
                methodArn: decodedJwt.methodArn
            };
        }
        catch (err) {
            logger.error('Authorizer:: TokenValidatorService:: validateAccessToken Error: ', err);
            throw err;
        }
    }


    /**
     * retry to fetch public key
     * @param decodedJwt
     * @param requestAuthHeader
     */
    private async retryGetPublicKey(decodedJwt: any, requestAuthHeader: string) {
        const publicKey: any = await TokenValidationService.getPublicKey(decodedJwt.kid);
        const isValidJWT = await this.validateSignedJWT(requestAuthHeader, publicKey);
        logger.info(`Authorizer:: TokenValidatorService:: retryGetPublicKey:: JWT Validation result: ${isValidJWT}`);
        if (isValidJWT) {
            await databaseService.updatePublicKey(decodedJwt.kid, publicKey);
        }
        return isValidJWT;
    }

    private async validateSignedJWT(requestAuthHeader: string, publicKey: string) {
        try {
            const formattedTokenForVerify = {
                issuer: this.config.issuer,
                // We are passing clockTolerance value for some buffer time
                // We are not passing notBefore and expiresIn values as the jwt validates it by default
                clockTolerance: this.config.clockTolerance
            };
            logger.debug(`Authorizer:: TokenValidatorService:: validateSignedJWT:: Validating Signed JWT ${JSON.stringify(formattedTokenForVerify)}`);
            logger.info(`Authorizer:: TokenValidatorService:: validateSignedJWT:: Validating Signed JWT`);
            const payload = jwt.verify(requestAuthHeader, publicKey, formattedTokenForVerify);
            logger.debug(`Authorizer:: TokenValidatorService:: validateSignedJWT:: Validated Payload ${JSON.stringify(payload)}`);
            logger.info(`Authorizer:: TokenValidatorService:: validateSignedJWT:: Validated Payload`);
            return true;
        }
        catch (err) {
            logger.error('Authorizer:: TokenValidatorService:: validateAccessToken Error: ', err);
            return false;
        }
    }

    private static requestHeaders(tokenHeader: any): string {
        const authToken = tokenHeader['authorization'] ? tokenHeader['authorization'] : tokenHeader['Authorization'];
        return authToken.replace('Bearer ', '');
    }

    private static processJwtToken(event: any): AuthorizationRequestData {
        const processedToken = TokenValidationService.requestHeaders(event.headers);
        logger.info(`Authorizer:: TokenValidatorService:: processJwtToken:: Processed Token is ${processedToken}`);
        const decodedToken = TokenValidationService.splitAndDecodeToken(processedToken);
        logger.info(`Authorizer:: TokenValidatorService:: processJwtToken:: Processed Token is ${JSON.stringify(decodedToken)}`);
        const parsedHeader = JSON.parse(decodedToken.headers);
        logger.info(`Authorizer:: TokenValidatorService:: processJwtToken:: Processed Token header is ${JSON.stringify(parsedHeader)}`);
        const parsedBody = JSON.parse(decodedToken.body);
        logger.info(`Authorizer:: TokenValidatorService:: processJwtToken:: Processed Token Body is ${JSON.stringify(parsedBody)}`);

        return {
            user: parsedBody.emails[0],
            kid: parsedHeader.kid,
            scopes: [parsedBody.scp] ?? ['default'],
            resourceId: event.requestContext.resourceId,
            httpMethod: event.requestContext.httpMethod,
            methodArn: event.methodArn,
            appRole: parsedBody.extension_AppRole
        };
    }

    private static splitAndDecodeToken(token: string) {
        const tokenComponents = token.split('\.');
        logger.debug(`Authorizer:: TokenValidatorService:: splitAndDecodeToken:: Token has split ${JSON.stringify(tokenComponents)}`);
        return {
            headers: TokenValidationService.decodeBase64String(tokenComponents[0]),
            body: TokenValidationService.decodeBase64String(tokenComponents[1])
        }
    }

    private static decodeBase64String(encodedString: string): string {
        logger.info(`Authorizer:: TokenValidatorService:: decodeBase64String:: Attempting to decode`);
        const decodedString = Buffer.from(encodedString, 'base64').toString();
        logger.info(`Authorizer:: TokenValidatorService:: decodeBase64String:: Done decoding`);
        return decodedString;
    }

    private static async getPublicKey(kid: string) {
        return keyService.getPublicKey(kid);
    }
}

export const tokenValidationService = new TokenValidationService();
