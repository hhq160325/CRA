export const getStatusBadge = (status) => {
  const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
  switch (status) {
    case 'active':
      return `${baseClasses} bg-green-100 text-green-800`;
    case 'pending':
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    case 'suspended':
      return `${baseClasses} bg-red-100 text-red-800`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`;
  }
};

export const getRoleBadge = (roleName) => {
  const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
  switch (roleName) {
    case 'Staff':
      return `${baseClasses} bg-blue-100 text-blue-800`;
    case 'User':
      return `${baseClasses} bg-green-100 text-green-800`;
    // COMMENTED OUT: Car Owner role badge
    // case 'Car Owner':
    //   return `${baseClasses} bg-purple-100 text-purple-800`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`;
  }
};

export const formatDate = (dateString) => {
  if (!dateString || dateString === 'N/A') return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return 'N/A';
  }
};

export const getStaffStats = (staffMembers) => {
  const totalStaff = staffMembers.length;
  const activeStaff = staffMembers.filter(staff => staff.status === 'active').length;
  const suspendedStaff = staffMembers.filter(staff => staff.status === 'suspended').length;
  const staffOnly = staffMembers.filter(staff => staff.roleName === 'Staff').length;
  const otherUsers = staffMembers.filter(staff => staff.roleName === 'User').length;

  return {
    totalStaff,
    activeStaff,
    suspendedStaff,
    staffOnly,
    otherUsers // Changed from carOwners to otherUsers
  };
};