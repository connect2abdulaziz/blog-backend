const Joi = require("joi");

// Validation schema for user registration
const postSchema = Joi.object({
  categoryId: Joi.number().min(1).max(10).required().messages({
    "number.min": "Category ID must be a positive integer between 1 and 10",
    "number.max": "Category ID must be a positive integer between 1 and 10",
    "number.required": "Category ID is required",
  }),
  
  title: Joi.string().required().messages({
    "string.empty": "Title is required",
  }),
  content: Joi.string().required().messages({
    "string.empty": "Content is required",
  }),
  readTime: Joi.number().min(1).required().messages({
    "number.min": "Read time must be a positive integer",
    "number.required": "Read time is required",
  }),
  image: Joi.string().base64().allow(null, "").messages({
    "string.base64": "Image must be a valid base64 string",
  }),
  thumbnail: Joi.string().base64().allow(null, "").messages({
    "string.base64": "Thumbnail must be a valid base64 string",
  }),
});


// Validation schema for post-update
const updateSchema = Joi.object({
  categoryId: Joi.number().min(1).max(10).messages({
    "number.min": "Category ID must be a positive integer between 1 and 10",
    "number.max": "Category ID must be a positive integer between 1 and 10",
  }),
  title: Joi.string(),
  content: Joi.string().required(),
  readTime: Joi.number().min(1).messages({
    "number.min": "Read time must be a positive integer",
  }),
  image: Joi.string().base64().allow(null, "").messages({
    "string.base64": "Image must be a valid base64 string",
  }),
  thumbnail: Joi.string().base64().allow(null, "").messages({
    "string.base64": "Thumbnail must be a valid base64 string",
  }),
});


module.exports = {
  postSchema, updateSchema
};