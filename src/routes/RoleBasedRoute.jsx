import { Navigate } from 'react-router-dom';
import { tokenUtils, ROLES } from '../features/auth/utils';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = tokenUtils.isAuthenticated();
  const userRole = tokenUtils.getUserRole();

  // If not authenticated, redirect to auth page
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // If authenticated but role not allowed, redirect to appropriate page
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect based on user's actual role
    switch (userRole) {
      case ROLES.CUSTOMER:
        return <Navigate to="/" replace />;
      case ROLES.ADMIN:
        return <Navigate to="/admin" replace />;
      case ROLES.STAFF:
        return <Navigate to="/staff" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default RoleBasedRoute;
