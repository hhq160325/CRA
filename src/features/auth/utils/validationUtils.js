// Validation utilities for auth

// Password validation utilities
export const passwordValidation = {
  // Check if password meets minimum requirements
  isValidPassword: (password) => {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);

    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers;
  },

  // Get password strength score (0-4)
  getPasswordStrength: (password) => {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return Math.min(score, 4);
  },

  // Get password strength text
  getPasswordStrengthText: (password) => {
    const strength = passwordValidation.getPasswordStrength(password);
    const strengthTexts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return strengthTexts[strength] || 'Very Weak';
  }
};

// Email validation utilities
export const emailValidation = {
  // Check if email format is valid
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
};