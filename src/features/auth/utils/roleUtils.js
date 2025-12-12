// Role management utilities

// Role constants
export const ROLES = {
  CUSTOMER: 1,
  OWNER: 2,
  ADMIN: 1001,
  STAFF: 1002
};

// Get redirect path based on role
export const getRedirectPathByRole = (roleId) => {
  switch (roleId) {
    case ROLES.CUSTOMER:
      return '/';
    case ROLES.ADMIN:
      return '/admin';
    case ROLES.STAFF:
      return '/staff';
    case ROLES.OWNER:
      return '/owner';
    default:
      return '/';
  }
};