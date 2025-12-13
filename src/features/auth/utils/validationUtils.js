// Validation utilities for auth

// Password validation utilities
export const passwordValidation = {
  // Check if password meets minimum requirements
  isValidPassword: (password) => {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialCharacter = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
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
  // Check if phone number format is valid (supports various formats)
  isValidPhoneNumber: (phoneNumber) => {
    // Remove all non-digit characters for validation
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    // Check if it's between 10-15 digits (international standard)
    return cleanPhone.length >= 10 && cleanPhone.length <= 15;
  }
};