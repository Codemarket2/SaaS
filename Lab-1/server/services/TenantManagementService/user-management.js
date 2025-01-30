import AWS from "aws-sdk";
import { createSuccessResponse, logger } from "../../utils";
import {TenantUserMapping} from '../../models'

const cognito = new AWS.CognitoIdentityServiceProvider();
const userPoolId = process.env.TENANT_USER_POOL_ID;
// const tenantUserMappingSchema = new mongoose.Schema({
//   tenantId: { type: String, required: true },
//   userName: { type: String, required: true },
// });
// const TenantUserMapping = mongoose.model(
//   "TenantUserMapping",
//   tenantUserMappingSchema
// );

export async function createTenantAdminUser(event) {
  try {
    logger.info(event);
    const appClientId = process.env.TENANT_APP_CLIENT_ID;
    const tenantDetails = JSON.parse(event.body);
    const tenantId = tenantDetails.tenantId;
    logger.info(tenantDetails);

    const tenantAdminUserName = `tenant-admin-${tenantId}`;

    await createUserGroup(tenantId);
    await createTenantAdmin(tenantAdminUserName, tenantDetails);
    await addUserToGroup(tenantAdminUserName, tenantId);
    await createUserTenantMapping(tenantAdminUserName, tenantId);

    return createSuccessResponse({
      userPoolId,
      appClientId,
      tenantAdminUserName,
    });
  } catch (error) {
    logger.error("Error creating tenant admin user", error);
    throw new Error("Error creating tenant admin user");
  }
}

async function createUserGroup(groupName) {
  return cognito
    .createGroup({
      GroupName: groupName,
      UserPoolId: userPoolId,
      Description: `User group for tenant ${groupName}`,
      Precedence: 0,
    })
    .promise();
}

async function createTenantAdmin(userName, userDetails) {
  return cognito
    .adminCreateUser({
      Username: userName,
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

async function addUserToGroup(userName, groupName) {
  return cognito
    .adminAddUserToGroup({
      UserPoolId: userPoolId,
      Username: userName,
      GroupName: groupName,
    })
    .promise();
}

async function createUserTenantMapping(userName, tenantId) {
  return TenantUserMapping.create({ tenantId, userName });
}
