// JWT token utilities

// Decode JWT token without verification (client-side only)
export const decodeJWT = (token) => {
  try {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

// Extract role from JWT token
export const getRoleFromToken = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded) return null;

  // Check for role claim in the token
  const roleClaim = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  return roleClaim ? parseInt(roleClaim, 10) : null;
};

// Extract userId from JWT token
export const getUserIdFromToken = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded) return null;

  // Common JWT claims for user ID
  return decoded.sub || 
         decoded.userId || 
         decoded.id || 
         decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
         decoded.nameid ||
         null;
};