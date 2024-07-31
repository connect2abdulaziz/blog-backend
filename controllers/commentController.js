const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const appSuccess = require("../utils/appSuccess");
const { commentSchema, updateCommentSchema} = require("../utils/validators/commentValidator");
const { addComment, getCommentsByPostId, updateComment, deleteComment } = require("../services/commentService");

//create new post
const createComment = catchAsync(async (req, res, next) => {
  const {error, value} = commentSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }
  const {id:userId}= req.user;
  const newComment = await addComment(value,userId);
  return res.status(201).json(appSuccess("Comment created successfully", newComment));
  
});




//get comments on a post
const postComments = catchAsync(async (req, res, next) => {
    const {id:postId} = req.params;
    const comments = await getCommentsByPostId(postId);
    res.status(201).json(appSuccess("Comments retrieved successfully", comments));
});




//update comment
const updateCommentById = catchAsync(async (req, res, next) => {
  const {id:commentId} = req.params;
  const {content} = req.body;
  const { error, value } = updateCommentSchema.validate({ content });
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }
  const updatedComment = await updateComment(value, commentId);
  return res.status(200).json(appSuccess("Comment updated successfully",updatedComment));
 
});

//delete comment
const deleteCommentById = catchAsync(async (req, res, next) => {
  const {id:commentId} = req.params;
  console.log(commentId);
  const deletedComment = await deleteComment(commentId);
  return res.status(200).json(appSuccess("Comment deleted successfully", deletedComment));

});

module.exports = {
  createComment,
  postComments,
  updateCommentById,
  deleteCommentById,
};
