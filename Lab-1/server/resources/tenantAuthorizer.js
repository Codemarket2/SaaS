import jwt from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";
import axios from "axios";
// import AWS from "aws-sdk";
import { ServiceIdentifier } from "../layers/nodejs/utils";
import { getPolicyForUser } from "../layers/nodejs/authManager";

const region = process.env.AWS_REGION;
const userpoolId = process.env.TENANT_USER_POOL;
const appclientId = process.env.TENANT_APP_CLIENT;

export const lambdaHandler = async (event) => {
  try {
    const tokenParts = event.authorizationToken.split(" ");
    if (tokenParts[0] !== "Bearer") {
      throw new Error(
        "Authorization header should have a format Bearer <JWT> Token"
      );
    }
    const jwtToken = tokenParts[1];
    console.info("Method ARN: ", event.methodArn);

    const keysUrl = `https://cognito-idp.${region}.amazonaws.com/${userpoolId}/.well-known/jwks.json`;
    const { data } = await axios.get(keysUrl);
    const keys = data.keys;

    const claims = await validateJWT(jwtToken, appclientId, keys);

    if (!claims) {
      throw new Error("Unauthorized");
    }

    const principalId = claims.sub;
    const userName = claims["username"];
    const tenantId = claims["custom:tenantId"];
    const userRole = claims["custom:userRole"];
    const policy = new AuthPolicy(principalId, event.methodArn);
    policy.allowAllMethods();
    const authResponse = policy.build();

    const iamPolicy = getPolicyForUser(
      userRole,
      ServiceIdentifier.BUSINESS_SERVICES,
      tenantId
    );
    // console.log("Generated IAM Policy:", iamPolicy);

    // const roleArn = `arn:aws:iam::${awsAccountId}:role/authorizer-access-role`;
    // const sts = new AWS.STS();

    // const assumedRole = await sts          //not being used now
    //   .assumeRole({
    //     RoleArn: roleArn,
    //     RoleSessionName: "tenant-aware-session",
    //     Policy: iamPolicy,
    //   })
    //   .promise();

    // const credentials = assumedRole.Credentials;       //not being used now

    // Pass STS credentials to Lambda
    authResponse.context = {
      // accessKey: credentials.AccessKeyId,
      // secretKey: credentials.SecretAccessKey,
      // sessionToken: credentials.SessionToken,
      userName: userName,
      tenantId: tenantId,
      userPoolId: userpoolId,
      userRole: userRole,
      permissions: iamPolicy,
    };

    return authResponse;
  } catch (error) {
    console.error("Error during authorization: ", error);
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

  return new Promise((resolve, reject) => {
    jwt.verify(token, pem, { algorithms: ["RS256"] }, (err, decoded) => {
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

class AuthPolicy {
  principalId;
  methodArn;
  policyDocument;

  constructor(principalId, methodArn) {
    this.principalId = principalId;
    this.methodArn = methodArn;
    this.policyDocument = {
      Version: "2012-10-17",
      Statement: [],
    };
  }

  allowAllMethods() {
    this._addMethod("Allow", "*");
  }

  _addMethod(effect, resource) {
    this.policyDocument.Statement.push({
      Action: "execute-api:Invoke",
      Effect: effect,
      Resource: resource,
    });
  }

  build() {
    return {
      principalId: this.principalId,
      policyDocument: this.policyDocument,
    };
  }
}
