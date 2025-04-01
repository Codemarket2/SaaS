import mongoose from "mongoose";

const TenantSchema = new mongoose.Schema({
  tenantId: { type: String, unique: true, required: true },
  tenantName: { type: String, required: true },
  tenantAddress: { type: String, required: true },
  tenantEmail: { type: String, required: true },
  tenantPhone: { type: String, required: true },
  tenantTier: { type: String, required: true },
  isActive: { type: Boolean, default: true },
});

export const Tenant = mongoose.model("Tenant", TenantSchema);
