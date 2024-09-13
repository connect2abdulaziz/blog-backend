import Joi from 'joi';
import { ERROR_MESSAGES, PASSWORD_PATTERN } from '../constants/constants';


// Validation schema for user registration
const userSchema = Joi.object({
  firstName: Joi.string().min(1).max(255).required().messages({
    "string.empty": ERROR_MESSAGES.FIRST_NAME_REQUIRED,
    "string.min": ERROR_MESSAGES.FIRST_NAME_MIN_LENGTH,
    "string.max": ERROR_MESSAGES.FIRST_NAME_MAX_LENGTH,
  }),
  lastName: Joi.string().min(1).max(255).required().messages({
    "string.empty": ERROR_MESSAGES.LAST_NAME_REQUIRED,
    "string.min": ERROR_MESSAGES.LAST_NAME_MIN_LENGTH,
    "string.max": ERROR_MESSAGES.LAST_NAME_MAX_LENGTH,
  }),
  email: Joi.string().email().required().messages({
    "string.email": ERROR_MESSAGES.EMAIL_INVALID,
    "string.empty": ERROR_MESSAGES.EMAIL_REQUIRED,
  }),
  password: Joi.string()
    .min(8)
    .pattern(PASSWORD_PATTERN.REGEXP)
    .required()
    .messages({
      "string.empty": ERROR_MESSAGES.PASSWORD_REQUIRED,
      "string.min": ERROR_MESSAGES.PASSWORD_MIN_LENGTH,
      "string.pattern.base": ERROR_MESSAGES.PASSWORD_PATTERN_INVALID,
    }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": ERROR_MESSAGES.CONFIRM_PASSWORD_MISMATCH,
    "string.empty": ERROR_MESSAGES.CONFIRM_PASSWORD_MISMATCH,
  }),
  profilePicture: Joi.string().base64().allow(null, "").messages({
    "string.base64": ERROR_MESSAGES.INVALID_IMAGE_FORMAT,
  }),
  thumbnail: Joi.string().base64().allow(null, "").messages({
    "string.base64": ERROR_MESSAGES.INVALID_IMAGE_FORMAT,
  }),
});

// Validation schema for user login
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": ERROR_MESSAGES.EMAIL_INVALID,
    "string.empty": ERROR_MESSAGES.EMAIL_REQUIRED,
  }),
  password: Joi.string().required().messages({
    "string.empty": ERROR_MESSAGES.PASSWORD_REQUIRED,
  }),
});

// Validation schema for forgot password
const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": ERROR_MESSAGES.EMAIL_INVALID,
    "string.empty": ERROR_MESSAGES.EMAIL_REQUIRED,
  }),
});

// Validation schema for reset password
const resetPasswordSchema = Joi.object({
  password: Joi.string()
    .min(8)
    .pattern(PASSWORD_PATTERN.REGEXP)
    .required()
    .messages({
      "string.empty": ERROR_MESSAGES.PASSWORD_REQUIRED,
      "string.min": ERROR_MESSAGES.PASSWORD_MIN_LENGTH,
      "string.pattern.base": ERROR_MESSAGES.PASSWORD_PATTERN_INVALID,
    }),
});

const updateUserSchema = Joi.object({
  firstName: Joi.string().min(1).max(255).messages({
    "string.empty": ERROR_MESSAGES.FIRST_NAME_REQUIRED,
    "string.min": ERROR_MESSAGES.FIRST_NAME_MIN_LENGTH,
    "string.max": ERROR_MESSAGES.FIRST_NAME_MAX_LENGTH,
  }),
  lastName: Joi.string().min(1).max(255).messages({
    "string.empty": ERROR_MESSAGES.LAST_NAME_REQUIRED,
    "string.min": ERROR_MESSAGES.LAST_NAME_MIN_LENGTH,
    "string.max": ERROR_MESSAGES.LAST_NAME_MAX_LENGTH,
  }),
  profilePicture: Joi.string().base64().allow(null, "").messages({
    "string.base64": ERROR_MESSAGES.INVALID_IMAGE_FORMAT,
  }),
  thumbnail: Joi.string().base64().allow(null, "").messages({
    "string.base64": ERROR_MESSAGES.INVALID_IMAGE_FORMAT,
  }),
});

// Validation schema for changing password
const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    "string.empty": ERROR_MESSAGES.OLD_PASSWORD_REQUIRED,
  }),
  newPassword: Joi.string()
    .min(8)
    .pattern(PASSWORD_PATTERN.REGEXP)
    .required()
    .messages({
      "string.empty": ERROR_MESSAGES.NEW_PASSWORD_REQUIRED,
      "string.min": ERROR_MESSAGES.NEW_PASSWORD_MIN_LENGTH,
      "string.pattern.base": ERROR_MESSAGES.NEW_PASSWORD_PATTERN_INVALID,
    }),
});

export {
  userSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateUserSchema,
  changePasswordSchema,
};
