export interface KeyConfig {
    keyUri: string,
    timeout: number,
    keepAlive: boolean,
    rejectUnauthorized:  boolean,
    zscallerKey: string,
    localKey: string | undefined,
    region: string
}
