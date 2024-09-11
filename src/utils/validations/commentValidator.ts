import Joi from 'joi';
import { ERROR_MESSAGES} from '../constants/constants';


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

const queryCommentSchema = Joi.object({
  limit: Joi.number().integer().min(1).default(10),
  page: Joi.number().integer().min(1).default(1),
  includeReplies: Joi.boolean().default(false),
});

// Query validation schema for getting comment replies
const queryRepliesSchema = Joi.object({
  limit: Joi.number().integer().min(1).default(10),
  page: Joi.number().integer().min(1).default(1),
});

export {
  queryCommentSchema,
  queryRepliesSchema,
  commentSchema,
  updateCommentSchema,
};
