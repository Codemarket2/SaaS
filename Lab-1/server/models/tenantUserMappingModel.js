import mongoose from "mongoose";
import { TenantDetails } from "./tenantDetailsModel";
const tenantUserMappingSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
    // type: mongoose.Schema.Types.ObjectId, // todo may be need to keep this type but having issue so i am putting string
    // ref: "TenantDetails"
  },
  userName: {
    type: String,
    required: true,
  },
});

// Create a compound index for tenantId and userName to mimic the composite key
tenantUserMappingSchema.index({ tenantId: 1, userName: 1 }, { unique: true });

// Create an additional index for the GSI on `userName` and `tenantId`
tenantUserMappingSchema.index({ userName: 1, tenantId: 1 });

export const TenantUserMapping = mongoose.model(
  "TenantUserMapping",
  tenantUserMappingSchema
);
