import * as sst from "@serverless-stack/resources";
import * as iam from "aws-cdk-lib/aws-iam";

export default function LambdaStack({stack}) {
  const MONGO_URI = process.env.MONGO_URI;

  // ✅ Lambda Layer (Equivalent to ServerlessSaaSLayers)
  const serverlessSaaSLayers = new sst.Function(stack, "ServerlessSaaSLayers", {
    handler: "layers",
    runtime: "nodejs18.x",
    bundle: false,
    description: "Shared utilities for logging and utils",
    nodeModules: ["aws-sdk","winston"],
  });

  // ✅ IAM Roles (Converted from AWS::IAM::Role)
  const authorizerExecutionRole = new iam.Role(stack, "AuthorizerExecutionRole", {
    assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    managedPolicies: [
      iam.ManagedPolicy.fromAwsManagedPolicyName("CloudWatchLambdaInsightsExecutionRolePolicy"),
      iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"),
      iam.ManagedPolicy.fromAwsManagedPolicyName("AWSXrayWriteOnlyAccess"),
    ],
    inlinePolicies: {
      AuthorizerPolicy: new iam.PolicyDocument({
        statements: [
          new iam.PolicyStatement({
            actions: ["cognito-idp:List*"],
            resources: [`arn:aws:cognito-idp:${app.region}:${app.account}:userpool/*`],
          }),
        ],
      }),
    },
  });

  // ✅ Shared Services Authorizer Function
  const sharedServicesAuthorizerFunction = new sst.Function(stack, "SharedServicesAuthorizerFunction", {
    handler: "functions/shared_service_authorizer.main",
    runtime: "nodejs18.x",
    timeout: 29,
    memorySize: 256,
    permissions: [authorizerExecutionRole], // todo
    permissions:['*'],
    environment: {
      MONGO_URI,
      OPERATION_USERS_USER_POOL: process.env.CognitoOperationUsersUserPoolId,
      OPERATION_USERS_APP_CLIENT: process.env.CognitoOperationUsersUserPoolClientId,
    },
    // layers: [serverlessSaaSLayers], //todo
  });

  // ✅ Define ALL Lambda Functions
  const lambdaConfigs = [
    { name: "CreateTenantFunction", handler: "functions/createTenant.main" },
    { name: "GetTenantFunction", handler: "functions/getTenant.main" },
    { name: "UpdateTenantFunction", handler: "functions/updateTenant.main" },
    { name: "DeactivateTenantFunction", handler: "functions/deactivateTenant.main" },
    { name: "ActivateTenantFunction", handler: "functions/activateTenant.main" },
    { name: "CreateUserFunction", handler: "functions/createUser.main" },
    { name: "DisableUserFunction", handler: "functions/disableUser.main" },
    { name: "EnableUsersByTenantFunction", handler: "functions/enableUsersByTenant.main" },
    { name: "DisableUsersByTenantFunction", handler: "functions/disableUsersByTenant.main" },
    { name: "RegisterTenantFunction", handler: "functions/registerTenant.main" },
    { name: "GetUsersFunction", handler: "functions/getUsers.main" },
    { name: "GetUserFunction", handler: "functions/getUser.main" },
    { name: "CreateTenantAdminUserFunction", handler: "functions/createTenantAdminUser.main" },
  ];

  const lambdaFunctions = {};
  lambdaConfigs.forEach(({ name, handler }) => {
    lambdaFunctions[name] = new sst.Function(stack, name, {
      handler,
      runtime: "nodejs18.x",
      timeout: 29,
      memorySize: 512,
      permissions: [authorizerExecutionRole],
      environment: {
        MONGO_URI,
      },
    //   layers: [serverlessSaaSLayers],
    });
  });

  // ✅ API Gateway (All Routes)
  const api = new sst.Api(stack, "ApiGateway", {
    defaults: {
      function: {
        // permissions: [authorizerExecutionRole], // todo
      },
    },
    routes: {
      "POST /tenant": lambdaFunctions.CreateTenantFunction,
      "GET /tenant/{tenantId}": lambdaFunctions.GetTenantFunction,
      "PUT /tenant/{tenantId}": lambdaFunctions.UpdateTenantFunction,
      "DELETE /tenant/{tenantId}": lambdaFunctions.DeactivateTenantFunction,
      "POST /tenant/activate": lambdaFunctions.ActivateTenantFunction,
      "POST /user": lambdaFunctions.CreateUserFunction,
      "POST /user/disable": lambdaFunctions.DisableUserFunction,
      "POST /users/enable": lambdaFunctions.EnableUsersByTenantFunction,
      "POST /users/disable": lambdaFunctions.DisableUsersByTenantFunction,
      "POST /register": lambdaFunctions.RegisterTenantFunction,
      "GET /users": lambdaFunctions.GetUsersFunction,
      "GET /user/{userId}": lambdaFunctions.GetUserFunction,
      "POST /user/admin": lambdaFunctions.CreateTenantAdminUserFunction,
    },
  });

  // ✅ Cognito User Pool & Client
//   const auth = new sst.Auth(stack, "CognitoAuth", {
//     cognito: true,
//     userPool: {
//       signInAliases: { email: true },
//     },
//     userPoolClient: {
//       authFlows: { userPassword: true },
//     },
//   });

  // ✅ Outputs
  stack.addOutputs({
    // ApiEndpoint: api.url,
    // CognitoUserPoolId: auth.cognitoUserPoolId,
    // CognitoUserPoolClientId: auth.cognitoUserPoolClientId,
    SharedServicesAuthorizerFunctionArn: sharedServicesAuthorizerFunction.functionArn,
    CreateTenantFunctionArn: lambdaFunctions.CreateTenantFunction.functionArn,
    GetTenantFunctionArn: lambdaFunctions.GetTenantFunction.functionArn,
    UpdateTenantFunctionArn: lambdaFunctions.UpdateTenantFunction.functionArn,
    DeactivateTenantFunctionArn: lambdaFunctions.DeactivateTenantFunction.functionArn,
    ActivateTenantFunctionArn: lambdaFunctions.ActivateTenantFunction.functionArn,
    CreateUserFunctionArn: lambdaFunctions.CreateUserFunction.functionArn,
    DisableUserFunctionArn: lambdaFunctions.DisableUserFunction.functionArn,
    EnableUsersByTenantFunctionArn: lambdaFunctions.EnableUsersByTenantFunction.functionArn,
    DisableUsersByTenantFunctionArn: lambdaFunctions.DisableUsersByTenantFunction.functionArn,
    RegisterTenantFunctionArn: lambdaFunctions.RegisterTenantFunction.functionArn,
    GetUsersFunctionArn: lambdaFunctions.GetUsersFunction.functionArn,
    GetUserFunctionArn: lambdaFunctions.GetUserFunction.functionArn,
    CreateTenantAdminUserFunctionArn: lambdaFunctions.CreateTenantAdminUserFunction.functionArn,
  });

  return { 
    lambdaFunctions, 
    // api,
    //  auth,
    //  sharedServicesAuthorizerFunction
     };
}
