"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.updateUserSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.loginSchema = exports.userSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const constants_1 = require("../constants/constants");
// Validation schema for user registration
const userSchema = joi_1.default.object({
    firstName: joi_1.default.string().min(1).max(255).required().messages({
        "string.empty": constants_1.ERROR_MESSAGES.FIRST_NAME_REQUIRED,
        "string.min": constants_1.ERROR_MESSAGES.FIRST_NAME_MIN_LENGTH,
        "string.max": constants_1.ERROR_MESSAGES.FIRST_NAME_MAX_LENGTH,
    }),
    lastName: joi_1.default.string().min(1).max(255).required().messages({
        "string.empty": constants_1.ERROR_MESSAGES.LAST_NAME_REQUIRED,
        "string.min": constants_1.ERROR_MESSAGES.LAST_NAME_MIN_LENGTH,
        "string.max": constants_1.ERROR_MESSAGES.LAST_NAME_MAX_LENGTH,
    }),
    email: joi_1.default.string().email().required().messages({
        "string.email": constants_1.ERROR_MESSAGES.EMAIL_INVALID,
        "string.empty": constants_1.ERROR_MESSAGES.EMAIL_REQUIRED,
    }),
    password: joi_1.default.string()
        .min(8)
        .pattern(constants_1.PASSWORD_PATTERN.REGEXP)
        .required()
        .messages({
        "string.empty": constants_1.ERROR_MESSAGES.PASSWORD_REQUIRED,
        "string.min": constants_1.ERROR_MESSAGES.PASSWORD_MIN_LENGTH,
        "string.pattern.base": constants_1.ERROR_MESSAGES.PASSWORD_PATTERN_INVALID,
    }),
    confirmPassword: joi_1.default.string().valid(joi_1.default.ref("password")).required().messages({
        "any.only": constants_1.ERROR_MESSAGES.CONFIRM_PASSWORD_MISMATCH,
        "string.empty": constants_1.ERROR_MESSAGES.CONFIRM_PASSWORD_MISMATCH,
    }),
    profilePicture: joi_1.default.string().base64().allow(null, "").messages({
        "string.base64": constants_1.ERROR_MESSAGES.INVALID_IMAGE_FORMAT,
    }),
    thumbnail: joi_1.default.string().base64().allow(null, "").messages({
        "string.base64": constants_1.ERROR_MESSAGES.INVALID_IMAGE_FORMAT,
    }),
});
exports.userSchema = userSchema;
// Validation schema for user login
const loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        "string.email": constants_1.ERROR_MESSAGES.EMAIL_INVALID,
        "string.empty": constants_1.ERROR_MESSAGES.EMAIL_REQUIRED,
    }),
    password: joi_1.default.string().required().messages({
        "string.empty": constants_1.ERROR_MESSAGES.PASSWORD_REQUIRED,
    }),
});
exports.loginSchema = loginSchema;
// Validation schema for forgot password
const forgotPasswordSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        "string.email": constants_1.ERROR_MESSAGES.EMAIL_INVALID,
        "string.empty": constants_1.ERROR_MESSAGES.EMAIL_REQUIRED,
    }),
});
exports.forgotPasswordSchema = forgotPasswordSchema;
// Validation schema for reset password
const resetPasswordSchema = joi_1.default.object({
    password: joi_1.default.string()
        .min(8)
        .pattern(constants_1.PASSWORD_PATTERN.REGEXP)
        .required()
        .messages({
        "string.empty": constants_1.ERROR_MESSAGES.PASSWORD_REQUIRED,
        "string.min": constants_1.ERROR_MESSAGES.PASSWORD_MIN_LENGTH,
        "string.pattern.base": constants_1.ERROR_MESSAGES.PASSWORD_PATTERN_INVALID,
    }),
});
exports.resetPasswordSchema = resetPasswordSchema;
const updateUserSchema = joi_1.default.object({
    firstName: joi_1.default.string().min(1).max(255).messages({
        "string.empty": constants_1.ERROR_MESSAGES.FIRST_NAME_REQUIRED,
        "string.min": constants_1.ERROR_MESSAGES.FIRST_NAME_MIN_LENGTH,
        "string.max": constants_1.ERROR_MESSAGES.FIRST_NAME_MAX_LENGTH,
    }),
    lastName: joi_1.default.string().min(1).max(255).messages({
        "string.empty": constants_1.ERROR_MESSAGES.LAST_NAME_REQUIRED,
        "string.min": constants_1.ERROR_MESSAGES.LAST_NAME_MIN_LENGTH,
        "string.max": constants_1.ERROR_MESSAGES.LAST_NAME_MAX_LENGTH,
    }),
    profilePicture: joi_1.default.string().base64().allow(null, "").messages({
        "string.base64": constants_1.ERROR_MESSAGES.INVALID_IMAGE_FORMAT,
    }),
    thumbnail: joi_1.default.string().base64().allow(null, "").messages({
        "string.base64": constants_1.ERROR_MESSAGES.INVALID_IMAGE_FORMAT,
    }),
});
exports.updateUserSchema = updateUserSchema;
// Validation schema for changing password
const changePasswordSchema = joi_1.default.object({
    currentPassword: joi_1.default.string().required().messages({
        "string.empty": constants_1.ERROR_MESSAGES.OLD_PASSWORD_REQUIRED,
    }),
    newPassword: joi_1.default.string()
        .min(8)
        .pattern(constants_1.PASSWORD_PATTERN.REGEXP)
        .required()
        .messages({
        "string.empty": constants_1.ERROR_MESSAGES.NEW_PASSWORD_REQUIRED,
        "string.min": constants_1.ERROR_MESSAGES.NEW_PASSWORD_MIN_LENGTH,
        "string.pattern.base": constants_1.ERROR_MESSAGES.NEW_PASSWORD_PATTERN_INVALID,
    }),
});
exports.changePasswordSchema = changePasswordSchema;
//# sourceMappingURL=user.validator.js.map