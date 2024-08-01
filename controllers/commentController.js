const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const appSuccess = require("../utils/appSuccess");
const {
  commentSchema,
  updateCommentSchema,
} = require("../utils/validators/commentValidator");
const {
  addCommentServices,
  postCommentsServices,
  updateCommentServices,
  deleteCommentServices,
} = require("../services/commentService");

const { STATUS_CODE, SUCCESS_MESSAGES } = require("../utils/constants");

// Create new comment
const createComment = catchAsync(async (req, res, next) => {
  const { error, value } = commentSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, STATUS_CODE.BAD_REQUEST));
  }
  const { id: userId } = req.user;
  const newComment = await addCommentServices(value, userId);
  return res.status(STATUS_CODE.CREATED).json(appSuccess(SUCCESS_MESSAGES.COMMENT_CREATED, newComment));
});

// Get comments on a post
const postComments = catchAsync(async (req, res, next) => {
  const { id: postId } = req.params;
  const comments = await postCommentsServices(postId);
  return res.status(STATUS_CODE.OK).json(appSuccess(SUCCESS_MESSAGES.COMMENTS_RETRIEVED, comments));
});

// Update comment
const updateCommentById = catchAsync(async (req, res, next) => {
  const { id: commentId } = req.params;
  const { content } = req.body;
  const { error, value } = updateCommentSchema.validate({ content });
  if (error) {
    return next(new AppError(error.details[0].message, STATUS_CODE.BAD_REQUEST));
  }
  const updatedComment = await updateCommentServices(value, commentId);
  return res.status(STATUS_CODE.OK).json(appSuccess(SUCCESS_MESSAGES.COMMENT_UPDATED, updatedComment));
});

// Delete comment
const deleteCommentById = catchAsync(async (req, res, next) => {
  const { id: commentId } = req.params;
  const deletedComment = await deleteCommentServices(commentId);
  return res.status(STATUS_CODE.OK).json(appSuccess(SUCCESS_MESSAGES.COMMENT_DELETED, deletedComment));
});

module.exports = {
  createComment,
  postComments,
  updateCommentById,
  deleteCommentById,
};
