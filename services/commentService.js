import Comment from "../db/models/comment.js";
import User from "../db/models/user.js";
import Post from "../db/models/post.js";
import AppError from "../utils/errors/appError.js";
import { ERROR_MESSAGES, STATUS_CODE } from "../utils/constants/constants.js";
import sequelize  from '../config/database.js';
import paginate from '../utils/pagination.js';


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



const countNestedReplies = async (commentId, maxDepth = 2) => {
  try {
    // Create the recursive CTE query with dynamic depth
    let query = `
      WITH RECURSIVE ReplyHierarchy AS (
        -- Base case: immediate replies (Level 1)
        SELECT id, "parentId", 1 AS level
        FROM comment
        WHERE "parentId" = :commentId
        
        UNION ALL
        
        -- Recursive case: replies to previous level replies
        SELECT c.id, c."parentId", rh.level + 1
        FROM comment c
        INNER JOIN ReplyHierarchy rh ON c."parentId" = rh.id
        WHERE rh.level < :maxDepth
      )
      SELECT COUNT(*) AS "totalCount"
      FROM ReplyHierarchy
    `;
    
    // Execute the query with dynamic parameters
    const nestedRepliesCount = await Comment.sequelize.query(query, {
      replacements: { commentId, maxDepth },
      type: Comment.sequelize.QueryTypes.SELECT,
    });
    // Extract and return the total count
    const { totalCount } = nestedRepliesCount[0];
    return parseInt(totalCount, 10);
  } catch (error) {
    console.error(`Error counting nested replies for commentId ${commentId}:`, error);
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
    console.log(options)
    // Define filter for parent comments
    const filter = { where: { postId, parentId: null }, include: [{ model: User, attributes: ['firstName', 'lastName', 'thumbnail'] }] };

    // Use the paginate function
    const { data: comments, totalItems: count } = await paginate(options.page, options.limit, filter, Comment);

    if (count === 0) return { comments: [], pagination: { limit: options.limit, offset: options.offset, totalCount: 0 } };

    // Get reply counts for parent comments
    const commentIds = comments.map(c => c.id);
    const replyCountsResult = await Promise.all(commentIds.map(async id => ({
      commentId: id,
      repliesCount: await countNestedReplies(id)
    })));

    // Map reply counts to comments
    const replyCountsMap = replyCountsResult.reduce((map, { commentId, repliesCount }) => {
      map[commentId] = repliesCount;
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
    // Check if the comment exists
    if (!(await Comment.findByPk(commentId))) {
      throw new AppError(ERROR_MESSAGES.COMMENT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    // Define filter for replies
    const filter = { where: { parentId: commentId }, include: [{ model: User, attributes: ['firstName', 'lastName', 'thumbnail'] }] };

    // Use the paginate function
    const { data: replies, totalItems: count } = await paginate(options.page, options.limit, filter, Comment);

    // Get nested replies count for each reply
    const replyIds = replies.map(r => r.id);
    const nestedRepliesCounts = await Promise.all(replyIds.map(async id => ({
      replyId: id,
      nestedRepliesCount: await countNestedReplies(id)
    })));

    // Map nested replies counts to replies
    const nestedRepliesMap = nestedRepliesCounts.reduce((map, { replyId, nestedRepliesCount }) => {
      map[replyId] = nestedRepliesCount;
      return map;
    }, {});

    const repliesWithCounts = replies.map(r => ({
      ...r.toJSON(),
      nestedRepliesCount: nestedRepliesMap[r.id] || 0
    }));

    return { replies: repliesWithCounts, pagination: { limit: options.limit, page: options.page, totalCount: count } };
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
