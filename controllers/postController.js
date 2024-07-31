const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const appSuccess = require("../utils/appSuccess");
const {
  postSchema,
  updateSchema,
} = require("../utils/validators/postValidator");
const {
  createPost: createNewPost,
  getAllPost,
  getPostDetails,
  searchPostsByTitleOrTag,
  getAllMyPosts,
  updatePost,
  deletePost,
} = require("../services/postService");


// Create new post
const createPost = catchAsync(async (req, res, next) => {
  const { error, value } = postSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }
  const { categoryId, title, content, readTime, image, thumbnail } = value;
  const { id: userId } = req.user;
  // Create new post using PostService
  const newPost = await createNewPost({ userId,categoryId,title,content,readTime,image,thumbnail,});
  return res.status(201).json(appSuccess("Post created successfully", newPost));
});


//get all posts
const getPosts = catchAsync(async (req, res, next) => {
  const posts = await getAllPost();
  return res.status(200).json(appSuccess("Posts retrieved successfully", posts));
});

// get post by id
const getPostById = catchAsync(async (req, res, next) => {
  const { id: postId } = req.params;
  const result = await getPostDetails(postId);
  return res.status(200).json(appSuccess("Post retrieved successfully", result));
});

//search for posts
const searchPosts = catchAsync(async (req, res, next) => {
  const { searchTerm } = req.query;
  const posts = await searchPostsByTitleOrTag(searchTerm);
  return res.status(200).json(appSuccess("Posts retrieved successfully", posts));
});

//get my posts
const getMyPosts = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const posts = await getAllMyPosts(userId);
  return res.status(200).json(appSuccess("Posts retrieved successfully", posts));
});

//update post
const updatePostById = catchAsync(async (req, res, next) => {
  const { error, value } = updateSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }
  const { categoryId, title, content, readTime, image, thumbnail } = value;
  const { id: userId } = req.user;
  const { id: postId } = req.params;
  const updatedPost = await updatePost({ postId,userId,categoryId,title,content,readTime,image,thumbnail,});
  return res.status(200).json(appSuccess("Post updated successfully", updatedPost));
});

//delete post
const deletePostById = catchAsync(async (req, res, next) => {
  const { id: postId } = req.params;
  const deletedPostId = await deletePost({ postId });
  return res.json(appSuccess("Post deleted successfully", deletedPostId));
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
