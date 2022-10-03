
exports.lambda_handler = async (event) => {
    let apiGatewayArnTmp, apiKey, authResponse, awsAccountId, policy, principalId, tmp, usageIdentifierKey;
    console.log("event ", event);
    apiKey = event["queryStringParameters"]["apiKey"];
    principalId = "user|a1b2c3d4";
    tmp = event["methodArn"].split(":");
    apiGatewayArnTmp = tmp[5].split("/");
    awsAccountId = tmp[4];
    policy = new AuthPolicy(principalId, awsAccountId);
    policy.restApiId = apiGatewayArnTmp[0];
    policy.region = tmp[3];
    policy.stage = apiGatewayArnTmp[1];
    policy.allowMethod(HttpVerb.POST, "/shortfunnel-health");
    authResponse = policy.build();
    context = {
        "SomeKey": "SomeValue"
    };
    usageIdentifierKey = apiKey;
    authResponse["context"] = context;
    authResponse["usageIdentifierKey"] = usageIdentifierKey;
    console.log(authResponse);
    return authResponse;
};

const HttpVerb = {
    "ALL": "*",
    "POST": "POST",
    "GET": "GET"
};
var AuthPolicy = /** @class */ (function () {
    function AuthPolicy(principal, awsAccountId) {
        this.version = "2012-10-17";
        this.pathRegex = new RegExp('^[/.a-zA-Z0-9-\*]+$');
        this.restApiId = "<<restApiId>>";
        this.region = "<<region>>";
        this.stage = "<<stage>>";
        this.awsAccountId = awsAccountId;
        this.principalId = principal;
        this.allowMethods = [];
        this.denyMethods = [];
    }
    AuthPolicy.prototype._addMethod = function (effect, verb, resource, conditions) {
        var resourceArn, resourcePattern;
        try {
            if (verb !== "*" && !(verb in HttpVerb)) {
                console.log("Invalid verb ", verb);
                throw new Error("Invalid HTTP verb " + verb + ". Allowed verbs in HttpVerb class");
            }
            if (!this.pathRegex.test(resourcePattern)) {
                console.log("Invalid resource path ", resource);
                throw new Error("Invalid resource path: " + resource + ". Path should match " + this.pathRegex);
            }
            if (resource.slice(0, 1) === "/") {
                resource = resource.slice(1);
            }

            resourceArn = "arn:aws:execute-api:" + this.region + ":" + this.awsAccountId + ":" + this.restApiId + "/" + this.stage + "/" + verb + "/" + resource;
            if (effect.toLowerCase() === "allow") {
                this.allowMethods.push({
                    "resourceArn": resourceArn,
                    "conditions": conditions
                });
            }
            else {
                if (effect.toLowerCase() === "deny") {
                    this.denyMethods.push({
                        "resourceArn": resourceArn,
                        "conditions": conditions
                    });
                }
            }
        } catch (error) {
            console.log('_addMethod:: error:', error);
        }

    };
    AuthPolicy.prototype._getEmptyStatement = function (effect) {
        try {
            var statement = {
                "Action": "execute-api:Invoke",
                "Effect": effect.slice(0, 1).toUpperCase() + effect.slice(1).toLowerCase(),
                "Resource": []
            };
        } catch (error) {
            console.log('AuthPolicy.prototype._getEmptyStatement:: error: ', error);
        }
        return statement;
    };
    AuthPolicy.prototype._getStatementForEffect = function (effect, methods) {
        console.log(`AuthPolicy.prototype._getStatementForEffect:: effect: ${effect} methods: ${methods}`);
        var conditionalStatement, statement, statements;
        statements = [];
        try {
            if (methods.length > 0) {
                statement = this._getEmptyStatement(effect);
                for (let index = 0; index < methods.length; index++) {
                    let curMethod = methods[index];
                    if (curMethod["conditions"] === null || curMethod["conditions"].length === 0) {
                        statement["Resource"].push(curMethod["resourceArn"]);
                    }
                    else {
                        conditionalStatement = this._getEmptyStatement(effect);
                        conditionalStatement["Resource"].push(curMethod["resourceArn"]);
                        conditionalStatement["Condition"] = curMethod["conditions"];
                        statements.push(conditionalStatement);
                    }
                }
                statements.push(statement);
            }
        } catch (error) {
            console.log("AuthPolicy.prototype._getStatementForEffect:: error: ", error);
        }

        console.log("AuthPolicy.prototype._getStatementForEffect:: statements: ", statements);
        return statements;
    };
    AuthPolicy.prototype.allowAllMethods = function () {
        this._addMethod("Allow", HttpVerb.ALL, "*", []);
    };
    AuthPolicy.prototype.denyAllMethods = function () {
        this._addMethod("Deny", HttpVerb.ALL, "*", []);
    };
    AuthPolicy.prototype.allowMethod = function (verb, resource) {
        this._addMethod("Allow", verb, resource, []);
    };
    AuthPolicy.prototype.denyMethod = function (verb, resource) {
        this._addMethod("Deny", verb, resource, []);
    };
    AuthPolicy.prototype.allowMethodWithConditions = function (verb, resource, conditions) {
        this._addMethod("Allow", verb, resource, conditions);
    };
    AuthPolicy.prototype.denyMethodWithConditions = function (verb, resource, conditions) {
        this._addMethod("Deny", verb, resource, conditions);
    };
    AuthPolicy.prototype.build = function () {
        var policy;
        try {
            if ((this.allowMethods === null || this.allowMethods.length === 0) && (this.denyMethods === null || this.denyMethods.length === 0)) {
                console.log("No statements defined for the policy");
                throw new Error("No statements defined for the policy");
            }
            policy = {
                "principalId": this.principalId,
                "policyDocument": {
                    "Version": this.version,
                    "Statement": []
                }
            };
            console.log('AuthPolicy.prototype.build:: this.allowMethods: ', this.allowMethods);

            const allowStatements = this._getStatementForEffect("Allow", this.allowMethods);
            console.log('AuthPolicy.prototype.build:: allowStatements ', allowStatements);

            policy["policyDocument"]["Statement"].push(...this._getStatementForEffect("Allow", this.allowMethods));
            policy["policyDocument"]["Statement"].push(...this._getStatementForEffect("Deny", this.denyMethods));
        } catch (error) {
            console.log('AuthPolicy.prototype.build:: error: ', error);
        }

        console.log('AuthPolicy.prototype.build:: policy: ', policy);
        return policy;
    };
    return AuthPolicy;
}());