interface EmailTemplate {
  text: (url: string) => string;
  html: (url: string) => string;
}

const EMAIL_SUBJECTS = {
  EMAIL_VERIFICATION: 'Email Verification',
  PASSWORD_RESET: 'Password Reset',
} as const;

const EMAIL_TEMPLATES: {
  EMAIL_VERIFICATION: EmailTemplate;
  PASSWORD_RESET: EmailTemplate;
} = {
  EMAIL_VERIFICATION: {
    text: (url: string) => `Please verify your email by clicking on the following link: ${url}\n\nThe link will expire in 1 hour.`,
    html: (url: string) => `
      <p>Please verify your email by clicking on the following link:</p>
      <p><a href="${url}">Verify Email</a></p>
      <p>The link will expire in 1 hour.</p>`,
  },
  PASSWORD_RESET: {
    text: (url: string) => `You requested a password reset. Please use the following link to reset your password: ${url}\n\nThe link will expire in 5 minutes.`,
    html: (url: string) => `
      <p>You requested a password reset. Please use the following link to reset your password:</p>
      <p><a href="${url}">Reset Password</a></p>
      <p>The link will expire in 5 minutes.</p>`,
  },
};

const EMAIL_CONSTANTS = {
  VERIFY_EMAIL_ENDPOINT: '/verify-email',
  RESET_PASSWORD_ENDPOINT: '/reset-password',
  VERIFY_EMAIL_TOKEN_EXPIRATION: '1h',
  RESET_PASSWORD_TOKEN_EXPIRATION: '5m',
} as const;

export {
  EMAIL_SUBJECTS,
  EMAIL_TEMPLATES,
  EMAIL_CONSTANTS,
};
