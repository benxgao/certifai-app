/**
 * Input validation and sanitization utilities for security
 */

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim()) && email.length <= 254; // RFC 5321 limit
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (password.length > 128) {
    errors.push('Password must be less than 128 characters long');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  // Check for common weak passwords
  const commonPasswords = [
    'password',
    '123456',
    'password123',
    'admin',
    'qwerty',
    'letmein',
    'welcome',
    'monkey',
    '1234567890',
  ];

  if (commonPasswords.some((weak) => password.toLowerCase().includes(weak))) {
    errors.push('Password contains common weak patterns');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>\"'&]/g, (match) => {
    const entityMap: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '&': '&amp;',
    };
    return entityMap[match] || match;
  });
}

/**
 * Validate and sanitize name fields
 */
export function validateName(name: string): {
  isValid: boolean;
  sanitized: string;
  error?: string;
} {
  const trimmed = name.trim();

  if (!trimmed) {
    return {
      isValid: false,
      sanitized: '',
      error: 'Name is required',
    };
  }

  if (trimmed.length > 50) {
    return {
      isValid: false,
      sanitized: '',
      error: 'Name must be less than 50 characters',
    };
  }

  // Allow letters, spaces, hyphens, and apostrophes
  if (!/^[a-zA-Z\s\-']+$/.test(trimmed)) {
    return {
      isValid: false,
      sanitized: '',
      error: 'Name contains invalid characters',
    };
  }

  return {
    isValid: true,
    sanitized: sanitizeString(trimmed),
  };
}

/**
 * Validate JWT token format
 */
export function isValidJWTFormat(token: string): boolean {
  const parts = token.split('.');
  return parts.length === 3 && parts.every((part) => part.length > 0);
}

/**
 * Validate Firebase UID format
 */
export function isValidFirebaseUID(uid: string): boolean {
  return /^[a-zA-Z0-9]{28}$/.test(uid);
}

/**
 * Validate URL format
 */
export function isValidURL(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
}

/**
 * Validate and sanitize request body for authentication
 */
export function validateAuthRequestBody(body: any): {
  isValid: boolean;
  errors: string[];
  sanitized?: any;
} {
  const errors: string[] = [];
  const sanitized: any = {};

  // Validate email if present
  if (body.email !== undefined) {
    if (typeof body.email !== 'string') {
      errors.push('Email must be a string');
    } else if (!isValidEmail(body.email)) {
      errors.push('Invalid email format');
    } else {
      sanitized.email = body.email.trim().toLowerCase();
    }
  }

  // Validate password if present
  if (body.password !== undefined) {
    if (typeof body.password !== 'string') {
      errors.push('Password must be a string');
    } else {
      const passwordValidation = validatePassword(body.password);
      if (!passwordValidation.isValid) {
        errors.push(...passwordValidation.errors);
      } else {
        sanitized.password = body.password; // Don't sanitize passwords
      }
    }
  }

  // Validate names if present
  if (body.firstName !== undefined) {
    if (typeof body.firstName !== 'string') {
      errors.push('First name must be a string');
    } else {
      const nameValidation = validateName(body.firstName);
      if (!nameValidation.isValid) {
        errors.push(nameValidation.error!);
      } else {
        sanitized.firstName = nameValidation.sanitized;
      }
    }
  }

  if (body.lastName !== undefined) {
    if (typeof body.lastName !== 'string') {
      errors.push('Last name must be a string');
    } else {
      const nameValidation = validateName(body.lastName);
      if (!nameValidation.isValid) {
        errors.push(nameValidation.error!);
      } else {
        sanitized.lastName = nameValidation.sanitized;
      }
    }
  }

  // Validate Firebase token if present
  if (body.firebaseToken !== undefined) {
    if (typeof body.firebaseToken !== 'string') {
      errors.push('Firebase token must be a string');
    } else if (!isValidJWTFormat(body.firebaseToken)) {
      errors.push('Invalid Firebase token format');
    } else {
      sanitized.firebaseToken = body.firebaseToken.trim();
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: errors.length === 0 ? sanitized : undefined,
  };
}
