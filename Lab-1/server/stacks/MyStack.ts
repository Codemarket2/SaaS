import "dotenv/config";
import { Api, 
  // Cognito,StackContext,
  Function } from "sst/constructs";
import { setMaxListeners } from "events";
// import {
//   StringAttribute,
//   OAuthScope,
//   AccountRecovery,
//   CfnUserPoolUserToGroupAttachment,
//   CfnUserPoolGroup,
//   UserPoolClientIdentityProvider,
//   CfnUserPoolUser,
//   ClientAttributes,
//   VerificationEmailStyle
// } from "aws-cdk-lib/aws-cognito";
// import * as ssm from "aws-cdk-lib/aws-ssm";
import {CongitoStack } from './CognitoStack'
// import * as sst from "@serverless-stack/resources";
// import * as iam from "aws-cdk-lib/aws-iam";
// import {activateTenant,createTenant,createTenantAdminUser,deactivateTenant,getTenant,getTenants,registerTenant,updateTenant} from '../services/TenantManagementService'

export function MyStack({stack}) {
  // const {stack}=app
  setMaxListeners(20);

  // ✅ Lambda Layer (Equivalent to ServerlessSaaSLayers)
  // const serverlessSaaSLayers = new sst.Function(stack, "ServerlessSaaSLayers", { // todo
  //   handler: "layers",
  //   runtime: "nodejs16.x",
  //   bundle: false,
  //   description: "Shared utilities for logging and utils",
  //   // nodeModules: ["aws-sdk","winston"], /// todo
  // });

  // ✅ IAM Roles (Converted from AWS::IAM::Role)
  // const authorizerExecutionRole = new iam.Role(stack, "AuthorizerExecutionRole", { // todo
  //   assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
  //   managedPolicies: [
  //     iam.ManagedPolicy.fromAwsManagedPolicyName("CloudWatchLambdaInsightsExecutionRolePolicy"),
  //     iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"),
  //     iam.ManagedPolicy.fromAwsManagedPolicyName("AWSXrayWriteOnlyAccess"),
  //   ],
  //   inlinePolicies: {
  //     AuthorizerPolicy: new iam.PolicyDocument({
  //       statements: [
  //         new iam.PolicyStatement({
  //           actions: ["cognito-idp:List*"],
  //           resources: [`arn:aws:cognito-idp:${app.region}:${app.account}:userpool/*`],
  //         }),
  //       ],
  //     }),
  //   },
  // });

  // ✅ Shared Services Authorizer Function //todo
  // const sharedServicesAuthorizerFunction = new sst.Function(stack, "SharedServicesAuthorizerFunction", {
  //   handler: "functions/shared_service_authorizer.main",
  //   runtime: "nodejs16.x",
  //   timeout: 29,
  //   memorySize: 256,
  //   // permissions: [authorizerExecutionRole], // todo
  //   permissions:['appsync','events','execute-api','kinesis','lambda','rds-data','s3','secretsmanager','sns','sqs','ssm'],
  //   environment: {
  //     MONGO_URI:process.env.MONGO_URI,
  //     OPERATION_USERS_USER_POOL: process.env.CognitoOperationUsersUserPoolId,
  //     OPERATION_USERS_APP_CLIENT: process.env.CognitoOperationUsersUserPoolClientId,
  //   },
  //   // layers: [serverlessSaaSLayers], //todo
  // });

  // ✅ Define ALL Lambda Functions
  const lambdaConfigs = [
    { name: "CreateTenantFunction", handler:"services/TenantManagementService/index.createTenant"},
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
    // console.log("handler",handler)
    lambdaFunctions[name] = new Function(stack, name, {
      handler,
      runtime: "nodejs16.x",
      timeout: 29,
      memorySize: 512,
      permissions:['appsync','events','execute-api','kinesis','lambda','rds-data','s3','secretsmanager','sns','sqs','ssm'],
      // permissions: [authorizerExecutionRole], // todo
      environment: {
        MONGO_URI: process.env.MONGO_URI,
      },
      // layers: [serverlessSaaSLayers], //todo
    });
  });

  // const fun= 


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
// const createTenantFunction = new Function(stack, "CreateTenantFunction", {
//   handler: "services/TenantManagementService/tenant-management.create",
//   runtime: "nodejs18.x",
//   timeout: 30,
//   memorySize: 512,
//   permissions: ["dynamodb", "s3"], // Adjust as needed
//   environment: {
//     MONGO_URI: process.env.MONGO_URI,
//   },
// });

  const Congito= CongitoStack({stack})
  const api = new Api(this, "Api", {
    // defaults: {
    //   function: {
    //     // permissions: [authorizerExecutionRole], // todo
    //     timeout: 30,
    //     environment: {
    //       MONGO_URI: process.env.MONGO_URI,
    //     },
    //   },
    // },
    routes: {
      "POST /tenant": lambdaFunctions.CreateTenantFunction,
      // "GET /tenant/{tenantId}": lambdaFunctions.GetTenantFunction,
      // "PUT /tenant/{tenantId}": lambdaFunctions.UpdateTenantFunction,
      // "DELETE /tenant/{tenantId}": lambdaFunctions.DeactivateTenantFunction,
      // "POST /tenant/activate": lambdaFunctions.ActivateTenantFunction,
      // "POST /user": lambdaFunctions.CreateUserFunction,
      // "POST /user/disable": lambdaFunctions.DisableUserFunction,
      // "POST /users/enable": lambdaFunctions.EnableUsersByTenantFunction,
      // "POST /users/disable": lambdaFunctions.DisableUsersByTenantFunction,
      // "POST /register": lambdaFunctions.RegisterTenantFunction,
      // "GET /users": lambdaFunctions.GetUsersFunction,
      // "GET /user/{userId}": lambdaFunctions.GetUserFunction,
      // "POST /user/admin": lambdaFunctions.CreateTenantAdminUserFunction,

      // "GET /products": "services/TenantManagementService/tenant-management.createTenant",
      // "GET /products": "services/ProductService/index.handler",
      // "POST /products": "services/ProductService/index.handler",
      // "GET /orders": "services/OrderService/index.handler",
      // "POST /orders": "services/OrderService/index.handler",
    },
  });


  // Output the API endpoint
  stack.addOutputs({
    ApiEndpoint: api.url,
    CreateTenantFunctionArn:lambdaFunctions.CreateTenantFunction.functionArn,
    // GetTenantFunctionArn: lambdaFunctions.GetTenantFunction.functionArn,
    // UpdateTenantFunctionArn: lambdaFunctions.UpdateTenantFunction.functionArn,
    // DeactivateTenantFunctionArn: lambdaFunctions.DeactivateTenantFunction.functionArn,
    // ActivateTenantFunctionArn: lambdaFunctions.ActivateTenantFunction.functionArn,
    // CreateUserFunctionArn: lambdaFunctions.CreateUserFunction.functionArn,
    // DisableUserFunctionArn: lambdaFunctions.DisableUserFunction.functionArn,
    // EnableUsersByTenantFunctionArn: lambdaFunctions.EnableUsersByTenantFunction.functionArn,
    // DisableUsersByTenantFunctionArn: lambdaFunctions.DisableUsersByTenantFunction.functionArn,
    // RegisterTenantFunctionArn: lambdaFunctions.RegisterTenantFunction.functionArn,
    // GetUsersFunctionArn: lambdaFunctions.GetUsersFunction.functionArn,
    // GetUserFunctionArn: lambdaFunctions.GetUserFunction.functionArn,
    // CreateTenantAdminUserFunctionArn: lambdaFunctions.CreateTenantAdminUserFunction.functionArn,
    // CognitoAdminUserGroupName:CognitoAddUserToGroup1.groupName
      //   // ApiEndpoint: api.url,
  //   // CognitoUserPoolId: auth.cognitoUserPoolId,
  //   // CognitoUserPoolClientId: auth.cognitoUserPoolClientId,
  //   // SharedServicesAuthorizerFunctionArn: sharedServicesAuthorizerFunction.functionArn,
  });
}
