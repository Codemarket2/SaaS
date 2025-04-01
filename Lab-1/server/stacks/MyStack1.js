// import { StackContext, Api, Function, Effect } from "sst/constructs";
// import * as iam from "aws-cdk-lib/aws-iam";
// import * as logs from "aws-cdk-lib/aws-logs";

// export function ApiStack({ stack }: StackContext) {
//   // Define the API Gateway
//   const api = new Api(stack, "AdminApiGatewayApi", {
//     cors: true,
//     accessLog: true,
//     defaults: {
//       authorizer: "none",
//       function:{
//         // layers:[] // need to add layer here
//       }
//     },
//     routes: {
//       "POST /registration": "functions/registerTenant.main",
//       "PUT /tenant/activation/{tenantid}": "functions/activateTenant.main",
//       "GET /tenants": "functions/getTenants.main",
//       "POST /tenant": "functions/createTenant.main",
//       "GET /tenant/{tenantid}": "functions/getTenant.main",
//       "DELETE /tenant/{tenantid}": "functions/deactivateTenant.main",
//       "PUT /tenant/{tenantid}": "functions/updateTenant.main",
//       "GET /user/{username}": "functions/getUser.main",
//       "PUT /user/{username}": "functions/updateUser.main",
//       "DELETE /user/{username}": "functions/disableUser.main",
//       "POST /user/tenant-admin": "functions/createTenantAdminUser.main",
//       "POST /user": "functions/createUser.main",
//       "GET /users": "functions/getUsers.main",
//       "PUT /users/disable/{tenantid}": "functions/disableUsersByTenant.main",
//       "PUT /users/enable/{tenantid}": "functions/enableUsersByTenant.main"
//     },
//     cdk: {
//       restApi: {
//         defaultCorsPreflightOptions: {
//           allowOrigins: Api.Cors.ALL_ORIGINS,
//           allowMethods: Api.Cors.ALL_METHODS
//         },
//         deployOptions: {
//           stageName: "prod",
//           methodOptions: {
//             "/*/*": {
//               dataTraceEnabled: false,
//               loggingLevel: "INFO",
//               metricsEnabled: true
//             }
//           }
//         },
//         securitySchemes: {
//           sigv4Reference: {
//             type: "apiKey",
//             name: "Authorization",
//             in: "header",
//             "x-amazon-apigateway-authtype": "awsSigv4"
//           },
//           Authorizer: {
//             type: "apiKey",
//             name: "Authorization",
//             in: "header",
//             "x-amazon-apigateway-authtype": "custom",
//             "x-amazon-apigateway-authorizer": {
//               authorizerUri: `arn:aws:apigateway:${stack.region}:lambda:path/2015-03-31/functions/${stack.exportValue("AuthorizerFunctionArn")}/invocations`,
//               authorizerResultTtlInSeconds: 60,
//               type: "token"
//             }
//           }
//         }
//       }
//     }
//   });

//   // Define CloudWatch log group for API Gateway access logs
//   const apiLogGroup = new logs.LogGroup(stack, "AdminApiGatewayAccessLogs", {
//     logGroupName: "/aws/api-gateway/access-logs-serverless-saas-admin-api",
//     retention: logs.RetentionDays.THIRTY_DAYS,
//   });

//   // Attach CloudWatch logging role to API Gateway
//   const apiGatewayCloudWatchLogRole = new iam.Role(stack, "ApiGatewayCloudWatchLogRole", {
//     roleName: `apigateway-cloudwatch-publish-role-${stack.region}`,
//     assumedBy: new iam.ServicePrincipal("apigateway.amazonaws.com"),
//     managedPolicies: [
//       iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AmazonAPIGatewayPushToCloudWatchLogs")
//     ],
//   });

//   new iam.CfnAccount(stack, "ApiGatewayAttachCloudwatchLogArn", {
//     cloudWatchRoleArn: apiGatewayCloudWatchLogRole.roleArn,
//   });

//   // Attach permissions for API Gateway to invoke Lambda functions
//   const functions = [
//     "RegisterTenantFunctionArn",
//     "ActivateTenantFunctionArn",
//     "GetTenantsFunctionArn",
//     "CreateTenantFunctionArn",
//     "GetTenantFunctionArn",
//     "DeactivateTenantFunctionArn",
//     "UpdateTenantFunctionArn",
//     "GetUsersFunctionArn",
//     "GetUserFunctionArn",
//     "UpdateUserFunctionArn",
//     "DisableUserFunctionArn",
//     "CreateTenantAdminUserFunctionArn",
//     "CreateUserFunctionArn",
//     "DisableUsersByTenantFunctionArn",
//     "EnableUsersByTenantFunctionArn",
//     "AuthorizerFunctionArn"
//   ];

//   functions.forEach((fnArn) => {
//     api.attachPermissionsToRoute(`ANY /${fnArn}`, [
//       new iam.PolicyStatement({
//         actions: ["lambda:InvokeFunction"],
//         effect: Effect.ALLOW,
//         resources: [
//           stack.formatArn({
//             service: "lambda",
//             resource: "function",
//             resourceName: fnArn
//           })
//         ],
//         principals: [new iam.ServicePrincipal("apigateway.amazonaws.com")],
//       })
//     ]);
//   });

//   // Add specific deny permissions for routes
//   api.cdk.restApi.addToResourcePolicy(new iam.PolicyStatement({
//     effect: Effect.DENY,
//     actions: ["execute-api:Invoke"],
//     principals: [new iam.ArnPrincipal("*")],
//     resources: [
//       `arn:aws:execute-api:${stack.region}:${stack.account}:${api.cdk.restApi.restApiId}/*/POST/tenant`,
//       `arn:aws:execute-api:${stack.region}:${stack.account}:${api.cdk.restApi.restApiId}/*/POST/user/tenant-admin`,
//       `arn:aws:execute-api:${stack.region}:${stack.account}:${api.cdk.restApi.restApiId}/*/PUT/users/disable`,
//       `arn:aws:execute-api:${stack.region}:${stack.account}:${api.cdk.restApi.restApiId}/*/PUT/users/enable`
//     ],
//     conditions: {
//       StringNotEquals: {
//         "aws:PrincipalArn": [
//           stack.exportValue("RegisterTenantLambdaExecutionRoleArn"),
//           stack.exportValue("TenantManagementLambdaExecutionRoleArn")
//         ]
//       }
//     }
//   }));

//   // Outputs
//   stack.addOutputs({
//     ApiEndpoint: api.url,
//     AdminApiGatewayApi: api.cdk.restApi.restApiId,
//     AdminApiGatewayAccessLogs: apiLogGroup.logGroupName,
//   });
// }
