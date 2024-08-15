import Comment from "../db/models/comment.js";
import User from "../db/models/user.js";
import Post from "../db/models/post.js";
import AppError from "../utils/errors/appError.js";
import { ERROR_MESSAGES, STATUS_CODE } from "../utils/constants/constants.js";
import paginate from "../utils/pagination.js";


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
    throw new AppError(error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODE.BAD_REQUEST);
  }
};

// Get comments by post ID with hierarchical structure and pagination
const postCommentsServices = async (postId, queryOptions) => {
  try {
    if (!(await Post.findByPk(postId))) {
      throw new AppError(ERROR_MESSAGES.POST_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    const { data: comments, pagination } = await paginate(Comment, {
      where: { postId },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "thumbnail"],
        },
      ],
      order: [["createdAt", "ASC"]],
      ...queryOptions,
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

    // Return hierarchical comments with pagination metadata
    return {
      comments: hierarchicalComments,
      pagination,
    };
  } catch (error) {
    throw new AppError(error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODE.BAD_REQUEST);
  }
};

// Update an existing comment
const updateCommentServices = async ({ content }, { commentId, userId }) => {
  try {
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      throw new AppError(ERROR_MESSAGES.COMMENT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }
    if (comment.userId !== userId) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, STATUS_CODE.UNAUTHORIZED);
    }
    await comment.update({
      content,
      updatedAt: new Date(),
    });
    return comment;
  } catch (error) {
    throw new AppError(error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODE.BAD_REQUEST);
  }
};

// Function to get all replies on a comment with pagination
const getCommentRepliesServices = async (commentId, queryOptions) => {
  try {
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      throw new AppError(ERROR_MESSAGES.COMMENT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    const { data: replies, pagination } = await paginate(Comment, {
      where: { parentId: commentId },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "thumbnail"],
        },
      ],
      order: [["createdAt", "ASC"]],
      ...queryOptions,
    });

    // Return replies with pagination metadata
    return {
      replies,
      pagination,
    };
  } catch (error) {
    throw new AppError(error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODE.BAD_REQUEST);
  }
};

// Delete a comment
const deleteCommentServices = async ({ commentId, userId }) => {
  try {
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      throw new AppError(ERROR_MESSAGES.COMMENT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }
    if (comment.userId !== userId) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, STATUS_CODE.UNAUTHORIZED);
    }
    await comment.destroy();
    return commentId;
  } catch (error) {
    throw new AppError(error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODE.BAD_REQUEST);
  }
};

export {
  addCommentServices,
  postCommentsServices,
  updateCommentServices,
  deleteCommentServices,
  getCommentRepliesServices,
};
