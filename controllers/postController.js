const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const appSuccess = require("../utils/appSuccess");
const {
  postSchema,
  updateSchema,
} = require("../utils/validators/postValidator");

const {
  createPostServices,
  getAllPostServices,
  getPostServices,
  searchPostsServices,
  myPostsServices,
  updatePostServices,
  deletePostServices,
} = require("../services/postService");

const {
  STATUS_CODE,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} = require("../utils/constants");


// Create new post
const createPost = catchAsync(async (req, res, next) => {
  const { error, value } = postSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, STATUS_CODE.BAD_REQUEST));
  }
  const { id: userId } = req.user;
  const newPost = await createPostServices(userId, value);
  return res.status(STATUS_CODE.CREATED).json(appSuccess(SUCCESS_MESSAGES.POST_CREATED, newPost));
});


// Get all posts
const getPosts = catchAsync(async (req, res, next) => {
  const posts = await getAllPostServices();
  return res.status(STATUS_CODE.OK).json(appSuccess(SUCCESS_MESSAGES.POSTS_RETRIEVED, posts));
});


// Get post by id
const getPostById = catchAsync(async (req, res, next) => {
  const { id: postId } = req.params;
  const result = await getPostServices(postId);
  return res.status(STATUS_CODE.OK).json(appSuccess(SUCCESS_MESSAGES.POST_RETRIEVED, result));
});


// Search for posts
const searchPosts = catchAsync(async (req, res, next) => {
  const { searchTerm } = req.query;
  const posts = await searchPostsServices(searchTerm);
  return res.status(STATUS_CODE.OK).json(appSuccess(SUCCESS_MESSAGES.POSTS_RETRIEVED, posts));
});


// Get my posts
const getMyPosts = catchAsync(async (req, res, next) => {
  const { id:userId } = req.user;
  const posts = await myPostsServices(userId);
  return res.status(STATUS_CODE.OK).json(appSuccess(SUCCESS_MESSAGES.POSTS_RETRIEVED, posts));
});


// Update post
const updatePostById = catchAsync(async (req, res, next) => {
  const { error, value } = updateSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, STATUS_CODE.BAD_REQUEST));
  }
  const { id: userId } = req.user;
  const { id: postId } = req.params;
  const updatedPost = await updatePostServices(postId, userId, value);
  return res.status(STATUS_CODE.OK).json(appSuccess(SUCCESS_MESSAGES.POST_UPDATED, updatedPost));
});


// Delete post
const deletePostById = catchAsync(async (req, res, next) => {
  const { id: postId } = req.params;
  const deletedPostId = await deletePostServices({ postId });
  return res.status(STATUS_CODE.OK).json(appSuccess(SUCCESS_MESSAGES.POST_DELETED, deletedPostId));
});


module.exports = {
  createPost,
  getPosts,
  getPostById,
  searchPosts,
  getMyPosts,
  updatePostById,
  deletePostById,
};
