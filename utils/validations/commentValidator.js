const Joi = require("joi");
const {ERROR_MESSAGES} = require("../constants/constants");

// Validation schema for creating a comment
const commentSchema = Joi.object({
  content: Joi.string().required().messages({
    "string.base": ERROR_MESSAGES.CONTENT_STRING_REQUIRED,
    "string.empty": ERROR_MESSAGES.CONTENT_CANNOT_BE_EMPTY,
    "any.required": ERROR_MESSAGES.CONTENT_REQUIRED,
  }),
  parentId: Joi.number().integer().positive().allow(null).messages({
    "number.base": ERROR_MESSAGES.PARENT_ID_INVALID,
    "number.integer": ERROR_MESSAGES.PARENT_ID_INVALID,
    "number.positive": ERROR_MESSAGES.PARENT_ID_INVALID,
    "any.allowNull": ERROR_MESSAGES.PARENT_ID_INVALID,
  }),
  postId: Joi.number().integer().positive().required().messages({
    "number.base": ERROR_MESSAGES.POST_ID_REQUIRED,
    "number.integer": ERROR_MESSAGES.POST_ID_REQUIRED,
    "number.positive": ERROR_MESSAGES.POST_ID_REQUIRED,
    "any.required": ERROR_MESSAGES.POST_ID_REQUIRED,
  }),
});

// Validation schema for updating a comment
const updateCommentSchema = Joi.object({
  content: Joi.string().required().messages({
    "string.base": ERROR_MESSAGES.CONTENT_STRING_REQUIRED,
    "string.empty": ERROR_MESSAGES.CONTENT_CANNOT_BE_EMPTY,
    "any.required": ERROR_MESSAGES.CONTENT_REQUIRED,
  }),
});

module.exports = {
  commentSchema,
  updateCommentSchema,
};
