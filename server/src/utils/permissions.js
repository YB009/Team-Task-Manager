// Simple role permission helpers
const ROLE = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  MEMBER: "MEMBER",
};

export const isRoleAllowed = (membership, allowedRoles = []) => {
  if (!membership) return false;
  return allowedRoles.includes(membership.role);
};

export const assertRole = (membership, allowedRoles = []) => {
  if (!isRoleAllowed(membership, allowedRoles)) {
    const roleList = allowedRoles.join(", ");
    const current = membership ? membership.role : "none";
    const err = new Error(`Insufficient role. Required: ${roleList}; current: ${current}`);
    err.statusCode = 403;
    throw err;
  }
};

export const Roles = ROLE;
