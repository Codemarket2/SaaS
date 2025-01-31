import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import logger from "../../layers/nodejs/logger";
import {createErrorResponse,createSuccessResponse} from "../../layers/nodejs/utils";
import {TenantDetails,TenantUserMapping} from '../../models'


// const TenantSchema = new mongoose.Schema({
//   tenantId: { type: String, unique: true, required: true },
//   tenantName: { type: String, required: true },
//   tenantAdminUserName: { type: String },
// });

// const Tenant = mongoose.model("Tenant", TenantDetails);

export async function registerTenant(event) {
  try {
    const tenantId = uuidv4();
    const tenantDetails = JSON.parse(event.body);
    tenantDetails.tenantId = tenantId;

    logger.info(tenantDetails);

    const stageName = event.requestContext.stage;
    const host = event.headers.Host;
    // const auth = utils.getAuth(host); // todo
    // const headers = utils.getHeaders(event); // todo
    const createUserResponse = await createTenantAdminUser(tenantDetails, headers, auth, host, stageName);
    logger.info(createUserResponse);
    tenantDetails.tenantAdminUserName = createUserResponse.message.tenantAdminUserName;
    const createTenantResponse = await createTenant(tenantDetails, headers, auth, host, stageName);
    logger.info(createTenantResponse);
    await TenantDetails.create(tenantDetails);
    return createSuccessResponse("You have been registered in our system");
  } catch (error) {
    logger.error("Error registering a new tenant", error);
    throw new Error("Error registering a new tenant");
  }
}

async function createTenantAdminUser(tenantDetails, headers, auth, host, stageName) {
  try {
    const url = `https://${host}/${stageName}${process.env.CREATE_TENANT_ADMIN_USER_RESOURCE_PATH}`;
    logger.info(url);
    const response = await axios.post(url, tenantDetails, { headers, auth });
    return response.data;
  } catch (error) {
    logger.error("Error occurred while calling the create tenant admin user service", error);
    throw new Error("Error occurred while calling the create tenant admin user service");
  }
}

async function createTenant(tenantDetails, headers, auth, host, stageName) {
  try {
    const url = `https://${host}/${stageName}${process.env.CREATE_TENANT_RESOURCE_PATH}`;
    const response = await axios.post(url, tenantDetails, { headers, auth });
    return response.data;
  } catch (error) {
    logger.error("Error occurred while creating the tenant record in table", error);
    throw new Error("Error occurred while creating the tenant record in table");
  }
}