import AWS from "aws-sdk";
// import // CognitoIdentityProviderClient,
// AdminCreateUserCommand,
// ListUsersCommand,
// AdminUpdateUserAttributesCommand,
// AdminDisableUserCommand,
// AdminEnableUserCommand,
// AdminGetUserCommand,
// CreateGroupCommand,
// AdminAddUserToGroupCommand
// "@aws-sdk/signature-v4";
// client-cognito-identity-provider
import {
  createSuccessResponse,
  DB,
  generateResponse,
  logger,
} from "../../utils";
import { TenantUserMapping } from "../../models";
import { isSystemAdmin, isTenantAdmin } from "../../layers/nodejs/authManager";

const cognito = new AWS.CognitoIdentityServiceProvider();
const userPoolId = process.env.TENANT_USER_POOL;
const appClientId = process.env.TENANT_APP_CLIENT;

// const tenantUserMappingSchema = new mongoose.Schema({
//   tenantId: { type: String, required: true },
//   userName: { type: String, required: true },
// });
// const TenantUserMapping = mongoose.model(
//   "TenantUserMapping",
//   tenantUserMappingSchema
// );
// import mongoose from "mongoose";

AWS.config.update({ region: process.env.AWS_REGION });

const client = new AWS.CognitoIdentityServiceProvider();

export async function createTenantAdminUser(event) {
  try {
    logger.info(event);
    const appClientId = process.env.TENANT_APP_CLIENT;
    const tenantDetails = JSON.parse(event.body);
    const tenantId = tenantDetails.tenantId;

    logger.info(tenantDetails);

    const userMgmt = new UserManagement();
    const tenantUserGroupResponse = await userMgmt.createUserGroup(
      userPoolId,
      tenantId,
      `User group for tenant ${tenantId}`
    );

    const tenantAdminUserName = `tenant-admin-${tenantDetails.tenantId}`;
    await userMgmt.createTenantAdmin(
      userPoolId,
      tenantAdminUserName,
      tenantDetails
    );
    await userMgmt.addUserToGroup(
      userPoolId,
      tenantAdminUserName,
      tenantUserGroupResponse.Group.GroupName
    );
    await userMgmt.createUserTenantMapping(tenantAdminUserName, tenantId);

    const response = { userPoolId, appClientId, tenantAdminUserName };
    return createSuccessResponse(response);
  } catch (err) {
    logger.error(err);
    return generateResponse(
      { error: err.message ?? "Error creating tenant admin user" },
      500
    );
  }
}

export async function createUser(event) {
  try {
    const userDetails = JSON.parse(event.body);
    logger.info("Request received to create new user", event);

    const tenantId = userDetails.tenantId;

    const response = await client
      .adminCreateUser({
        Username: userDetails.userName,
        UserPoolId: userPoolId,
        ForceAliasCreation: true,
        UserAttributes: [
          { Name: "email", Value: userDetails.userEmail },
          { Name: "email_verified", Value: "true" },
          { Name: "custom:userRole", Value: userDetails.userRole },
          { Name: "custom:tenantId", Value: tenantId },
        ],
      })
      .promise();

    logger.info(response);
    const userMgmt = new UserManagement();
    await userMgmt.addUserToGroup(userPoolId, userDetails.userName, tenantId);
    await userMgmt.createUserTenantMapping(userDetails.userName, tenantId);

    logger.info("Request completed to create new user");
    return createSuccessResponse("New user created");
  } catch (err) {
    logger.error(err);
    return generateResponse({ error: "Error creating user" }, 500);
  }
}

export async function getUsers(event) {
  try {
    logger.info("Request received to get users");
    let response;
    const userRole = event.requestContext.authorizer?.lambda?.userRole;
    if (isSystemAdmin(userRole) || isTenantAdmin(userRole)) {
      const tenantId = event.requestContext.authorizer?.lambda?.tenantId;
      if (isTenantAdmin(userRole)) {
        response = await client
          .listUsersInGroup({
            UserPoolId: userPoolId,
            GroupName: tenantId,
          })
          .promise();
      } else {
        response = await client.listUsers({ UserPoolId: userPoolId }).promise();
      }
      const users = response.Users.map((user) => {
        const userInfo = new UserInfo();
        user.Attributes.forEach((attr) => {
          if (attr.Name === "custom:tenantId") userInfo.tenantId = attr.Value;
          if (attr.Name === "custom:userRole") userInfo.userRole = attr.Value;
          if (attr.Name === "email") userInfo.email = attr.Value;
        });
        userInfo.enabled = user.Enabled;
        userInfo.created = user.UserCreateDate;
        userInfo.modified = user.UserLastModifiedDate;
        userInfo.status = user.UserStatus;
        userInfo.userName = user.Username;
        return userInfo;
      });
      return generateResponse(users);
    } else {
      return generateResponse({ error: "Unauthorized" });
    }
  } catch (err) {
    logger.error(err);
    return generateResponse({ error: "Error fetching users" }, 500);
  }
}

export async function getUser(event) {
  try {
    const userName = event.pathParameters.username;
    logger.info("Request received to get user");

    const userInfo = await getUserInfo(userPoolId, userName);
    logger.info("Request completed to get user");
    return createSuccessResponse(userInfo);
  } catch (err) {
    logger.error(err);
    return generateResponse({ error: "Error fetching user" }, 500);
  }
}

export async function updateUser(event) {
  try {
    const userDetails = JSON.parse(event.body);
    const userName = event.pathParameters.username;

    logger.info("Request received to update user");

    await client
      .adminUpdateUserAttributes({
        Username: userName,
        UserPoolId: userPoolId,
        UserAttributes: [
          { Name: "email", Value: userDetails.userEmail },
          { Name: "custom:userRole", Value: userDetails.userRole },
        ],
      })
      .promise();

    logger.info("Request completed to update user");
    return createSuccessResponse("User updated");
  } catch (err) {
    logger.error(err);
    return generateResponse({ error: "Error updating user" }, 500);
  }
}

export async function disableUser(event) {
  try {
    const userName = event.pathParameters.username;
    logger.info("Request received to disable user");

    await client
      .adminDisableUser({
        Username: userName,
        UserPoolId: userPoolId,
      })
      .promise();

    logger.info("Request completed to disable user");
    return createSuccessResponse("User disabled");
  } catch (err) {
    logger.error(err);
    return generateResponse({ error: "Error disabling user" }, 500);
  }
}

export async function disableUsersByTenant(event) {
  try {
    logger.info("Request received to disable users by tenant", event);
    const tenantIdToUpdate = event.tenantid;

    const users = await TenantUserMapping.find({ tenantId: tenantIdToUpdate });

    for (const user of users) {
      await client
        .adminDisableUser({
          Username: user.userName,
          UserPoolId: userPoolId,
        })
        .promise();
    }

    logger.info("Request completed to disable users");
    return createSuccessResponse("Users disabled");
  } catch (err) {
    logger.error(err);
    return generateResponse({ error: "Error disabling users" }, 500);
  }
}

export async function enableUsersByTenant(event) {
  try {
    logger.info("Request received to enable users by tenant", event);
    const tenantIdToUpdate = event.tenantid;

    const users = await TenantUserMapping.find({ tenantId: tenantIdToUpdate });

    for (const user of users) {
      await client
        .adminEnableUser({
          Username: user.userName,
          UserPoolId: userPoolId,
        })
        .promise();
    }

    logger.info("Request completed to enable users");
    return createSuccessResponse("Users enabled");
  } catch (err) {
    logger.error(err);
    return generateResponse({ error: "Error enabling users" }, 500);
  }
}

async function getUserInfo(userPoolId, userName) {
  const response = await client
    .adminGetUser({
      UserPoolId: userPoolId,
      Username: userName,
    })
    .promise();

  const userInfo = new UserInfo();
  userInfo.userName = response.Username;
  response.UserAttributes.forEach((attr) => {
    if (attr.Name === "custom:tenantId") userInfo.tenantId = attr.Value;
    if (attr.Name === "custom:userRole") userInfo.userRole = attr.Value;
    if (attr.Name === "email") userInfo.email = attr.Value;
  });
  logger.info(userInfo);
  return userInfo;
}

class UserManagement {
  async createUserGroup(userPoolId, groupName, groupDescription) {
    return await client
      .createGroup({
        GroupName: groupName,
        UserPoolId: userPoolId,
        Description: groupDescription,
        Precedence: 0,
      })
      .promise();
  }

  async createTenantAdmin(userPoolId, tenantAdminUserName, userDetails) {
    return await client
      .adminCreateUser({
        Username: tenantAdminUserName,
        UserPoolId: userPoolId,
        ForceAliasCreation: true,
        UserAttributes: [
          { Name: "email", Value: userDetails.tenantEmail },
          { Name: "email_verified", Value: "true" },
          { Name: "custom:userRole", Value: "TenantAdmin" },
          { Name: "custom:tenantId", Value: userDetails.tenantId },
        ],
      })
      .promise();
  }

  async addUserToGroup(userPoolId, userName, groupName) {
    return await client
      .adminAddUserToGroup({
        UserPoolId: userPoolId,
        Username: userName,
        GroupName: groupName,
      })
      .promise();
  }

  async createUserTenantMapping(userName, tenantId) {
    await DB();
    const mapping = new TenantUserMapping({ tenantId, userName });
    return await mapping.save();
  }
}

class UserInfo {
  constructor(
    userName = null,
    tenantId = null,
    userRole = null,
    email = null,
    status = null,
    enabled = null,
    created = null,
    modified = null
  ) {
    this.userName = userName;
    this.tenantId = tenantId;
    this.userRole = userRole;
    this.email = email;
    this.status = status;
    this.enabled = enabled;
    this.created = created;
    this.modified = modified;
  }
}
