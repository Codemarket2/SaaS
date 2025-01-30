import mongoose from "mongoose"
import {TenantDetails} from './tenantDetailsModel'
const tenantUserMappingSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TenantDetails" 
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

export const TenantUserMapping= mongoose.model("TenantUserMapping", tenantUserMappingSchema);
