import Comment from "../db/models/comment.model";
import User from "../db/models/user.model";
import Post from "../db/models/post.model";
import { AppError } from "../utils/errors/appError";
import { ERROR_MESSAGES, STATUS_CODE } from "../utils/constants/constants";
import { QueryTypes } from "sequelize";
import paginate from "../utils/pagination";
import {
  PaginatedResponse,
  PaginationOptions,
  CommentRequest,
  CommentResponse,
} from "../types/app.interfaces";
import { CommentAttributes } from "../types/model.Interfaces";

// Add a new comment to a post
export const addCommentServices = async (
  { postId, parentId, content }: CommentAttributes,
  userId: number
): Promise<CommentResponse> => {
  try {
    if (parentId && !(await Comment.findByPk(parentId))) {
      throw new AppError(
        ERROR_MESSAGES.INVALID_PARENT_COMMENT_ID,
        STATUS_CODE.BAD_REQUEST
      );
    }

    const post = await Post.findByPk(postId);
    if (!post)
      throw new AppError(ERROR_MESSAGES.POST_NOT_FOUND, STATUS_CODE.NOT_FOUND);

    const newComment: CommentResponse = await Comment.create({
      userId,
      postId,
      parentId,
      content,
    });
    return newComment;
  } catch (error) {
    throw error;
  }
};

// Count nested replies
const countNestedReplies = async (
  commentId: number,
  maxDepth = 2
): Promise<number> => {
  try {
    if (!Comment.sequelize) {
      throw new AppError(
        "Sequelize instance is not defined",
        STATUS_CODE.INTERNAL_SERVER_ERROR
      );
    }

    const query = `
      WITH RECURSIVE ReplyHierarchy AS (
        SELECT id, "parentId", 1 AS level
        FROM comment
        WHERE "parentId" = :commentId
        
        UNION ALL
        
        SELECT c.id, c."parentId", rh.level + 1
        FROM comment c
        INNER JOIN ReplyHierarchy rh ON c."parentId" = rh.id
        WHERE rh.level < :maxDepth
      )
      SELECT COUNT(*) AS "totalCount"
      FROM ReplyHierarchy
    `;

    const results = (await Comment.sequelize.query(query, {
      replacements: { commentId, maxDepth },
      type: QueryTypes.SELECT,
    })) as [{ totalCount: string }];
    const totalCount =
      results.length > 0 ? parseInt(results[0].totalCount, 10) : 0;
    return totalCount;
  } catch (error) {
    throw error;
  }
};

// Get comments for a post
export const postCommentsServices = async (
  postId: number,
  options: PaginationOptions
): Promise<PaginatedResponse<CommentResponse>> => {
  try {
    const postExists = await Post.findByPk(postId);
    if (!postExists) {
      throw new AppError(ERROR_MESSAGES.POST_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    const filter = {
      where: { postId, parentId: null },
      include: [
        { model: User, attributes: ["firstName", "lastName", "thumbnail"] },
      ],
    };

    const result = await paginate(options.page, options.limit, filter, Comment);
    if (result.pagination.totalCount === 0)
      return {
        data: [],
        pagination: result.pagination,
      };
    const comments = result.data as Comment[];
    const commentIds = comments.map((c: Comment) => c.id);
    const replyCountsResult = await Promise.all(
      commentIds.map(async (id: number) => ({
        commentId: id,
        repliesCount: await countNestedReplies(id),
      }))
    );

    const replyCountsMap = replyCountsResult.reduce(
      (map, { commentId, repliesCount }) => {
        map[commentId] = repliesCount;
        return map;
      },
      {} as Record<number, number>
    );

    const commentsWithCounts: CommentResponse[] = comments.map(
      (c: Comment) => ({
        ...c.toJSON(),
        repliesCount: replyCountsMap[c.id] || 0,
      })
    );

    return {
      data: commentsWithCounts,
      pagination: result.pagination,
    };
  } catch (error) {
    throw error;
  }
};

// Get replies to a comment
export const getCommentRepliesServices = async (
  commentId: number,
  options: PaginationOptions
): Promise<PaginatedResponse<CommentResponse>> => {
  try {
    if (!(await Comment.findByPk(commentId))) {
      throw new AppError(
        ERROR_MESSAGES.COMMENT_NOT_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }

    const filter = {
      where: { parentId: commentId },
      include: [
        { model: User, attributes: ["firstName", "lastName", "thumbnail"] },
      ],
    };

    const result = await paginate(options.page, options.limit, filter, Comment);
    if (result.pagination.totalCount === 0)
      return {
        data: [],
        pagination: result.pagination,
      };
    const replies = result.data;
    const replyIds = replies.map((r: Comment) => r.id);
    const repliesCounts = await Promise.all(
      replyIds.map(async (id: number) => ({
        replyId: id,
        repliesCount: await countNestedReplies(id),
      }))
    );

    const nestedRepliesMap = repliesCounts.reduce(
      (map, { replyId, repliesCount }) => {
        map[replyId] = repliesCount;
        return map;
      },
      {} as Record<number, number>
    );

    const repliesWithCounts: CommentResponse[] = replies.map((r: Comment) => ({
      ...r.toJSON(),
      repliesCount: nestedRepliesMap[r.id] || 0,
    }));

    return {
      data: repliesWithCounts,
      pagination: result.pagination,
    };
  } catch (error) {
    throw error;
  }
};

// Update a comment
export const updateCommentServices = async (
  { content }: CommentRequest,
  { commentId, userId }: { commentId: number; userId: number }
): Promise<CommentResponse> => {
  try {
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      throw new AppError(
        ERROR_MESSAGES.COMMENT_NOT_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }
    if (comment.userId !== userId) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, STATUS_CODE.UNAUTHORIZED);
    }
    await comment.update({
      content,
      updatedAt: new Date(),
    });
    return comment as unknown as CommentResponse;
  } catch (error) {
    throw error;
  }
};

// Delete a comment
export const deleteCommentServices = async ({
  commentId,
  userId,
}: CommentRequest): Promise<CommentResponse> => {
  try {
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      throw new AppError(
        ERROR_MESSAGES.COMMENT_NOT_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }
    if (comment.userId !== userId) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, STATUS_CODE.UNAUTHORIZED);
    }
    await Comment.destroy({ where: { id: commentId } });
    return comment as unknown as CommentResponse;
  } catch (error) {
    throw error;
  }
};
