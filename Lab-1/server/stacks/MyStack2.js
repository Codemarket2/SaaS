// import * as sst from "@serverless-stack/resources";

// export default class MyAppStack extends sst.Stack {
//   constructor(scope, id, props) {
//     super(scope, id, props);

//     const {
//       CognitoOperationUsersUserPoolId,
//       CognitoOperationUsersUserPoolClientId,
//       CognitoUserPoolId,
//       CognitoUserPoolClientId,
//       TenantDetailsTableArn,
//       TenantUserMappingTableArn,
//     } = props;

//     // Create Lambda Layer
//     const serverlessSaaSLayer = new sst.LayerVersion(
//       this,
//       "ServerlessSaaSLayer",
//       {
//         srcPath: "layers",
//         compatibleRuntimes: ["nodejs18.x"],
//         name: "serverless-saas-dependencies",
//       }
//     );

//     // Authorizer Role
//     const authorizerRole = new sst.Role(this, "AuthorizerExecutionRole", {
//       assumedBy: new sst.ServicePrincipal("lambda.amazonaws.com"),
//       managedPolicies: [
//         sst.ManagedPolicy.fromAwsManagedPolicyName(
//           "CloudWatchLambdaInsightsExecutionRolePolicy"
//         ),
//         sst.ManagedPolicy.fromAwsManagedPolicyName(
//           "service-role/AWSLambdaBasicExecutionRole"
//         ),
//         sst.ManagedPolicy.fromAwsManagedPolicyName("AWSXrayWriteOnlyAccess"),
//       ],
//       inlinePolicies: {
//         authorizerExecutionPolicy: new sst.PolicyDocument({
//           statements: [
//             new sst.PolicyStatement({
//               actions: ["cognito-idp:List*"],
//               resources: [
//                 `arn:aws:cognito-idp:${this.region}:${this.account}:userpool/*`,
//               ],
//             }),
//             new sst.PolicyStatement({
//               actions: ["dynamodb:GetItem"],
//               resources: [TenantDetailsTableArn],
//             }),
//           ],
//         }),
//       },
//     });

//     // Shared Services Authorizer Lambda
//     const sharedServicesAuthorizerFunction = new sst.Function(
//       this,
//       "SharedServicesAuthorizerFunction",
//       {
//         handler: "services/shared-service-authorizer.handler",
//         runtime: "nodejs18.x",
//         timeout: 29,
//         memorySize: 256,
//         environment: {
//           LOG_LEVEL: "DEBUG",
//           POWERTOOLS_METRICS_NAMESPACE: "ServerlessSaaS",
//           OPERATION_USERS_USER_POOL: CognitoOperationUsersUserPoolId,
//           OPERATION_USERS_APP_CLIENT: CognitoOperationUsersUserPoolClientId,
//         },
//         layers: [serverlessSaaSLayer],
//         permissions: [authorizerRole],
//       }
//     );

//     // Create IAM Roles and Lambdas for User Management
//     const createUserRole = new sst.Role(this, "CreateUserLambdaExecutionRole", {
//       assumedBy: new sst.ServicePrincipal("lambda.amazonaws.com"),
//       managedPolicies: [
//         sst.ManagedPolicy.fromAwsManagedPolicyName(
//           "CloudWatchLambdaInsightsExecutionRolePolicy"
//         ),
//         sst.ManagedPolicy.fromAwsManagedPolicyName(
//           "service-role/AWSLambdaBasicExecutionRole"
//         ),
//         sst.ManagedPolicy.fromAwsManagedPolicyName("AWSXrayWriteOnlyAccess"),
//       ],
//       inlinePolicies: {
//         createUserPolicy: new sst.PolicyDocument({
//           statements: [
//             new sst.PolicyStatement({
//               actions: ["cognito-idp:*"],
//               resources: ["*"],
//             }),
//             new sst.PolicyStatement({
//               actions: ["dynamodb:PutItem", "dynamodb:GetItem"],
//               resources: [TenantUserMappingTableArn, TenantDetailsTableArn],
//             }),
//           ],
//         }),
//       },
//     });

//     // Create Tenant Admin User Lambda
//     const createTenantAdminUserFunction = new sst.Function(
//       this,
//       "CreateTenantAdminUserFunction",
//       {
//         handler: "services/user-management.createTenantAdminUser",
//         runtime: "nodejs18.x",
//         timeout: 29,
//         environment: {
//           TENANT_USER_POOL: CognitoUserPoolId,
//           TENANT_APP_CLIENT: CognitoUserPoolClientId,
//           POWERTOOLS_SERVICE_NAME: "UserManagement.CreateTenantAdmin",
//           MONGODB_URI: process.env.MONGODB_URI,
//         },
//         layers: [serverlessSaaSLayer],
//         permissions: [createUserRole],
//       }
//     );

//     // Create User Lambda
//     const createUserFunction = new sst.Function(this, "CreateUserFunction", {
//       handler: "services/user-management.createUser",
//       runtime: "nodejs18.x",
//       timeout: 29,
//       environment: {
//         TENANT_USER_POOL: CognitoUserPoolId,
//         POWERTOOLS_SERVICE_NAME: "UserManagement.CreateUser",
//         MONGODB_URI: process.env.MONGODB_URI,
//       },
//       layers: [serverlessSaaSLayer],
//       permissions: [createUserRole],
//     });

//     // Update User Lambda
//     const updateUserFunction = new sst.Function(this, "UpdateUserFunction", {
//       handler: "services/user-management.updateUser",
//       runtime: "nodejs18.x",
//       timeout: 29,
//       environment: {
//         TENANT_USER_POOL: CognitoUserPoolId,
//         POWERTOOLS_SERVICE_NAME: "UserManagement.UpdateUser",
//         MONGODB_URI: process.env.MONGODB_URI,
//       },
//       layers: [serverlessSaaSLayer],
//       permissions: [createUserRole],
//     });

//     // Disable User Lambda
//     const disableUserFunction = new sst.Function(this, "DisableUserFunction", {
//       handler: "services/user-management.disableUser",
//       runtime: "nodejs18.x",
//       timeout: 29,
//       environment: {
//         TENANT_USER_POOL: CognitoUserPoolId,
//         POWERTOOLS_SERVICE_NAME: "UserManagement.DisableUser",
//         MONGODB_URI: process.env.MONGODB_URI,
//       },
//       layers: [serverlessSaaSLayer],
//       permissions: [createUserRole],
//     });

//     // Get User Lambda
//     const getUserFunction = new sst.Function(this, "GetUserFunction", {
//       handler: "services/user-management.getUser",
//       runtime: "nodejs18.x",
//       timeout: 29,
//       environment: {
//         TENANT_USER_POOL: CognitoUserPoolId,
//         POWERTOOLS_SERVICE_NAME: "UserManagement.GetUser",
//         MONGODB_URI: process.env.MONGODB_URI,
//       },
//       layers: [serverlessSaaSLayer],
//       permissions: [createUserRole],
//     });

//     // Outputs
//     this.addOutputs({
//       SharedServicesAuthorizerFunctionArn:
//         sharedServicesAuthorizerFunction.functionArn,
//       CreateTenantAdminUserFunctionArn:
//         createTenantAdminUserFunction.functionArn,
//       CreateUserFunctionArn: createUserFunction.functionArn,
//       UpdateUserFunctionArn: updateUserFunction.functionArn,
//       DisableUserFunctionArn: disableUserFunction.functionArn,
//       GetUserFunctionArn: getUserFunction.functionArn,
//     });
//   }
// }
