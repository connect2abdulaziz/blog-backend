"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCommentById = exports.getCommentReplies = exports.updateCommentById = exports.postComments = exports.createComment = void 0;
const catchAsync_1 = __importDefault(require("../utils/errors/catchAsync"));
const appError_1 = require("../utils/errors/appError");
const appSuccess_1 = __importDefault(require("../utils/errors/appSuccess"));
const comment_validator_1 = require("../utils/validations/comment.validator");
const comment_service_1 = require("../services/comment.service");
const constants_1 = require("../utils/constants/constants");
// Create new comment
const createComment = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = comment_validator_1.commentSchema.validate(req.body);
    if (error) {
        throw new appError_1.AppError(error.details[0].message, constants_1.STATUS_CODE.BAD_REQUEST);
    }
    const commentData = value;
    const userId = req.userId;
    const newComment = yield (0, comment_service_1.addCommentServices)(commentData, userId);
    return res
        .status(constants_1.STATUS_CODE.CREATED)
        .json((0, appSuccess_1.default)(constants_1.SUCCESS_MESSAGES.COMMENT_CREATED, newComment));
}));
exports.createComment = createComment;
// Get comments on a post
const postComments = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: postId } = req.params;
    const { error, value } = comment_validator_1.queryCommentSchema.validate(req.query, {
        allowUnknown: true,
    });
    if (error) {
        throw new appError_1.AppError(error.details[0].message, constants_1.STATUS_CODE.BAD_REQUEST);
    }
    const { limit = 10, page = 1 } = value;
    const comments = yield (0, comment_service_1.postCommentsServices)(Number(postId), {
        limit,
        page,
    });
    return res
        .status(constants_1.STATUS_CODE.OK)
        .json((0, appSuccess_1.default)(constants_1.SUCCESS_MESSAGES.COMMENTS_RETRIEVED, comments));
}));
exports.postComments = postComments;
// Get replies on a comment
const getCommentReplies = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: commentId } = req.params;
    const { error, value } = comment_validator_1.queryRepliesSchema.validate(req.query, {
        allowUnknown: true,
    });
    if (error) {
        throw next(new appError_1.AppError(error.details[0].message, constants_1.STATUS_CODE.BAD_REQUEST));
    }
    const { limit = 10, page = 1 } = value;
    const replies = yield (0, comment_service_1.getCommentRepliesServices)(Number(commentId), {
        limit,
        page,
    });
    return res
        .status(constants_1.STATUS_CODE.OK)
        .json((0, appSuccess_1.default)(constants_1.SUCCESS_MESSAGES.REPLIES_RETRIEVED, replies));
}));
exports.getCommentReplies = getCommentReplies;
// Update comment
const updateCommentById = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: commentId } = req.params;
    const userId = req.userId;
    const { content } = req.body;
    const { error, value } = comment_validator_1.updateCommentSchema.validate({ content });
    if (error) {
        throw next(new appError_1.AppError(error.details[0].message, constants_1.STATUS_CODE.BAD_REQUEST));
    }
    const updateData = value;
    const updatedComment = yield (0, comment_service_1.updateCommentServices)(updateData, {
        commentId: Number(commentId),
        userId,
    });
    return res
        .status(constants_1.STATUS_CODE.OK)
        .json((0, appSuccess_1.default)(constants_1.SUCCESS_MESSAGES.COMMENT_UPDATED, updatedComment));
}));
exports.updateCommentById = updateCommentById;
// Delete comment
const deleteCommentById = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: commentId } = req.params;
    const userId = req.userId;
    const deletedComment = yield (0, comment_service_1.deleteCommentServices)({
        commentId: Number(commentId),
        userId,
    });
    return res
        .status(constants_1.STATUS_CODE.OK)
        .json((0, appSuccess_1.default)(constants_1.SUCCESS_MESSAGES.COMMENT_DELETED, deletedComment));
}));
exports.deleteCommentById = deleteCommentById;
//# sourceMappingURL=comment.controller.js.map