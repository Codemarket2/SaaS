import "dotenv/config";
import { Api,Cognito } from "sst/constructs";
// import { setMaxListeners } from "events";
import {
  StringAttribute,
  OAuthScope,
  AccountRecovery,
  CfnUserPoolUserToGroupAttachment,
  CfnUserPoolGroup,
  UserPoolClientIdentityProvider,
  CfnUserPoolUser,
  ClientAttributes,
  VerificationEmailStyle,
} from "aws-cdk-lib/aws-cognito";
import * as ssm from "aws-cdk-lib/aws-ssm";



export function CongitoStack({stack}) {

  const adminEmail = ssm.StringParameter.valueForStringParameter(
    stack,
    "/admin/email"
  );
  const systemAdminRole = ssm.StringParameter.valueForStringParameter(
    stack,
    "/admin/role"
  );
  const adminCallbackURL = ssm.StringParameter.valueForStringParameter(
    stack,
    "/admin/callbackURL"
  );
  const CognitoUserPool = new Cognito(stack, "CognitoUserPool", {
    login: ["email"],
    cdk: {
      userPool: {
        userPoolName: "PooledTenant-ServerlessSaaSUserPool",
        selfSignUpEnabled: true,
        accountRecovery: AccountRecovery.EMAIL_ONLY,
        userVerification: {
          emailBody:
            "Thanks for signing up. You username is {username} and temporary password is {####}",
          emailSubject: "Your temporary password for tenant UI application",
          emailStyle: VerificationEmailStyle.CODE,
        },
        signInAliases: { email: true },
        autoVerify: { email: true },
        standardAttributes: { email: { required: true, mutable: true } },
        customAttributes: {
          tenantId: new StringAttribute(),
          userRole: new StringAttribute({ mutable: true }),
        },
      },
      userPoolClient: {
        userPoolClientName: "ServerlessSaaSClient",
        generateSecret: false,
        authFlows: {
          userPassword: true,
        },
        supportedIdentityProviders: [UserPoolClientIdentityProvider.COGNITO],
        oAuth: {
          scopes: [OAuthScope.EMAIL, OAuthScope.OPENID, OAuthScope.PROFILE],
          callbackUrls: ["http://localhost:5173"],
          defaultRedirectUri: "http://localhost:5173",
          flows: { authorizationCodeGrant: true, implicitCodeGrant: true },
          logoutUrls: ["http://localhost:5173"],
        },
        // writeAttributes: [
        //   "email".
        // ]
      },
    },
  });

  CognitoUserPool.cdk.userPool.addDomain("CognitoUserPoolDomain", {
    cognitoDomain: {
      domainPrefix: `pooledtenant-serverlesssaas-${stack.account}`,
    },
  });

  const CognitoOperationUsersUserPool = new Cognito(
    stack,
    "CognitoOperationUsersUserPool",
    {
      // userPoolName:"OperationUsers-ServerlessSaaSUserPool",
      // autoVerify:{email:true},
      // accountRecovery:AccountRecovery.EMAIL_ONLY,
      // selfSignUpEnabled:true,
      // standardAttributes:{
      //   email:{required:true,mutable:true}
      // },
      // customAttributes:{
      //   tenantId:new StringAttribute(),
      //   userRole:new StringAttribute({mutable:true}),
      // },
      // userInvitation:{
      //   emailSubject:"Your temporary password for admin UI application",
      //   emailBody:"Login into admin UI application at https://${process.env.ADMIN_USER_POOL_CALLBACK_URL}/ with username {username} and temporary password {####}`"
      // },

      cdk: {
        userPool: {
          userPoolName: "OperationUsers-ServerlessSaaSUserPool",
          selfSignUpEnabled: true,
          accountRecovery: AccountRecovery.EMAIL_ONLY,
          autoVerify: { email: true },
          standardAttributes: {
            email: { required: true, mutable: true },
          },
          customAttributes: {
            tenantId: new StringAttribute(),
            userRole: new StringAttribute({ mutable: true }),
          },
          userVerification: {
            emailBody: `Login into admin UI application at https://${process.env.ADMIN_USER_POOL_CALLBACK_URL}/ with username {username} and temporary password {####}`,
            emailSubject: "Your temporary password for admin UI application",
            emailStyle: VerificationEmailStyle.CODE,
          },
        },
        userPoolClient: {
          userPoolClientName: "ServerlessSaaSOperationUsersPoolClient",
          generateSecret: false,
          authFlows: {
            userPassword: true,
          },
          oAuth: {
            scopes: [OAuthScope.EMAIL, OAuthScope.OPENID, OAuthScope.PROFILE],
            callbackUrls: [adminCallbackURL, "http://localhost:5173"],
            defaultRedirectUri: "http://localhost:5173",
            flows: { authorizationCodeGrant: true, implicitCodeGrant: true },
            logoutUrls: [adminCallbackURL, "http://localhost:5173"],
          },
          supportedIdentityProviders: [UserPoolClientIdentityProvider.COGNITO],
          writeAttributes: new ClientAttributes()
            .withStandardAttributes({ email: true })
            .withCustomAttributes("tenantId", "userRole"),
        },
      },
    }
  );

  CognitoOperationUsersUserPool.cdk.userPool?.addDomain(
    "CognitoOperationUsersUserPoolDomain",
    {
      cognitoDomain: {
        domainPrefix: `operationsusers-serverlesssaas-${stack.account}`,
      },
    }
  );

  const CognitoAdminUserGroup = new CfnUserPoolGroup(
    stack,
    "CognitoAdminUserGroup",
    {
      userPoolId: CognitoOperationUsersUserPool.userPoolId,
      precedence: 0,
      description: "Admin user group",
      groupName: "SystemAdmins",
    }
  );

  const CognitoAdminUser = new CfnUserPoolUser(stack, "CognitoAdminUser", {
    username: "admin",
    userPoolId: CognitoOperationUsersUserPool.userPoolId,
    desiredDeliveryMediums: ["EMAIL"],
    forceAliasCreation: true,
    userAttributes: [
      {
        name: "email",
        value: adminEmail,
      },
      {
        name: "custom:tenantId",
        value: "system_admins",
      },
      {
        name: "custom:userRole",
        value: systemAdminRole,
      },
    ],
  });
  // const CognitoAddUserToGroup1=new CfnUserPoolUserToGroupAttachment(stack,'UserPoolUserToGroupAttachment',{
  //   userPoolId:CognitoOperationUsersUserPool.userPoolId,
  //   username:CognitoAdminUser.username||"admin",
  //   groupName:CognitoAdminUserGroup.groupName||"SystemAdmins",

  // })
  const userPoolProviderUrl = `https://cognito-idp.us-east-1.amazonaws.com/${CognitoOperationUsersUserPool.userPoolId}`;


  stack.addOutputs({
    CognitoUserPoolId: CognitoUserPool.userPoolClientId,
    CognitoUserPoolClientId: CognitoUserPool.userPoolClientId,
    CognitoOperationUsersUserPoolId: CognitoOperationUsersUserPool.userPoolId,
    CognitoOperationUsersUserPoolClientId:
      CognitoOperationUsersUserPool.userPoolClientId,
    CognitoOperationUsersUserPoolProviderURL: userPoolProviderUrl,
  });
  return {
    CognitoUserPool,
    CognitoOperationUsersUserPool,
    userPoolProviderUrl,
  };
}
