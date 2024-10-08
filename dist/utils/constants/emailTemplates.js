"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMAIL_CONSTANTS = exports.EMAIL_TEMPLATES = exports.EMAIL_SUBJECTS = void 0;
const EMAIL_SUBJECTS = {
    EMAIL_VERIFICATION: 'Email Verification',
    PASSWORD_RESET: 'Password Reset',
};
exports.EMAIL_SUBJECTS = EMAIL_SUBJECTS;
const EMAIL_TEMPLATES = {
    EMAIL_VERIFICATION: {
        text: (url) => `Please verify your email by clicking on the following link: ${url}\n\nThe link will expire in 1 hour.`,
        html: (url) => `
      <p>Please verify your email by clicking on the following link:</p>
      <p><a href="${url}">Verify Email</a></p>
      <p>The link will expire in 1 hour.</p>`,
    },
    PASSWORD_RESET: {
        text: (url) => `You requested a password reset. Please use the following link to reset your password: ${url}\n\nThe link will expire in 5 minutes.`,
        html: (url) => `
      <p>You requested a password reset. Please use the following link to reset your password:</p>
      <p><a href="${url}">Reset Password</a></p>
      <p>The link will expire in 5 minutes.</p>`,
    },
};
exports.EMAIL_TEMPLATES = EMAIL_TEMPLATES;
const EMAIL_CONSTANTS = {
    VERIFY_EMAIL_ENDPOINT: '/verify-email',
    RESET_PASSWORD_ENDPOINT: '/reset-password',
    VERIFY_EMAIL_TOKEN_EXPIRATION: '1h',
    RESET_PASSWORD_TOKEN_EXPIRATION: '5m',
};
exports.EMAIL_CONSTANTS = EMAIL_CONSTANTS;
//# sourceMappingURL=emailTemplates.js.map