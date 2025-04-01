// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

// import {
//   APIGatewayTokenAuthorizerEvent,
//   APIGatewayAuthorizerResult,
// } from "aws-lambda";
// import { CognitoIdentityServiceProvider, STS, DynamoDB } from "aws-sdk";
import jwt from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";
import axios from "axios";
import * as authManager from "../layers/nodejs/authManager";
import { ServiceIdentifier } from "../layers/nodejs/utils";

const region = process.env.AWS_REGION;
// const stsClient = new STS({ region });
// const dynamoDB = new DynamoDB.DocumentClient();
// const tableTenantDetails = "ServerlessSaaS-TenantDetails";
const userPoolOperationUser = process.env.OPERATION_USERS_USER_POOL;
const appClientOperationUser = process.env.OPERATION_USERS_APP_CLIENT;
const tenantUserPoolId = process.env.TENANT_USER_POOL;
const tenantAppClientId = process.env.TENANT_APP_CLIENT;

export const lambdaHandler = async (event) => {
  try {
    const tokenParts = event.authorizationToken.split(" ");
    if (tokenParts[0] !== "Bearer") {
      throw new Error(
        "Authorization header should have a format Bearer <JWT> Token"
      );
    }
    const jwtBearerToken = tokenParts[1];
    console.info("Method ARN: ", event.methodArn);

    const unauthorizedClaims = jwt.decode(jwtBearerToken);
    console.info(unauthorizedClaims);

    let userPoolId, appClientId;

    if (authManager.isSaaSProvider(unauthorizedClaims["custom:userRole"])) {
      // assuming it's a admin (Operational user) //us-east-1_KMm6Bcil3 // 	42mt3mrc20dkqni8ttvmbeeadl
      userPoolId = userPoolOperationUser;
      appClientId = appClientOperationUser;
    } else {
      // assuming it's not a admin (PooledTenant user) //us-east-1_RvRSSxEXN
      userPoolId = tenantUserPoolId;
      appClientId = tenantAppClientId;
    }
    const keysUrl = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
    const { data } = await axios.get(keysUrl);
    const keys = data.keys;

    const claims = await validateJWT(jwtBearerToken, appClientId, keys);

    if (!claims) {
      throw new Error("Unauthorized");
    }

    // console.info(claims);
    const principalId = claims.sub;
    const userName = claims["username"];
    const tenantId = claims["custom:tenantId"];
    const userRole = claims["custom:userRole"];

    const tmp = event.methodArn.split(":");
    const apiGatewayArnTmp = tmp[5].split("/");
    const awsAccountId = tmp[4];

    const policy = new AuthPolicy(principalId, awsAccountId);
    policy.restApiId = apiGatewayArnTmp[0];
    policy.region = tmp[3];
    policy.stage = apiGatewayArnTmp[1];

    if (
      authManager.isTenantAdmin(userRole) ||
      authManager.isSystemAdmin(userRole)
    ) {
      policy.allowAllMethods();
      if (authManager.isTenantAdmin(userRole)) {
        policy.denyMethod(HttpVerb.POST, "tenant-activation");
        policy.denyMethod(HttpVerb.GET, "tenants");
      }
    } else {
      policy.allowMethod(HttpVerb.GET, "user/*");
      policy.allowMethod(HttpVerb.PUT, "user/*");
    }

    const authResponse = policy.build();
    const iamPolicy = authManager.getPolicyForUser(
      userRole,
      ServiceIdentifier.SHARED_SERVICES,
      tenantId
    );
    authResponse.context = {
      userName,
      userPoolId,
      tenantId,
      userRole,
      permissions: iamPolicy,
    };

    return authResponse;
  } catch (error) {
    console.error("Authorization error: ", error);
    throw new Error("Unauthorized");
  }
};

const validateJWT = async (token, appClientId, keys) => {
  const decodedHeader = jwt.decode(token, { complete: true });
  if (!decodedHeader || !decodedHeader.header.kid) {
    throw new Error("Invalid token");
  }
  const kid = decodedHeader.header.kid;
  const key = keys.find((k) => k.kid === kid);

  if (!key) {
    throw new Error("Public key not found in jwks.json");
  }

  const pem = jwkToPem(key);

  return new Promise(async (resolve, reject) => {
    await jwt.verify(token, pem, { algorithms: ["RS256"] }, (err, decoded) => {
      if (err) {
        console.error("Token verification failed", err);
        return reject(false);
      }
      if (decoded.client_id !== appClientId) {
        console.error("Token was not issued for this audience");
        return reject(false);
      }
      resolve(decoded);
    });
  });
};

class HttpVerb {
  static GET = "GET";
  static POST = "POST";
  static PUT = "PUT";
  static PATCH = "PATCH";
  static HEAD = "HEAD";
  static DELETE = "DELETE";
  static OPTIONS = "OPTIONS";
  static ALL = "*";
}

class AuthPolicy {
  awsAccountId;
  principalId;
  version = "2012-10-17";
  pathRegex = /^[/.a-zA-Z0-9-*]+$/;
  allowMethods = [];
  denyMethods = [];
  restApiId = "*";
  region = "*";
  stage = "*";

  constructor(principal, awsAccountId) {
    this.awsAccountId = awsAccountId;
    this.principalId = principal;
  }

  _addMethod(effect, verb, resource, conditions = null) {
    if (verb !== "*" && !HttpVerb[verb]) {
      throw new Error(
        `Invalid HTTP verb ${verb}. Allowed verbs are defined in HttpVerb class.`
      );
    }
    if (!this.pathRegex.test(resource)) {
      throw new Error(
        `Invalid resource path: ${resource}. Path should match ${this.pathRegex}`
      );
    }

    if (resource.startsWith("/")) {
      resource = resource.slice(1);
    }

    const resourceArn = `arn:aws:execute-api:${this.region}:${this.awsAccountId}:${this.restApiId}/${this.stage}/${verb}/${resource}`;

    if (effect.toLowerCase() === "allow") {
      this.allowMethods.push({ resourceArn, conditions });
    } else if (effect.toLowerCase() === "deny") {
      this.denyMethods.push({ resourceArn, conditions });
    }
  }

  allowAllMethods() {
    this._addMethod("Allow", HttpVerb.ALL, "*");
  }

  denyAllMethods() {
    this._addMethod("Deny", HttpVerb.ALL, "*");
  }

  allowMethod(verb, resource) {
    this._addMethod("Allow", verb, resource);
  }

  denyMethod(verb, resource) {
    this._addMethod("Deny", verb, resource);
  }

  build() {
    if (this.allowMethods.length === 0 && this.denyMethods.length === 0) {
      throw new Error("No statements defined for the policy");
    }

    const policyDocument = {
      Version: this.version,
      Statement: [
        ...this._getStatementsForEffect("Allow", this.allowMethods),
        ...this._getStatementsForEffect("Deny", this.denyMethods),
      ],
    };

    return {
      principalId: this.principalId,
      policyDocument,
    };
  }

  _getStatementsForEffect(effect, methods) {
    return methods.map((method) => {
      const statement = {
        Action: "execute-api:Invoke",
        Effect: effect,
        Resource: method.resourceArn,
      };
      if (method.conditions) {
        statement.Condition = method.conditions;
      }
      return statement;
    });
  }
}
