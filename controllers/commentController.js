// const catchAsync = require("../utils/catchAsync");
// const user = require("../db/models/user");
// const comment = require("../db/models/comment");
// const AppError = require("../utils/appError");
// const appSuccess = require("../utils/appSuccess");

// //create new post
// const createComment = catchAsync(async (req, res, next) => {
//   const body = req.body;
//   const uId = req.user.id;

//   const newComment = await comment.create({
//     title: body.title,
//     body: body.body,
//     userId: uId,
//     postId: body.postId,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   });

//   return res.status(201).json({
//     status: "success",
//     message: "Comment created successfully",
//     data: newComment,
//   });
// });

// //get all comments
// const getComments = catchAsync(async (req, res, next) => {
//   const comments = await comment.findAll({
//     include: user,
//     order: [["createdAt", "DESC"]],
//   });
//   if (!comments) {
//     return next(new AppError("No comments found", 404));
//   }

//   return res.status(200).json(appSuccess("Comments retrieved successfully", comments));

// });

// // get comment by id
// const getCommentById = catchAsync(async (req, res, next) => {
//   const commentId = req.params.id;
//   const result = await comment.findByPk(commentId, {
//     include: user,
//   });

//   if (!result) {
//     return next(new AppError("Invalid comment id", 400));
//   }

//   return res.status(200).json(appSuccess("Comment retrieved successfully", result));
// });

// //update comment
// const updateCommentById = catchAsync(async (req, res, next) => {
//   const userId = req.user.id;
//   const commentId = req.params.id;
//   const body = req.body;

//   const result = await comment.findOne({
//     where: {
//       id: commentId,
//       userId,
//     },
//   });
//   if (!result) {
//     return next(
//       new AppError("Invalid comment id or user not authorized to update", 400)
//     );
//   }

//   result.title = body.title;
//   result.body = body.body;
//   const updatedComment = await result.save();

//   return res.status(200).json(appSuccess("Comment updated successfully",updatedComment));
 
// });

// //delete comment
// const deleteCommentById = catchAsync(async (req, res, next) => {
//   const uId = req.user.id;
//   const commentId = req.params.id;
//   console.log("User Id: " + uId);
//   const result = await comment.findOne({
//     where: {
//       id: commentId,
//       userId: uId,
//     },
//   });

//   if (!result) {
//     return next(
//       new AppError("Invalid comment id or user not authorized to delete", 400)
//     );
//   }

//   await result.destroy();

//   return res.json(appSuccess("Comment deleted successfully", commentId));
  
// });

// module.exports = {
//   createComment,
//   getComments,
//   getCommentById,
//   updateCommentById,
//   deleteCommentById,
// };
