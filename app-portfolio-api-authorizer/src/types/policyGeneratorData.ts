import {Effect} from "./effect";

export interface PolicyGeneratorData {
    principalId: string,
    action: string,
    effect: Effect,
    methodArn: string
}
