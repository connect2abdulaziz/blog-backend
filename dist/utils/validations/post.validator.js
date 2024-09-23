"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.querySchema = exports.updateSchema = exports.postSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const constants_1 = require("../constants/constants");
// Validation schema for creating a post
const postSchema = joi_1.default.object({
    categoryId: joi_1.default.number().min(1).max(10).required().messages({
        "number.min": constants_1.ERROR_MESSAGES.CATEGORY_ID_INVALID,
        "number.max": constants_1.ERROR_MESSAGES.CATEGORY_ID_INVALID,
        "number.required": constants_1.ERROR_MESSAGES.CATEGORY_ID_INVALID,
    }),
    title: joi_1.default.string().required().messages({
        "string.empty": constants_1.ERROR_MESSAGES.TITLE_REQUIRED,
    }),
    content: joi_1.default.string().required().messages({
        "string.empty": constants_1.ERROR_MESSAGES.CONTENT_REQUIRED,
    }),
    readTime: joi_1.default.number().min(1).required().messages({
        "number.min": constants_1.ERROR_MESSAGES.READ_TIME_INVALID,
        "number.required": constants_1.ERROR_MESSAGES.READ_TIME_INVALID,
    }),
    image: joi_1.default.string().base64().allow(null, "").messages({
        "string.base64": constants_1.ERROR_MESSAGES.IMAGE_BASE64_INVALID,
    }),
    thumbnail: joi_1.default.string().base64().allow(null, "").messages({
        "string.base64": constants_1.ERROR_MESSAGES.THUMBNAIL_BASE64_INVALID,
    }),
});
exports.postSchema = postSchema;
// Validation schema for updating a post
const updateSchema = joi_1.default.object({
    categoryId: joi_1.default.number().min(1).max(10).messages({
        "number.min": constants_1.ERROR_MESSAGES.CATEGORY_ID_INVALID,
        "number.max": constants_1.ERROR_MESSAGES.CATEGORY_ID_INVALID,
    }),
    title: joi_1.default.string(),
    content: joi_1.default.string(),
    readTime: joi_1.default.number().min(1).messages({
        "number.min": constants_1.ERROR_MESSAGES.READ_TIME_INVALID,
    }),
    image: joi_1.default.string().base64().allow(null, "").messages({
        "string.base64": constants_1.ERROR_MESSAGES.IMAGE_BASE64_INVALID,
    }),
    thumbnail: joi_1.default.string().base64().allow(null, "").messages({
        "string.base64": constants_1.ERROR_MESSAGES.THUMBNAIL_BASE64_INVALID,
    }),
});
exports.updateSchema = updateSchema;
const querySchema = joi_1.default.object({
    searchBy: joi_1.default.string().allow('').optional(),
    page: joi_1.default.number().integer().min(1).default(1).messages({
        "number.base": constants_1.ERROR_MESSAGES.PAGE_INVALID,
        "number.min": constants_1.ERROR_MESSAGES.PAGE_INVALID,
    }),
    limit: joi_1.default.number().integer().min(1).default(10).messages({
        "number.base": constants_1.ERROR_MESSAGES.LIMIT_INVALID,
        "number.min": constants_1.ERROR_MESSAGES.LIMIT_INVALID,
    }),
});
exports.querySchema = querySchema;
