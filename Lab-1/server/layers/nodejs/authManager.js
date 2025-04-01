import mongoose from "mongoose";
import { ServiceIdentifier } from "./utils";

const UserRoles = {
  SYSTEM_ADMIN: "admin",
  //    "system_admins'",
  CUSTOMER_SUPPORT: "CustomerSupport",
  TENANT_ADMIN: "TenantAdmin",
  TENANT_USER: "TenantUser",
};

function isTenantAdmin(userRole) {
  return userRole === UserRoles.TENANT_ADMIN;
}

function isSystemAdmin(userRole) {
  return userRole === UserRoles.SYSTEM_ADMIN;
}

function isSaaSProvider(userRole) {
  return (
    userRole === UserRoles.SYSTEM_ADMIN ||
    userRole === UserRoles.CUSTOMER_SUPPORT
  );
}

function isTenantUser(userRole) {
  return userRole === UserRoles.TENANT_USER;
}

export function getPolicyForUser(userRole, serviceIdentifier, tenantId) {
  let policy = "";

  if (isSystemAdmin(userRole)) {
    policy = getPolicyForSystemAdmin();
  } else if (isTenantAdmin(userRole)) {
    policy = getPolicyForTenantAdmin(tenantId, serviceIdentifier);
  } else if (isTenantUser(userRole)) {
    policy = getPolicyForTenantUser(tenantId);
  }

  return policy;
}

function getPolicyForSystemAdmin() {
  return JSON.stringify({
    Version: "2023-01-01",
    Permissions: ["read:all", "write:all", "delete:all"],
  });
}

function getPolicyForTenantAdmin(tenantId, serviceIdentifier) {
  let policy;
  if (serviceIdentifier === ServiceIdentifier.SHARED_SERVICES) {
    policy = {
      Version: "2023-01-01",
      Permissions: ["read:tenant", "write:tenant", "update:tenant"],
      Conditions: {
        tenantId: tenantId,
      },
    };
  } else {
    policy = {
      Version: "2023-01-01",
      Permissions: [
        "read:products",
        "write:products",
        "delete:products",
        "read:orders",
        "write:orders",
        "delete:orders",
      ],
      Conditions: {
        tenantId: tenantId,
      },
    };
  }
  return JSON.stringify(policy);
}

function getPolicyForTenantUser(tenantId) {
  return JSON.stringify({
    Version: "2023-01-01",
    Permissions: ["read:products", "read:orders"],
    Conditions: {
      tenantId: tenantId,
    },
  });
}

function checkAuthorization(event, neededPermissionArray) {
  let { permissions } = event.requestContext.authorizer.lambda;
  permissions = JSON.parse(permissions);
  if (!neededPermissionArray.some((p) => permissions.Permissions.includes(p))) {
    throw new Error("You are not authorized to perform this action");
  }
  return true;
}

export {
  UserRoles,
  isTenantAdmin,
  isSystemAdmin,
  isSaaSProvider,
  isTenantUser,
  checkAuthorization,
};
