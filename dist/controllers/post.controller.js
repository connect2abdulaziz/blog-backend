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
exports.deletePostById = exports.updatePostById = exports.getPostById = exports.getPosts = exports.createPost = void 0;
const catchAsync_1 = __importDefault(require("../utils/errors/catchAsync"));
const appError_1 = require("../utils/errors/appError");
const appSuccess_1 = __importDefault(require("../utils/errors/appSuccess"));
const post_validator_1 = require("../utils/validations/post.validator");
const post_service_1 = require("../services/post.service");
const constants_1 = require("../utils/constants/constants");
// Create new post
const createPost = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = post_validator_1.postSchema.validate(req.body);
    if (error) {
        throw new appError_1.AppError(error.details[0].message, constants_1.STATUS_CODE.BAD_REQUEST);
    }
    const postData = value;
    const userId = req.userId;
    const newPost = yield (0, post_service_1.createPostServices)(userId, postData, req.file);
    return res
        .status(constants_1.STATUS_CODE.CREATED)
        .json((0, appSuccess_1.default)(constants_1.SUCCESS_MESSAGES.POST_CREATED, newPost));
}));
exports.createPost = createPost;
// Get all posts
const getPosts = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = post_validator_1.querySchema.validate(req.query);
    if (error)
        throw next(new appError_1.AppError(error.details[0].message, constants_1.STATUS_CODE.BAD_REQUEST));
    const { searchBy, page = 1, limit = 10 } = value;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const userId = req.userId;
    const posts = yield (0, post_service_1.getAllPostServices)({
        searchBy,
        page: pageNumber,
        limit: limitNumber,
        userId,
    });
    return res
        .status(constants_1.STATUS_CODE.OK)
        .json((0, appSuccess_1.default)(constants_1.SUCCESS_MESSAGES.POSTS_RETRIEVED, posts));
}));
exports.getPosts = getPosts;
// Get post by id
const getPostById = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: postId } = req.params;
    const result = yield (0, post_service_1.getPostServices)(Number(postId));
    return res
        .status(constants_1.STATUS_CODE.OK)
        .json((0, appSuccess_1.default)(constants_1.SUCCESS_MESSAGES.POST_RETRIEVED, result));
}));
exports.getPostById = getPostById;
// Update post
const updatePostById = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, categoryId, readTime } = req.body;
    const { error, value } = post_validator_1.updateSchema.validate({
        title,
        content,
        categoryId,
        readTime,
    });
    if (error) {
        throw next(new appError_1.AppError(error.details[0].message, constants_1.STATUS_CODE.BAD_REQUEST));
    }
    const userId = req.userId;
    const { id: postId } = req.params;
    const updatedPost = yield (0, post_service_1.updatePostServices)(Number(postId), userId, value, req.file);
    return res
        .status(constants_1.STATUS_CODE.OK)
        .json((0, appSuccess_1.default)(constants_1.SUCCESS_MESSAGES.POST_UPDATED, updatedPost));
}));
exports.updatePostById = updatePostById;
// Delete post
const deletePostById = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: postId } = req.params;
    const userId = req.userId;
    const deletedPostId = yield (0, post_service_1.deletePostServices)({
        postId: Number(postId),
        userId,
    });
    return res
        .status(constants_1.STATUS_CODE.OK)
        .json((0, appSuccess_1.default)(constants_1.SUCCESS_MESSAGES.POST_DELETED, deletedPostId));
}));
exports.deletePostById = deletePostById;
