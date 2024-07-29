const Joi = require("joi");
const { passwordPattern } = require("../constants/passwordPattern");

// Validation schema for user registration
const userSchema = Joi.object({
  firstName: Joi.string().min(1).max(255).required().messages({
    "string.empty": "First name is required",
    "string.min": "First name must be at least 1 character long",
    "string.max": "First name must be less than 256 characters long",
  }),
  lastName: Joi.string().min(1).max(255).required().messages({
    "string.empty": "Last name is required",
    "string.min": "Last name must be at least 1 character long",
    "string.max": "Last name must be less than 256 characters long",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email address",
    "string.empty": "Email is required",
  }),
  password: Joi.string()
    .min(8)
    .pattern(passwordPattern) 
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base":
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
    "string.empty": "Confirm password is required",
  }),
  profilePicture: Joi.string().base64().allow(null, "").messages({
    "string.base64": "Profile picture must be a valid base64 string",
  }),
  thumbnail: Joi.string().base64().allow(null, "").messages({
    "string.base64": "Thumbnail must be a valid base64 string",
  }),
});

module.exports = {
  userSchema
};
