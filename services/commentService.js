import Comment from "../db/models/comment.js";
import User from "../db/models/user.js";
import Post from "../db/models/post.js";
import AppError from "../utils/errors/appError.js";
import { ERROR_MESSAGES, STATUS_CODE } from "../utils/constants/constants.js";
import sequelize  from '../config/database.js';
import { Op } from 'sequelize';


// Add a new comment to a post
const addCommentServices = async ({ postId, parentId, content }, userId) => {
  const transaction = await sequelize.transaction();
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
    }, { transaction });

    // Fetch the user associated with the comment
    const user = await User.findByPk(userId, { transaction });
    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    await transaction.commit();
    return {
      ...newComment.toJSON(),
      user: {
        firstName: user.firstName,
        thumbnail: user.thumbnail,
      },
    };
  } catch (error) {
    await transaction.rollback();
    throw new AppError(error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODE.BAD_REQUEST);
  }
};


// Get total comment count for a post
const getTotalCommentCount = async (postId) => {
  try {
    if (!(await Post.findByPk(postId))) {
      throw new AppError(ERROR_MESSAGES.POST_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }
    const count = await Comment.count({
      where: { postId },
    });
    return count;
  } catch (error) {
    throw new AppError(error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
};


// Utility function to count all nested replies for a comment
const countNestedReplies = async (commentId) => {
  try {
    const nestedRepliesCount = await Comment.sequelize.query(`
      WITH RECURSIVE ReplyHierarchy AS (
        SELECT id, parentId
        FROM comments
        WHERE parentId = :commentId
        UNION ALL
        SELECT c.id, c.parentId
        FROM comments c
        INNER JOIN ReplyHierarchy rh ON c.parentId = rh.id
      )
      SELECT COUNT(*) as totalCount
      FROM ReplyHierarchy
    `, {
      replacements: { commentId },
      type: Comment.sequelize.QueryTypes.SELECT,
    });

    return nestedRepliesCount[0].totalCount;
  } catch (error) {
    throw new AppError(error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
};




const fetchComments = async (filter, options = {}) => {
  try {
    const { limit = 10, offset = 0, includeReplies = false } = options;

    // Fetch comments with optional replies
    const { count, rows: comments } = await Comment.findAndCountAll({
      where: filter,
      include: [
        { model: User, attributes: ["id", "firstName", "thumbnail"] },
        includeReplies && {
          model: Comment,
          attributes: ['id', 'content', 'createdAt', 'updatedAt'],
          include: [{ model: User, attributes: ["id", "firstName", "thumbnail"] }]
        }
      ].filter(Boolean),
      limit,
      offset,
      order: [['createdAt', 'ASC']],
    });

    return { count, comments };
  } catch (error) {
    throw new AppError(error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
};


const postCommentsServices = async (postId, options) => {
  try {
    // Check if the post exists
    const postExists = await Post.findByPk(postId);
    if (!postExists) {
      throw new AppError(ERROR_MESSAGES.POST_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    const filter = { postId, parentId: null };
    const { count, comments } = await fetchComments(filter, options);

    if (count === 0) return { comments: [], pagination: { limit: options.limit, offset: options.offset, totalCount: 0 } };

    // Get reply counts for parent comments
    const commentIds = comments.map(c => c.id);
    const replyCountsResult = await sequelize.query(
      `SELECT "parentId", COUNT(*) AS "repliesCount"
       FROM "comment"
       WHERE "parentId" IN (:commentIds)
       GROUP BY "parentId"`,
      { replacements: { commentIds }, type: sequelize.QueryTypes.SELECT }
    );

    const replyCountsMap = replyCountsResult.reduce((map, { parentId, repliesCount }) => {
      map[parentId] = repliesCount;
      return map;
    }, {});

    const commentsWithCounts = comments.map(c => ({
      ...c.toJSON(),
      repliesCount: replyCountsMap[c.id] || 0
    }));

    return { comments: commentsWithCounts, pagination: { limit: options.limit, offset: options.offset, totalCount: count } };
  } catch (error) {
    throw new AppError(error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
};

const getCommentRepliesServices = async (commentId, options) => {
  try {
    if (!(await Comment.findByPk(commentId))) {
      throw new AppError(ERROR_MESSAGES.COMMENT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }
    const filter = { parentId: commentId };
    const { count, comments: replies } = await fetchComments(filter, options);

    return { replies: replies.map(reply => reply.toJSON()), pagination: { limit: options.limit, offset: options.offset, totalCount: count } };
  } catch (error) {
    throw new AppError(error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR);
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
  getTotalCommentCount,
};
