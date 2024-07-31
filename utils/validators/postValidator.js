const Joi = require("joi");
const ERROR_MESSAGE = require("../constants");

// Validation schema for creating a post
const postSchema = Joi.object({
  categoryId: Joi.number().min(1).max(10).required().messages({
    "number.min": ERROR_MESSAGE.CATEGORY_ID_INVALID,
    "number.max": ERROR_MESSAGE.CATEGORY_ID_INVALID,
    "number.required": ERROR_MESSAGE.CATEGORY_ID_INVALID,
  }),
  title: Joi.string().required().messages({
    "string.empty": ERROR_MESSAGE.TITLE_REQUIRED,
  }),
  content: Joi.string().required().messages({
    "string.empty": ERROR_MESSAGE.CONTENT_REQUIRED,
  }),
  readTime: Joi.number().min(1).required().messages({
    "number.min": ERROR_MESSAGE.READ_TIME_INVALID,
    "number.required": ERROR_MESSAGE.READ_TIME_INVALID,
  }),
  image: Joi.string().base64().allow(null, "").messages({
    "string.base64": ERROR_MESSAGE.IMAGE_BASE64_INVALID,
  }),
  thumbnail: Joi.string().base64().allow(null, "").messages({
    "string.base64": ERROR_MESSAGE.THUMBNAIL_BASE64_INVALID,
  }),
});

// Validation schema for updating a post
const updateSchema = Joi.object({
  categoryId: Joi.number().min(1).max(10).messages({
    "number.min": ERROR_MESSAGE.CATEGORY_ID_INVALID,
    "number.max": ERROR_MESSAGE.CATEGORY_ID_INVALID,
  }),
  title: Joi.string(),
  content: Joi.string(),
  readTime: Joi.number().min(1).messages({
    "number.min": ERROR_MESSAGE.READ_TIME_INVALID,
  }),
  image: Joi.string().base64().allow(null, "").messages({
    "string.base64": ERROR_MESSAGE.IMAGE_BASE64_INVALID,
  }),
  thumbnail: Joi.string().base64().allow(null, "").messages({
    "string.base64": ERROR_MESSAGE.THUMBNAIL_BASE64_INVALID,
  }),
});

module.exports = {
  postSchema,
  updateSchema
};
