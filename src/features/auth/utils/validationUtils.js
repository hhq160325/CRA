// Validation utilities for auth

// Password validation utilities
export const passwordValidation = {
  // Check if password meets minimum requirements
  isValidPassword: (password) => {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialCharacter = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialCharacter;
  },
};

// Email validation utilities
export const emailValidation = {
  // Check if email format is valid
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
};

// Phone number validation utilities
export const phoneValidation = {
  // Check if Vietnamese phone number format is valid (max 11 digits)
  isValidPhoneNumber: (phoneNumber) => {
    // Remove all non-digit characters for validation
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      return false;
    }
    

    if (cleanPhone.length === 10) {
      return /^(03|05|07|08|09)\d{8}$/.test(cleanPhone);
    } else if (cleanPhone.length === 11) {
      return /^84(3|5|7|8|9)\d{8}$/.test(cleanPhone);
    }
    
    return false;
  }
};