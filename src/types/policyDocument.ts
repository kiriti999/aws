export interface PolicyDocument {
    principalId: string,
    policyDocument: {
        Version: string,
        Statement: Statement[]
    }
}

export interface Statement {
    Action: string,
    Effect: string,
    Resource: string
}
