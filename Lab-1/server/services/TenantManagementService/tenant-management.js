import {Tenant} from '../../models/tenantModel'
import { logger, generateResponse, createSuccessResponse, DB } from "../../utils";

export async function createTenant(event) {
  try {
    await DB()
    const tenantDetails = JSON.parse(event.body);
    const newTenant=new Tenant({...tenantDetails});
    await newTenant.save();
    return createSuccessResponse("Tenant Created");
  } catch (error) {
    logger.error("Error creating a new tenant", error);
    throw new Error("Error creating a new tenant",error);
  }
}

export async function getTenants(event) {
  try {
    const tenants = await Tenant.find();
    return generateResponse(tenants);
  } catch (error) {
    logger.error("Error getting all tenants", error);
    throw new Error("Error getting all tenants");
  }
}

export async function updateTenant(event) {
  try {
    const tenantId = event.pathParameters.tenantid;
    const tenantDetails = JSON.parse(event.body);
    await Tenant.findOneAndUpdate({ tenantId }, tenantDetails, { new: true });
    return createSuccessResponse("Tenant Updated");
  } catch (error) {
    logger.error("Error updating tenant", error);
    throw new Error("Error updating tenant");
  }
}

export async function getTenant(event) {
  try {
    const tenantId = event.pathParameters.tenantid;
    const tenant = await Tenant.findOne(
      { tenantId },
      "tenantName tenantAddress tenantEmail tenantPhone"
    );
    return createSuccessResponse(tenant);
  } catch (error) {
    logger.error("Error getting tenant details", error);
    throw new Error("Error getting tenant details");
  }
}

export async function deactivateTenant(event) {
  try {
    const tenantId = event.pathParameters.tenantid;
    await Tenant.findOneAndUpdate({ tenantId }, { isActive: false });
    return createSuccessResponse("Tenant Deactivated");
  } catch (error) {
    logger.error("Error deactivating tenant", error);
    throw new Error("Error deactivating tenant");
  }
}

export async function activateTenant(event) {
  try {
    const tenantId = event.pathParameters.tenantid;
    await Tenant.findOneAndUpdate({ tenantId }, { isActive: true });
    return createSuccessResponse("Tenant Activated");
  } catch (error) {
    logger.error("Error activating tenant", error);
    throw new Error("Error activating tenant");
  }
}
