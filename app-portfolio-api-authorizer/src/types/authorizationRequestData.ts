export interface AuthorizationRequestData {
    appRole: string[];
    kid: string,
    user: string,
    scopes: string[],
    resourceId: string,
    httpMethod: string,
    methodArn: any
}
