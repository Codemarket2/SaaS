import "dotenv/config";
import {
  Api,
  // Cognito,StackContext,
  Function,
} from "sst/constructs";
import { setMaxListeners } from "events";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
// import * as iam from "aws-cdk-lib/aws-iam";
// import * as aws_cdk from "aws-cdk-lib";

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
import { CongitoStack } from "./CognitoStack";
// import * as sst from "@serverless-stack/resources";
// import * as iam from "aws-cdk-lib/aws-iam";
// import {activateTenant,createTenant,createTenantAdminUser,deactivateTenant,getTenant,getTenants,registerTenant,updateTenant} from '../services/tenantManagementService'

export function MyStack({ stack }) {
  // const {stack}=app
  setMaxListeners(20);

  // Lambda Layer (Equivalent to ServerlessSaaSLayers)
  // const serverlessSaaSLayers = new sst.Function(stack, "ServerlessSaaSLayers", { // todo
  //   handler: "layers",
  //   runtime: "nodejs16.x",
  //   bundle: false,
  //   description: "Shared utilities for logging and utils",
  //   // nodeModules: ["aws-sdk","winston"], /// todo
  // });

  // IAM Roles (Converted from AWS::IAM::Role)
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

  // Shared Services Authorizer Function //todo
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
  const Congito = CongitoStack({ stack });

  const defaultEnv = {
    MONGO_URI: process.env.MONGO_URI,
    REGION: process.env.REGION,
    TENANT_USER_POOL: Congito.CognitoUserPool.userPoolId,
    TENANT_APP_CLIENT: Congito.CognitoUserPool.userPoolClientId,
    OPERATION_USERS_USER_POOL: Congito.CognitoOperationUsersUserPool.userPoolId,
    OPERATION_USERS_APP_CLIENT:
      Congito.CognitoOperationUsersUserPool.userPoolClientId,
    // POWERTOOLS_SERVICE_NAME: "UserManagement.CreateTenantAdmin", need to check
  };

  const CreateTenantFunction = new Function(stack, "CreateTenantFunction", {
    handler: "services/tenantManagementService/tenant-management.createTenant",
    runtime: "nodejs16.x",
    timeout: 200,
    memorySize: 1024,
    environment: {
      MONGO_URI: process.env.MONGO_URI,
      CREATE_TENANT_ADMIN_USER_RESOURCE_PATH: "user/tenant-admin",
      CREATE_TENANT_RESOURCE_PATH: "tenant",
      PROVISION_TENANT_RESOURCE_PATH: "provisioning",
      POWERTOOLS_SERVICE_NAME: "TenantRegistration.RegisterTenant",
      REGION: process.env.REGION,
      TENANT_USER_POOL: Congito.CognitoUserPool.userPoolId,
      TENANT_APP_CLIENT: Congito.CognitoUserPool.userPoolClientId,
      OPERATION_USERS_USER_POOL:
        Congito.CognitoOperationUsersUserPool.userPoolId,
      OPERATION_USERS_APP_CLIENT:
        Congito.CognitoOperationUsersUserPool.userPoolClientId,
      // POWERTOOLS_SERVICE_NAME: "UserManagement.CreateTenantAdmin", need to check
    },
  });
  CreateTenantFunction.attachPermissions([
    "cognito-idp:CreateGroup", //permission
    "cognito-idp:AdminCreateUser", //for
    "cognito-idp:AdminAddUserToGroup", //createTenantAdminUser
  ]);

  const GetTenantsFunction = new Function(stack, "GetTenantsFunction", {
    handler: "services/tenantManagementService/tenant-management.getTenants",
    runtime: "nodejs16.x",
    timeout: 30,
    memorySize: 512,
    environment: {
      ...defaultEnv,
    },
  });

  const GetTenantFunction = new Function(stack, "GetTenantFunction", {
    handler: "services/tenantManagementService/tenant-management.getTenant",
    runtime: "nodejs16.x",
    timeout: 30,
    memorySize: 512,
    environment: {
      ...defaultEnv,
    },
  });

  const UpdateTenantFunction = new Function(stack, "UpdateTenantFunction", {
    handler: "services/tenantManagementService/tenant-management.updateTenant",
    runtime: "nodejs16.x",
    timeout: 30,
    memorySize: 512,
    environment: {
      ...defaultEnv,
    },
  });

  const DeactivateTenantFunction = new Function(
    stack,
    "DeactivateTenantFunction",
    {
      handler:
        "services/tenantManagementService/tenant-management.deactivateTenant",
      runtime: "nodejs16.x",
      timeout: 30,
      memorySize: 512,
      environment: {
        ...defaultEnv,
      },
    }
  );

  const ActivateTenantFunction = new Function(stack, "ActivateTenantFunction", {
    handler:
      "services/tenantManagementService/tenant-management.activateTenant",
    runtime: "nodejs16.x",
    timeout: 30,
    memorySize: 512,
    environment: {
      ...defaultEnv,
    },
  });

  const CreateUserFunction = new Function(stack, "CreateUserFunction", {
    handler: "services/tenantManagementService/user-management.createUser",
    runtime: "nodejs16.x",
    timeout: 30,
    memorySize: 512,
    environment: {
      ...defaultEnv,
    },
  });
  CreateUserFunction.attachPermissions([
    "cognito-idp:CreateGroup", //permission
    "cognito-idp:AdminCreateUser", //for
    "cognito-idp:AdminAddUserToGroup", //createTenantAdminUser
  ]);

  const DisableUserFunction = new Function(stack, "DisableUserFunction", {
    handler: "services/tenantManagementService/user-management.disableUser",
    runtime: "nodejs16.x",
    timeout: 30,
    memorySize: 512,
    environment: {
      ...defaultEnv,
    },
  });

  const EnableUsersByTenantFunction = new Function(
    stack,
    "EnableUsersByTenantFunction",
    {
      handler:
        "services/tenantManagementService/user-management.enableUsersByTenant",
      runtime: "nodejs16.x",
      timeout: 30,
      memorySize: 512,
      environment: {
        ...defaultEnv,
      },
    }
  );

  const DisableUsersByTenantFunction = new Function(
    stack,
    "DisableUsersByTenantFunction",
    {
      handler:
        "services/tenantManagementService/user-management.disableUsersByTenant",
      runtime: "nodejs16.x",
      timeout: 30,
      memorySize: 512,
      environment: {
        ...defaultEnv,
      },
    }
  );

  const GetUsersFunction = new Function(stack, "GetUsersFunction", {
    handler: "services/tenantManagementService/user-management.getUsers",
    runtime: "nodejs16.x",
    timeout: 30,
    memorySize: 512,
    environment: {
      ...defaultEnv,
    },
  });
  GetUsersFunction.attachPermissions([
    "cognito-idp:ListUsersInGroup", //list user according to tenant permission
    "cognito-idp:ListUsers", //list user according to tenant permission
  ]);

  const GetUserFunction = new Function(stack, "GetUserFunction", {
    handler: "services/tenantManagementService/user-management.getUser",
    runtime: "nodejs16.x",
    timeout: 30,
    memorySize: 512,
    environment: {
      ...defaultEnv,
    },
  });
  GetUserFunction.attachPermissions(["cognito-idp:ListUsersInGroup"]);

  const CreateTenantAdminUserFunction = new Function(
    stack,
    "CreateTenantAdminUserFunction",
    {
      handler:
        "services/tenantManagementService/user-management.createTenantAdminUser",
      runtime: "nodejs16.x",
      timeout: 30,
      memorySize: 512,
      environment: {
        ...defaultEnv,
        CREATE_TENANT_ADMIN_USER_RESOURCE_PATH: "user/tenant-admin",
        CREATE_TENANT_RESOURCE_PATH: "tenant",
        PROVISION_TENANT_RESOURCE_PATH: "provisioning",
      },
    }
  );
  CreateTenantAdminUserFunction.attachPermissions([
    "cognito-idp:CreateGroup", //permission
    "cognito-idp:AdminCreateUser", //for
    "cognito-idp:AdminAddUserToGroup", //createTenantAdminUser
  ]);
  const RegisterTenantFunction = new Function(stack, "RegisterTenantFunction", {
    handler:
      "services/tenantManagementService/tenant-registration.registerTenant",
    runtime: "nodejs16.x",
    timeout: 30,
    memorySize: 512,
    environment: {
      ...defaultEnv,
      CREATE_TENANT_ADMIN_USER_RESOURCE_PATH: "user/tenant-admin",
      CREATE_TENANT_RESOURCE_PATH: "tenant",
      PROVISION_TENANT_RESOURCE_PATH: "provisioning",
    },
  });

  const GetOrders = new Function(stack, "GetOrders", {
    handler: "services/orderService/orderService.getOrders",
    runtime: "nodejs16.x",
    timeout: 30,
    memorySize: 512,
    environment: {
      ...defaultEnv,
    },
  });

  const GetProducts = new Function(stack, "GetProducts", {
    handler: "services/productService/productService.getProducts",
    runtime: "nodejs16.x",
    timeout: 30,
    memorySize: 512,
    environment: {
      ...defaultEnv,
    },
  });

  const CreateProduct = new Function(stack, "CreateProduct", {
    handler: "services/productService/productService.createProduct",
    runtime: "nodejs16.x",
    timeout: 30,
    memorySize: 512,
    environment: {
      ...defaultEnv,
    },
  });
  const UpdateProduct = new Function(stack, "UpdateProduct", {
    handler: "services/productService/productService.updateProduct",
    runtime: "nodejs16.x",
    timeout: 30,
    memorySize: 512,
    environment: {
      ...defaultEnv,
    },
  });

  const CreateOrder = new Function(stack, "CreateOrder", {
    handler: "services/orderService/orderService.createOrder",
    runtime: "nodejs16.x",
    timeout: 30,
    memorySize: 512,
    environment: {
      ...defaultEnv,
    },
  });

  const CreatePaymentIntent = new Function(stack, "CreatePaymentIntent", {
    handler: "services/paymentService/paymentService.createPaymentIntent",
    runtime: "nodejs16.x",
    timeout: 30,
    memorySize: 512,
    environment: {
      ...defaultEnv,
      STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    },
  });

  const PaymentSuccessWebhook = new Function(stack, "PaymentSuccessWebhook", {
    // once payment is done
    handler: "services/paymentService/paymentService.paymentSuccessWebhook",
    runtime: "nodejs16.x",
    timeout: 30,
    memorySize: 512,
    environment: {
      ...defaultEnv,
      STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    },
  });

  // Cognito User Pool & Client
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
  //   handler: "services/tenantManagementService/tenant-management.create",
  //   runtime: "nodejs18.x",
  //   timeout: 30,
  //   memorySize: 512,
  //   permissions: ["dynamodb", "s3"], // Adjust as needed
  //   environment: {
  //     MONGO_URI: process.env.MONGO_URI,
  //   },
  // });
  const sharedAuthorizer = new Function(stack, "SharedAuthorizer", {
    handler: "resources/sharedServiceAuthorizer.lambdaHandler",
    environment: {
      REGION: process.env.REGION,
      TENANT_USER_POOL: Congito.CognitoUserPool.userPoolId,
      TENANT_APP_CLIENT: Congito.CognitoUserPool.userPoolClientId,
      OPERATION_USERS_USER_POOL:
        Congito.CognitoOperationUsersUserPool.userPoolId,
      OPERATION_USERS_APP_CLIENT:
        Congito.CognitoOperationUsersUserPool.userPoolClientId,
    },
  });

  const tenantAuthorizer = new Function(stack, "TenantAuthorizer", {
    handler: "resources/tenantAuthorizer.lambdaHandler",
    environment: {
      REGION: process.env.REGION,
      TENANT_USER_POOL: Congito.CognitoUserPool.userPoolId,
      TENANT_APP_CLIENT: Congito.CognitoUserPool.userPoolClientId,
      OPERATION_USERS_USER_POOL:
        Congito.CognitoOperationUsersUserPool.userPoolId,
      OPERATION_USERS_APP_CLIENT:
        Congito.CognitoOperationUsersUserPool.userPoolClientId,
    },
  });
  const api = new Api(this, "Api", {
    authorizers: {
      sharedAuthorizer: {
        type: "lambda",
        function: sharedAuthorizer,
        identitySources: [apigateway.IdentitySource.header("Authorization")],
      },
      tenantAuthorizer: {
        type: "lambda",
        function: tenantAuthorizer,
        identitySources: [apigateway.IdentitySource.header("Authorization")],
      },
    },
    defaults: {
      authorizer: "tenantAuthorizer",
    },
    // cors: {
    //   allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    //   allowOrigins: ["*"],
    // },
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
      "POST /payment/createPaymentIntent": {
        function: CreatePaymentIntent,
        authorizer: "none",
      },
      "POST /payment/success-webhook": {
        function: PaymentSuccessWebhook,
        authorizer: "none",
      },

      "POST /tenant": {
        function: CreateTenantFunction,
        authorizer: "none",
      },
      "GET /tenants": {
        function: GetTenantsFunction,
        authorizer: "sharedAuthorizer",
      },
      "GET /tenant/{tenantId}": {
        function: GetTenantFunction,
        authorizer: "sharedAuthorizer",
      },
      "PUT /tenant/{tenantId}": {
        function: UpdateTenantFunction,
        authorizer: "sharedAuthorizer",
      },
      "DELETE /tenant/{tenantId}": {
        function: DeactivateTenantFunction,
        authorizer: "sharedAuthorizer",
      },
      "POST /tenant/activate": {
        function: ActivateTenantFunction,
        authorizer: "sharedAuthorizer",
      },
      "POST /user": {
        function: CreateUserFunction,
        authorizer: "sharedAuthorizer",
      },
      "POST /user/disable": {
        function: DisableUserFunction,
        authorizer: "sharedAuthorizer",
      },
      "POST /users/enable": {
        function: EnableUsersByTenantFunction,
        authorizer: "sharedAuthorizer",
      },
      "POST /users/disable": {
        function: DisableUsersByTenantFunction,
        authorizer: "sharedAuthorizer",
      },
      "POST /register": {
        function: RegisterTenantFunction,
        authorizer: "sharedAuthorizer",
      },
      "GET /users": {
        function: GetUsersFunction,
        authorizer: "sharedAuthorizer",
      },
      "GET /user/{userId}": GetUserFunction,
      "POST /user/tenant-admin": {
        function: CreateTenantAdminUserFunction,
        authorizer: "none",
      },

      "GET /products": {
        function: GetProducts,
        authorizer: "tenantAuthorizer",
      },

      // "GET /products": lambdaFunctions.ProductFunction,
      "POST /products/create-product": CreateProduct,
      "PUT /products/update-product/{_id}": UpdateProduct,

      // "POST /products": lambdaFunctions.ProductFunction,
      "GET /orders": GetOrders,
      // lambdaFunctions.OrderFunction,
      // "POST /orders": lambdaFunctions.OrderFunction,
      "POST /orders/create-order": CreateOrder,
    },
  });
  stack // Output the API endpoint
    .addOutputs({
      ApiEndpoint: api.url,
      CreateTenantFunctionArn: CreateTenantFunction.functionArn,
      GetTenantFunctionArn: GetTenantFunction.functionArn,
      UpdateTenantFunctionArn: UpdateTenantFunction.functionArn,
      DeactivateTenantFunctionArn: DeactivateTenantFunction.functionArn,
      ActivateTenantFunctionArn: ActivateTenantFunction.functionArn,
      CreateUserFunctionArn: CreateUserFunction.functionArn,
      DisableUserFunctionArn: DisableUserFunction.functionArn,
      EnableUsersByTenantFunctionArn: EnableUsersByTenantFunction.functionArn,
      DisableUsersByTenantFunctionArn: DisableUsersByTenantFunction.functionArn,
      RegisterTenantFunctionArn: RegisterTenantFunction.functionArn,
      GetUsersFunctionArn: GetUsersFunction.functionArn,
      GetUserFunctionArn: GetUserFunction.functionArn,
      CreateTenantAdminUserFunctionArn:
        CreateTenantAdminUserFunction.functionArn,
      // CognitoAdminUserGroupName:CognitoAddUserToGroup1.groupName
      //   // ApiEndpoint: api.url,
      //   // CognitoUserPoolId: auth.cognitoUserPoolId,
      //   // CognitoUserPoolClientId: auth.cognitoUserPoolClientId,
      //   // SharedServicesAuthorizerFunctionArn: sharedServicesAuthorizerFunction.functionArn,
    });
}
