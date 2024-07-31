const Joi = require('joi');
const ERROR_MESSAGE = require('../constants');

// Validation schema for creating a comment
const commentSchema = Joi.object({
    content: Joi.string()
        .required()
        .messages({
            'string.base': ERROR_MESSAGE.CONTENT_STRING_REQUIRED,
            'string.empty': ERROR_MESSAGE.CONTENT_CANNOT_BE_EMPTY,
            'any.required': ERROR_MESSAGE.CONTENT_REQUIRED
        }),
    parentId: Joi.number()
        .integer()
        .positive()
        .allow(null)
        .messages({
            'number.base': ERROR_MESSAGE.PARENT_ID_INVALID,
            'number.integer': ERROR_MESSAGE.PARENT_ID_INVALID,
            'number.positive': ERROR_MESSAGE.PARENT_ID_INVALID,
            'any.allowNull': ERROR_MESSAGE.PARENT_ID_INVALID
        }),
    postId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': ERROR_MESSAGE.POST_ID_REQUIRED,
            'number.integer': ERROR_MESSAGE.POST_ID_REQUIRED,
            'number.positive': ERROR_MESSAGE.POST_ID_REQUIRED,
            'any.required': ERROR_MESSAGE.POST_ID_REQUIRED
        })
});

// Validation schema for updating a comment
const updateCommentSchema = Joi.object({
    content: Joi.string()
        .required()
        .messages({
            'string.base': ERROR_MESSAGE.CONTENT_STRING_REQUIRED,
            'string.empty': ERROR_MESSAGE.CONTENT_CANNOT_BE_EMPTY,
            'any.required': ERROR_MESSAGE.CONTENT_REQUIRED
        }),
});

module.exports = {
  commentSchema,
  updateCommentSchema
};
