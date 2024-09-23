"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCommentSchema = exports.commentSchema = exports.queryRepliesSchema = exports.queryCommentSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const constants_1 = require("../constants/constants");
// Validation schema for creating a comment
const commentSchema = joi_1.default.object({
    content: joi_1.default.string().required().messages({
        "string.base": constants_1.ERROR_MESSAGES.CONTENT_STRING_REQUIRED,
        "string.empty": constants_1.ERROR_MESSAGES.CONTENT_CANNOT_BE_EMPTY,
        "any.required": constants_1.ERROR_MESSAGES.CONTENT_REQUIRED,
    }),
    parentId: joi_1.default.number().integer().positive().allow(null).messages({
        "number.base": constants_1.ERROR_MESSAGES.PARENT_ID_INVALID,
        "number.integer": constants_1.ERROR_MESSAGES.PARENT_ID_INVALID,
        "number.positive": constants_1.ERROR_MESSAGES.PARENT_ID_INVALID,
        "any.allowNull": constants_1.ERROR_MESSAGES.PARENT_ID_INVALID,
    }),
    postId: joi_1.default.number().integer().positive().required().messages({
        "number.base": constants_1.ERROR_MESSAGES.POST_ID_REQUIRED,
        "number.integer": constants_1.ERROR_MESSAGES.POST_ID_REQUIRED,
        "number.positive": constants_1.ERROR_MESSAGES.POST_ID_REQUIRED,
        "any.required": constants_1.ERROR_MESSAGES.POST_ID_REQUIRED,
    }),
});
exports.commentSchema = commentSchema;
// Validation schema for updating a comment
const updateCommentSchema = joi_1.default.object({
    content: joi_1.default.string().required().messages({
        "string.base": constants_1.ERROR_MESSAGES.CONTENT_STRING_REQUIRED,
        "string.empty": constants_1.ERROR_MESSAGES.CONTENT_CANNOT_BE_EMPTY,
        "any.required": constants_1.ERROR_MESSAGES.CONTENT_REQUIRED,
    }),
});
exports.updateCommentSchema = updateCommentSchema;
const queryCommentSchema = joi_1.default.object({
    limit: joi_1.default.number().integer().min(1).default(10),
    page: joi_1.default.number().integer().min(1).default(1),
    includeReplies: joi_1.default.boolean().default(false),
});
exports.queryCommentSchema = queryCommentSchema;
// Query validation schema for getting comment replies
const queryRepliesSchema = joi_1.default.object({
    limit: joi_1.default.number().integer().min(1).default(10),
    page: joi_1.default.number().integer().min(1).default(1),
});
exports.queryRepliesSchema = queryRepliesSchema;
//# sourceMappingURL=comment.validator.js.map