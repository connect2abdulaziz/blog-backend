const catchAsync = require("../utils/errors/catchAsync");
const AppError = require("../utils/errors/appError");
const appSuccess = require("../utils/errors/appSuccess");
const {
  commentSchema,
  updateCommentSchema,
} = require("../utils/validations/commentValidator");
const {
  addCommentServices,
  postCommentsServices,
  updateCommentServices,
  getCommentRepliesServices,
  deleteCommentServices,
} = require("../services/commentService");

const { STATUS_CODE, SUCCESS_MESSAGES } = require("../utils/constants/constants");

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

// Get replies on a comment 
const getCommentReplies = catchAsync(async (req, res, next) => {
  const {id:commentId} = req.params;
  const replies = await getCommentRepliesServices(commentId);
  return res.status(STATUS_CODE.OK).json(appSuccess(SUCCESS_MESSAGES.REPLIES_RETRIEVED, replies));
});

// Update comment
const updateCommentById = catchAsync(async (req, res, next) => {
  const { id: commentId } = req.params;
  const { id: userId } = req.user;
  const { content } = req.body;
  const { error, value } = updateCommentSchema.validate({ content });
  if (error) {
    return next(new AppError(error.details[0].message, STATUS_CODE.BAD_REQUEST));
  }
  const updatedComment = await updateCommentServices(value, commentId, userId);
  return res.status(STATUS_CODE.OK).json(appSuccess(SUCCESS_MESSAGES.COMMENT_UPDATED, updatedComment));
});

// Delete comment
const deleteCommentById = catchAsync(async (req, res, next) => {
  const { id: commentId } = req.params;
  const { id: userId } = req.user;
  const deletedComment = await deleteCommentServices({commentId, userId});
  return res.status(STATUS_CODE.OK).json(appSuccess(SUCCESS_MESSAGES.COMMENT_DELETED, deletedComment));
});

module.exports = {
  createComment,
  postComments,
  updateCommentById,
  getCommentReplies,
  deleteCommentById,
};
