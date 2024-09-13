import Joi from 'joi';
import { ERROR_MESSAGES } from '../constants/constants';


// Validation schema for creating a post
const postSchema = Joi.object({
  categoryId: Joi.number().min(1).max(10).required().messages({
    "number.min": ERROR_MESSAGES.CATEGORY_ID_INVALID,
    "number.max": ERROR_MESSAGES.CATEGORY_ID_INVALID,
    "number.required": ERROR_MESSAGES.CATEGORY_ID_INVALID,
  }),
  title: Joi.string().required().messages({
    "string.empty": ERROR_MESSAGES.TITLE_REQUIRED,
  }),
  content: Joi.string().required().messages({
    "string.empty": ERROR_MESSAGES.CONTENT_REQUIRED,
  }),
  readTime: Joi.number().min(1).required().messages({
    "number.min": ERROR_MESSAGES.READ_TIME_INVALID,
    "number.required": ERROR_MESSAGES.READ_TIME_INVALID,
  }),
  image: Joi.string().base64().allow(null, "").messages({
    "string.base64": ERROR_MESSAGES.IMAGE_BASE64_INVALID,
  }),
  thumbnail: Joi.string().base64().allow(null, "").messages({
    "string.base64": ERROR_MESSAGES.THUMBNAIL_BASE64_INVALID,
  }),
});

// Validation schema for updating a post
const updateSchema = Joi.object({
  categoryId: Joi.number().min(1).max(10).messages({
    "number.min": ERROR_MESSAGES.CATEGORY_ID_INVALID,
    "number.max": ERROR_MESSAGES.CATEGORY_ID_INVALID,
  }),
  title: Joi.string(),
  content: Joi.string(),
  readTime: Joi.number().min(1).messages({
    "number.min": ERROR_MESSAGES.READ_TIME_INVALID,
  }),
  image: Joi.string().base64().allow(null, "").messages({
    "string.base64": ERROR_MESSAGES.IMAGE_BASE64_INVALID,
  }),
  thumbnail: Joi.string().base64().allow(null, "").messages({
    "string.base64": ERROR_MESSAGES.THUMBNAIL_BASE64_INVALID,
  }),
});

const querySchema = Joi.object({
  searchBy: Joi.string().allow('').optional(), 
  page: Joi.number().integer().min(1).default(1).messages({
    "number.base": ERROR_MESSAGES.PAGE_INVALID,
    "number.min": ERROR_MESSAGES.PAGE_INVALID,
  }),
  limit: Joi.number().integer().min(1).default(10).messages({
    "number.base": ERROR_MESSAGES.LIMIT_INVALID,
    "number.min": ERROR_MESSAGES.LIMIT_INVALID,
  }),
});


export {
  postSchema,
  updateSchema,
  querySchema,
};
