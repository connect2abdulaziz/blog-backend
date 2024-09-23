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
exports.deletePostServices = exports.updatePostServices = exports.myPostsServices = exports.getPostServices = exports.getAllPostServices = exports.createPostServices = void 0;
const sequelize_1 = require("sequelize");
const appError_1 = require("../utils/errors/appError");
const post_model_1 = __importDefault(require("../db/models/post.model"));
const user_model_1 = __importDefault(require("../db/models/user.model"));
const category_model_1 = __importDefault(require("../db/models/category.model"));
const constants_1 = require("../utils/constants/constants");
const pagination_1 = __importDefault(require("../utils/pagination"));
const cloudinary_1 = require("../utils/cloudinary");
// Create a new post
const createPostServices = (userId, postData, file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let imageUrl = null;
        let thumbnailUrl = null;
        if (file && file.path) {
            // Upload the image to Cloudinary
            imageUrl = yield (0, cloudinary_1.uploadImageToCloudinary)(file.path);
            // Extract the public ID from the image URL
            const publicId = imageUrl.split("/").slice(-2).join("/").split(".")[0];
            // Generate the thumbnail URL
            thumbnailUrl = (0, cloudinary_1.generateThumbnailUrl)(publicId);
        }
        // Create the new post with or without the image and thumbnail
        const newPost = yield post_model_1.default.create({
            userId,
            categoryId: postData.categoryId,
            title: postData.title,
            content: postData.content,
            readTime: postData.readTime,
            image: imageUrl || null,
            thumbnail: thumbnailUrl || null,
        });
        return newPost;
    }
    catch (error) {
        throw error;
    }
});
exports.createPostServices = createPostServices;
// Get all posts with optional search and user filter
const getAllPostServices = (_a) => __awaiter(void 0, [_a], void 0, function* ({ searchBy, page = 1, limit = 10, userId, }) {
    try {
        console.log("Getting all posts", searchBy, userId, page, limit);
        // Define the base query options
        const queryOptions = {
            order: [["createdAt", "DESC"]], // Index on `createdAt` can optimize ordering
            include: [
                {
                    model: user_model_1.default,
                    as: "User",
                    attributes: ["id", "firstName", "lastName", "thumbnail"],
                },
                {
                    model: category_model_1.default,
                    as: "Category",
                    attributes: ["id", "tag"],
                },
            ],
            where: {},
        };
        console.log(queryOptions);
        // Apply filters if provided
        if (userId) {
            queryOptions.where.userId = userId; // Leverages index on `userId`
        }
        if (searchBy) {
            queryOptions.where[sequelize_1.Op.or] = [
                { title: { [sequelize_1.Op.iLike]: `%${searchBy}%` } }, // Leverages index on `title`
                { "$Category.tag$": { [sequelize_1.Op.iLike]: `%${searchBy}%` } },
            ];
        }
        // Use pagination utility function
        const paginatedPosts = yield (0, pagination_1.default)(page, limit, queryOptions, post_model_1.default);
        return paginatedPosts;
    }
    catch (error) {
        throw error;
    }
});
exports.getAllPostServices = getAllPostServices;
// Get details of a specific post by postId
const getPostServices = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Getting post", postId);
        const post = yield post_model_1.default.findByPk(postId, {
            include: [
                {
                    model: user_model_1.default,
                    as: "User",
                    attributes: ["id", "firstName", "lastName", "thumbnail"],
                },
                {
                    model: category_model_1.default,
                    as: "Category",
                    attributes: ["id", "tag"],
                },
            ],
        });
        if (!post) {
            throw new appError_1.AppError(constants_1.ERROR_MESSAGES.POST_NOT_FOUND, constants_1.STATUS_CODE.NOT_FOUND);
        }
        return post;
    }
    catch (error) {
        throw error;
    }
});
exports.getPostServices = getPostServices;
// Get all posts created by a specific user
const myPostsServices = (userId_1, _a) => __awaiter(void 0, [userId_1, _a], void 0, function* (userId, { page = 1, limit = 10 }) {
    try {
        console.log("Getting posts by user", userId);
        // Define the base query options
        const queryOptions = {
            where: { userId }, // Leverages index on `userId`
            include: [
                {
                    model: user_model_1.default,
                    as: "User",
                    attributes: ["id", "firstName", "lastName", "email"],
                },
                {
                    model: category_model_1.default,
                    as: "Category",
                    attributes: ["id", "tag"],
                },
            ],
            order: [["createdAt", "DESC"]], // Index on `createdAt` can optimize ordering
        };
        // Use pagination utility function
        const paginatedPosts = yield (0, pagination_1.default)(page, limit, queryOptions, post_model_1.default);
        return paginatedPosts;
    }
    catch (error) {
        throw error;
    }
});
exports.myPostsServices = myPostsServices;
// Update a post
const updatePostServices = (postId, userId, postData, file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch the existing post
        const existingPost = yield post_model_1.default.findByPk(postId);
        if (!existingPost) {
            throw new appError_1.AppError(constants_1.ERROR_MESSAGES.POST_NOT_FOUND, constants_1.STATUS_CODE.NOT_FOUND);
        }
        if (existingPost.userId !== userId) {
            throw new appError_1.AppError(constants_1.ERROR_MESSAGES.UNAUTHORIZED, constants_1.STATUS_CODE.UNAUTHORIZED);
        }
        let imageUrl = existingPost.image;
        let thumbnailUrl = existingPost.thumbnail;
        if (file && file.path) {
            // Delete the old image from Cloudinary
            if (existingPost.image) {
                const publicId = existingPost.image
                    .split("/")
                    .slice(-2)
                    .join("/")
                    .split(".")[0];
                yield (0, cloudinary_1.deleteImageFromCloudinary)(publicId);
            }
            // Upload the new image to Cloudinary
            imageUrl = yield (0, cloudinary_1.uploadImageToCloudinary)(file.path);
            // Extract the public ID from the image URL
            const newPublicId = imageUrl.split("/").slice(-2).join("/").split(".")[0];
            // Generate the new thumbnail URL
            thumbnailUrl = (0, cloudinary_1.generateThumbnailUrl)(newPublicId);
        }
        // Update the post with the new data
        yield existingPost.update({
            categoryId: postData.categoryId || existingPost.categoryId,
            title: postData.title || existingPost.title,
            content: postData.content || existingPost.content,
            readTime: postData.readTime || existingPost.readTime,
            image: imageUrl,
            thumbnail: thumbnailUrl,
        });
        return existingPost;
    }
    catch (error) {
        throw error;
    }
});
exports.updatePostServices = updatePostServices;
// Delete a post
const deletePostServices = (_a) => __awaiter(void 0, [_a], void 0, function* ({ postId, userId, }) {
    try {
        const post = yield post_model_1.default.findByPk(postId);
        if (!post) {
            throw new appError_1.AppError(constants_1.ERROR_MESSAGES.POST_NOT_FOUND, constants_1.STATUS_CODE.NOT_FOUND);
        }
        if (post.userId !== userId) {
            throw new appError_1.AppError(constants_1.ERROR_MESSAGES.UNAUTHORIZED, constants_1.STATUS_CODE.UNAUTHORIZED);
        }
        if (post.image) {
            const publicId = post.image.split("/").slice(-2).join("/").split(".")[0];
            yield (0, cloudinary_1.deleteImageFromCloudinary)(publicId);
        }
        yield post_model_1.default.destroy({ where: { id: postId, userId } });
        return post;
    }
    catch (error) {
        throw error;
    }
});
exports.deletePostServices = deletePostServices;
//# sourceMappingURL=post.service.js.map