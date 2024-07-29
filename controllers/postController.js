// const catchAsync = require("../utils/catchAsync");
// const post = require("../db/models/post");
// const user = require("../db/models/user");
// const AppError = require("../utils/appError");
// const appSuccess = require("../utils/appSuccess");
// const { validatePost } = require('../utils/validators/postValidator');
// const PostService = require('../services/postService'); 


// // Create new post
// const createPost = catchAsync(async (req, res, next) => {
//   // Extract title and body from the request body
//   const { title, body } = req.body;
//   const { id: userId } = req.user;

//   // Validate title, body, and userId
//   const { error } = validatePost({ title, body, userId });
//   if (error) {
//     return next(new AppError(error.details[0].message, 400)); // Pass validation error
//   }

//   // Create new post using PostService
//   const newPost = await PostService.createPost(userId, title, body);
  
//   if (!newPost) {
//     return next(new AppError("Failed to create post", 500)); // Provide a status code for server errors
//   }

//   // Return success response
//   return res.status(201).json(appSuccess("Post created successfully", newPost));
// });



// //get all posts
// const getPosts = catchAsync(async (req, res, next) => {
//   const posts = await post.findAll({
//     include: user,
//     order: [["createdAt", "DESC"]],
//   });
//   console.log(posts);
//   if (!posts) {
//     return next(new AppError("No posts found", 404));
//   }

//   return res.status(200).json(appSuccess("Posts retrieved successfully", posts));

// });

// // get post by id
// const getPostById = catchAsync(async (req, res, next) => {
//   const postId = req.params.id;
//   const result = await post.findByPk(postId, {
//     include: user,
//   });

//   if (!result) {
//     return next(new AppError("Invalid post id", 400));
//   }

//   return res.status(200).json({
//     status: "success",
//     message: "Post retrieved successfully",
//     data: result,
//   });
// });

// //update post
// const updatePostById = catchAsync(async (req, res, next) => {
//   const userId = req.user.id;
//   const postId = req.params.id;
//   const body = req.body;

//   const result = await post.findOne({
//     where: {
//       id: postId,
//       userId,
//     },
//   });
//   if (!result) {
//     return next(
//       new AppError("Invalid post id or user not authorized to update", 400)
//     );
//   }

//   result.title = body.title;
//   result.body = body.body;
//   const updatedPost = await result.save();

//   return res.status(200).json(appSuccess("Post updated successfully", updatedPost));

// });

// //delete post
// const deletePostById = catchAsync(async (req, res, next) => {
//   const userId = req.user.id;
//   const postId = req.params.id;

//   const result = await post.findOne({
//     where: {
//       id: postId,
//       userId,
//     },
//   });
//   if (!result) {
//     return next(
//       new AppError("Invalid post id or user not authorized to delete", 400)
//     );
//   }

//   await result.destroy();
//   return res.json(appSuccess("Post deleted successfully", postId));
// });

// module.exports = {
//   createPost,
//   getPosts,
//   getPostById,
//   updatePostById,
//   deletePostById,
// };
