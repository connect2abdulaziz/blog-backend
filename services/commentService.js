const Comment = require("../db/models/comment");
const User = require("../db/models/user");
const Post = require("../db/models/post");
const AppError = require("../utils/appError");
const {ERROR_MESSAGES, STATUS_CODE} = require("../utils/constants");


// Add a new comment to a post
const addCommentServices = async ({ postId, parentId, content }, userId) => {
  try {
    // Check if parentId is provided and valid
    if (parentId && !(await Comment.findByPk(parentId))) {
      throw new AppError(ERROR_MESSAGES.INVALID_PARENT_COMMENT_ID, STATUS_CODE.BAD_REQUEST);
    }
    if (!(await Post.findByPk(postId))) {
      throw new AppError(ERROR_MESSAGES.POST_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    const newComment = await Comment.create({
      userId,
      postId,
      parentId: parentId || null,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Fetch the user associated with the comment
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    return {
      ...newComment.toJSON(),
      user: {
        firstName: user.firstName,
        thumbnail: user.thumbnail,
      },
    };
  } catch (error) {
    if (error instanceof AppError) {
        throw error;
    }
    throw new AppError(error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODE.BAD_REQUEST);
  }
};

// Get comments by post ID with hierarchical structure
const postCommentsServices = async (postId) => {
  try {
    if (!(await Post.findByPk(postId))) {
      throw new AppError(ERROR_MESSAGES.POST_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    const comments = await Comment.findAll({
      where: { postId },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "thumbnail"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    // Function to build a hierarchical structure
    const buildHierarchy = (comments) => {
      const commentMap = new Map();
      const rootComments = [];

      // Create a map of all comments by ID for quick access
      comments.forEach((comment) => {
        commentMap.set(comment.id, { ...comment.toJSON(), replies: [] });
      });

      // Build the hierarchy
      comments.forEach((comment) => {
        if (comment.parentId) {
          const parentComment = commentMap.get(comment.parentId);
          if (parentComment) {
            parentComment.replies.push(commentMap.get(comment.id));
          }
        } else {
          rootComments.push(commentMap.get(comment.id));
        }
      });

      return rootComments;
    };

    const hierarchicalComments = buildHierarchy(comments);

    return hierarchicalComments;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODE.BAD_REQUEST);
  }
};

// Update an existing comment
const updateCommentServices = async ({ content }, commentId) => {
  try {
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      throw new AppError(ERROR_MESSAGES.COMMENT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    await comment.update({
      content,
      updatedAt: new Date(),
    });
    return comment;
  } catch (error) {
    if(error instanceof AppError) {
        throw error;
    }
    throw new AppError(error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODE.BAD_REQUEST);
  }
};


// Function to get all replies on a comment
const getCommentRepliesServices = async (commentId) => {
    try {
      console.log(commentId);
      if (!(await Comment.findByPk(commentId))) {
        throw new AppError(ERROR_MESSAGES.COMMENT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
      }
      const replies = await Comment.findAll({
        where: {
          parentId: commentId
        }
      });
      return replies;
    } catch (error) {
      if(error instanceof AppError){
        throw error;
      }
      throw new AppError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
  };

// Delete a comment
const deleteCommentServices = async (commentId) => {
  try {
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      throw new AppError(ERROR_MESSAGES.COMMENT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }
    await comment.destroy();
    return commentId;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODE.BAD_REQUEST);
  }
};



module.exports = {
  addCommentServices,
  postCommentsServices,
  updateCommentServices,
  deleteCommentServices,
  getCommentRepliesServices,
};
