const mongoose = require("mongoose");

const tenantDetailsSchema = new mongoose.Schema({
  tenantName: {
    type: String,
    required: true,
  },
  userPoolId: {
    type: String,
  },
  appClientId: {
    type: String,
  },
  apiGatewayUrl: {
    type: String,
  },
});

// Create a MongoDB index for `tenantName` to mimic the GSI
tenantDetailsSchema.index({ tenantName: 1 }, { unique: false });

export const TenantDetails=mongoose.model("TenantDetails", tenantDetailsSchema);
