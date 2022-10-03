import { getLogger } from "log4js";
import {PolicyDocument} from "../types/policyDocument";
import {PolicyGeneratorData} from "../types/policyGeneratorData";
const logger = getLogger("lambda.resource");

export class PolicyGenerator {
    private policyVersion: string = '2012-10-17';
    private policyAction: string = 'execute-api:Invoke';

    generatePolicy(policyData: PolicyGeneratorData) : PolicyDocument {
        logger.info(`Authorizer:: PolicyGenerator:: generatePolicy:: Trying to generate a policy with data ${JSON.stringify(policyData)}`);
        const policy: PolicyDocument = {
            principalId: policyData.principalId,
            policyDocument: {
                Version: this.policyVersion,
                Statement: [
                    {
                        Action: this.policyAction,
                        Effect: policyData.effect,
                        Resource: policyData.methodArn
                    }
                ]
            }
        }
        logger.info(`Authorizer:: PolicyGenerator:: generatePolicy:: Generated the policy ${JSON.stringify(policy)}`);
        return policy;
    }
}

export const policyGenerator = new PolicyGenerator();
