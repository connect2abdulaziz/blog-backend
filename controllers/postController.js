import catchAsync from '../utils/errors/catchAsync.js';
import AppError from '../utils/errors/appError.js';
import appSuccess from '../utils/errors/appSuccess.js';
import {
  postSchema,
  updateSchema,
  querySchema,
} from '../utils/validations/postValidator.js';
import {
  createPostServices,
  getAllPostServices,
  getPostServices,
  updatePostServices,
  deletePostServices,
} from '../services/postService.js';
import {
  STATUS_CODE,
  SUCCESS_MESSAGES,
} from '../utils/constants/constants.js';


// Create new post
const createPost = catchAsync(async (req, res, next) => {
  const { error, value } = postSchema.validate(req.body);
  if (error) {
    return next(
      new AppError(error.details[0].message, STATUS_CODE.BAD_REQUEST)
    );
  }
  const { id: userId } = req.user;
  const newPost = await createPostServices(userId, value);
  return res
    .status(STATUS_CODE.CREATED)
    .json(appSuccess(SUCCESS_MESSAGES.POST_CREATED, newPost));
});

// Get all posts
const getPosts = catchAsync(async (req, res, next) => {
  const { error, value } = querySchema.validate(req.query);
  if (error) return next(new AppError(error.details[0].message, STATUS_CODE.BAD_REQUEST));
  const { searchBy, page = 1, limit = 10 } = value;
  const userId = req.user?.id || null;
  const posts = await getAllPostServices({ searchBy, page, limit, userId});
  res.status(STATUS_CODE.OK).json(appSuccess(SUCCESS_MESSAGES.POSTS_RETRIEVED, posts));
});


// Get post by id
const getPostById = catchAsync(async (req, res, next) => {
  const { id: postId } = req.params;
  const result = await getPostServices(postId);
  return res
    .status(STATUS_CODE.OK)
    .json(appSuccess(SUCCESS_MESSAGES.POST_RETRIEVED, result));
});




// Update post
const updatePostById = catchAsync(async (req, res, next) => {
  const { error, value } = updateSchema.validate(req.body);
  if (error) {
    return next(
      new AppError(error.details[0].message, STATUS_CODE.BAD_REQUEST)
    );
  }
  const { id: userId } = req.user;
  const { id: postId } = req.params;
  const updatedPost = await updatePostServices(postId, userId, value);
  return res
    .status(STATUS_CODE.OK)
    .json(appSuccess(SUCCESS_MESSAGES.POST_UPDATED, updatedPost));
});

// Delete post
const deletePostById = catchAsync(async (req, res, next) => {
  const { id: postId } = req.params;
  const { id: userId } = req.user;
  const deletedPostId = await deletePostServices({ postId, userId });
  return res
    .status(STATUS_CODE.OK)
    .json(appSuccess(SUCCESS_MESSAGES.POST_DELETED, deletedPostId));
});

export {
  createPost,
  getPosts,
  getPostById,
  updatePostById,
  deletePostById,
};
