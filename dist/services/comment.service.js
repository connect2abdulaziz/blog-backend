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
exports.deleteCommentServices = exports.updateCommentServices = exports.getCommentRepliesServices = exports.postCommentsServices = exports.addCommentServices = void 0;
const comment_model_1 = __importDefault(require("../db/models/comment.model"));
const user_model_1 = __importDefault(require("../db/models/user.model"));
const post_model_1 = __importDefault(require("../db/models/post.model"));
const appError_1 = require("../utils/errors/appError");
const constants_1 = require("../utils/constants/constants");
const sequelize_1 = require("sequelize");
const pagination_1 = __importDefault(require("../utils/pagination"));
// Add a new comment to a post
const addCommentServices = (_a, userId_1) => __awaiter(void 0, [_a, userId_1], void 0, function* ({ postId, parentId, content }, userId) {
    try {
        if (parentId && !(yield comment_model_1.default.findByPk(parentId))) {
            throw new appError_1.AppError(constants_1.ERROR_MESSAGES.INVALID_PARENT_COMMENT_ID, constants_1.STATUS_CODE.BAD_REQUEST);
        }
        const post = yield post_model_1.default.findByPk(postId);
        if (!post)
            throw new appError_1.AppError(constants_1.ERROR_MESSAGES.POST_NOT_FOUND, constants_1.STATUS_CODE.NOT_FOUND);
        const newComment = yield comment_model_1.default.create({
            userId,
            postId,
            parentId,
            content,
        });
        return newComment;
    }
    catch (error) {
        throw error;
    }
});
exports.addCommentServices = addCommentServices;
// Count nested replies
const countNestedReplies = (commentId_1, ...args_1) => __awaiter(void 0, [commentId_1, ...args_1], void 0, function* (commentId, maxDepth = 2) {
    try {
        if (!comment_model_1.default.sequelize) {
            throw new appError_1.AppError("Sequelize instance is not defined", constants_1.STATUS_CODE.INTERNAL_SERVER_ERROR);
        }
        const query = `
      WITH RECURSIVE ReplyHierarchy AS (
        SELECT id, "parentId", 1 AS level
        FROM comment
        WHERE "parentId" = :commentId
        
        UNION ALL
        
        SELECT c.id, c."parentId", rh.level + 1
        FROM comment c
        INNER JOIN ReplyHierarchy rh ON c."parentId" = rh.id
        WHERE rh.level < :maxDepth
      )
      SELECT COUNT(*) AS "totalCount"
      FROM ReplyHierarchy
    `;
        const results = (yield comment_model_1.default.sequelize.query(query, {
            replacements: { commentId, maxDepth },
            type: sequelize_1.QueryTypes.SELECT,
        }));
        const totalCount = results.length > 0 ? parseInt(results[0].totalCount, 10) : 0;
        return totalCount;
    }
    catch (error) {
        throw error;
    }
});
// Get comments for a post
const postCommentsServices = (postId, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postExists = yield post_model_1.default.findByPk(postId);
        if (!postExists) {
            throw new appError_1.AppError(constants_1.ERROR_MESSAGES.POST_NOT_FOUND, constants_1.STATUS_CODE.NOT_FOUND);
        }
        const filter = {
            where: { postId, parentId: null },
            include: [
                { model: user_model_1.default, attributes: ["firstName", "lastName", "thumbnail"] },
            ],
        };
        const result = yield (0, pagination_1.default)(options.page, options.limit, filter, comment_model_1.default);
        if (result.pagination.totalCount === 0)
            return {
                data: [],
                pagination: result.pagination,
            };
        const comments = result.data;
        const commentIds = comments.map((c) => c.id);
        const replyCountsResult = yield Promise.all(commentIds.map((id) => __awaiter(void 0, void 0, void 0, function* () {
            return ({
                commentId: id,
                repliesCount: yield countNestedReplies(id),
            });
        })));
        const replyCountsMap = replyCountsResult.reduce((map, { commentId, repliesCount }) => {
            map[commentId] = repliesCount;
            return map;
        }, {});
        const commentsWithCounts = comments.map((c) => (Object.assign(Object.assign({}, c.toJSON()), { repliesCount: replyCountsMap[c.id] || 0 })));
        return {
            data: commentsWithCounts,
            pagination: result.pagination,
        };
    }
    catch (error) {
        throw error;
    }
});
exports.postCommentsServices = postCommentsServices;
// Get replies to a comment
const getCommentRepliesServices = (commentId, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(yield comment_model_1.default.findByPk(commentId))) {
            throw new appError_1.AppError(constants_1.ERROR_MESSAGES.COMMENT_NOT_FOUND, constants_1.STATUS_CODE.NOT_FOUND);
        }
        const filter = {
            where: { parentId: commentId },
            include: [
                { model: user_model_1.default, attributes: ["firstName", "lastName", "thumbnail"] },
            ],
        };
        const result = yield (0, pagination_1.default)(options.page, options.limit, filter, comment_model_1.default);
        if (result.pagination.totalCount === 0)
            return {
                data: [],
                pagination: result.pagination,
            };
        const replies = result.data;
        const replyIds = replies.map((r) => r.id);
        const repliesCounts = yield Promise.all(replyIds.map((id) => __awaiter(void 0, void 0, void 0, function* () {
            return ({
                replyId: id,
                repliesCount: yield countNestedReplies(id),
            });
        })));
        const nestedRepliesMap = repliesCounts.reduce((map, { replyId, repliesCount }) => {
            map[replyId] = repliesCount;
            return map;
        }, {});
        const repliesWithCounts = replies.map((r) => (Object.assign(Object.assign({}, r.toJSON()), { repliesCount: nestedRepliesMap[r.id] || 0 })));
        return {
            data: repliesWithCounts,
            pagination: result.pagination,
        };
    }
    catch (error) {
        throw error;
    }
});
exports.getCommentRepliesServices = getCommentRepliesServices;
// Update a comment
const updateCommentServices = (_a, _b) => __awaiter(void 0, [_a, _b], void 0, function* ({ content }, { commentId, userId }) {
    try {
        const comment = yield comment_model_1.default.findByPk(commentId);
        if (!comment) {
            throw new appError_1.AppError(constants_1.ERROR_MESSAGES.COMMENT_NOT_FOUND, constants_1.STATUS_CODE.NOT_FOUND);
        }
        if (comment.userId !== userId) {
            throw new appError_1.AppError(constants_1.ERROR_MESSAGES.UNAUTHORIZED, constants_1.STATUS_CODE.UNAUTHORIZED);
        }
        yield comment.update({
            content,
            updatedAt: new Date(),
        });
        return comment;
    }
    catch (error) {
        throw error;
    }
});
exports.updateCommentServices = updateCommentServices;
// Delete a comment
const deleteCommentServices = (_a) => __awaiter(void 0, [_a], void 0, function* ({ commentId, userId, }) {
    try {
        const comment = yield comment_model_1.default.findByPk(commentId);
        if (!comment) {
            throw new appError_1.AppError(constants_1.ERROR_MESSAGES.COMMENT_NOT_FOUND, constants_1.STATUS_CODE.NOT_FOUND);
        }
        if (comment.userId !== userId) {
            throw new appError_1.AppError(constants_1.ERROR_MESSAGES.UNAUTHORIZED, constants_1.STATUS_CODE.UNAUTHORIZED);
        }
        yield comment_model_1.default.destroy({ where: { id: commentId } });
        return comment;
    }
    catch (error) {
        throw error;
    }
});
exports.deleteCommentServices = deleteCommentServices;
