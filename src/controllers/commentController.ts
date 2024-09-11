import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/errors/catchAsync";
import AppError from "../utils/errors/appError";
import appSuccess from "../utils/errors/appSuccess";
import {
  commentSchema,
  updateCommentSchema,
  queryCommentSchema,
  queryRepliesSchema,
} from "../utils/validations/commentValidator";
import {
  addCommentServices,
  postCommentsServices,
  updateCommentServices,
  getCommentRepliesServices,
  deleteCommentServices,
} from "../services/commentService";
import { STATUS_CODE, SUCCESS_MESSAGES } from "../utils/constants/constants";
import {
  PaginationOptions,
  SuccessResponse,
  CommentRequest,
  AuthRequest,
  CommentResponse,
} from "../services/interfaces";
import { CommentAttributes } from "../db/models/modelInterfaces";

// Create new comment
const createComment = catchAsync(
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response<SuccessResponse<CommentResponse>>> => {
    const { error, value } = commentSchema.validate(req.body);
    if (error) {
      throw new AppError(error.details[0].message, STATUS_CODE.BAD_REQUEST);
    }

    const commentData = value as CommentAttributes;
    const userId: number = req.userId!;
    const newComment = await addCommentServices(commentData, userId);
    return res
      .status(STATUS_CODE.CREATED)
      .json(appSuccess(SUCCESS_MESSAGES.COMMENT_CREATED, newComment));
  }
);

// Get comments on a post
const postComments = catchAsync(
  async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<Response<SuccessResponse<CommentResponse>>> => {
    const { id: postId } = req.params;
    const { error, value } = queryCommentSchema.validate(req.query, {
      allowUnknown: true,
    });
    if (error) {
      throw new AppError(error.details[0].message, STATUS_CODE.BAD_REQUEST);
    }
    const { limit = 10, page = 1 } = value as PaginationOptions;
    const comments = await postCommentsServices(Number(postId), {
      limit,
      page,
    });
    return res
      .status(STATUS_CODE.OK)
      .json(appSuccess(SUCCESS_MESSAGES.COMMENTS_RETRIEVED, comments));
  }
);

// Get replies on a comment
const getCommentReplies = catchAsync(
  async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<Response<SuccessResponse<CommentResponse>>> => {
    const { id: commentId } = req.params;
    const { error, value } = queryRepliesSchema.validate(req.query, {
      allowUnknown: true,
    });
    if (error) {
      throw next(
        new AppError(error.details[0].message, STATUS_CODE.BAD_REQUEST)
      );
    }
    const { limit = 10, page = 1 } = value as PaginationOptions;
    const replies = await getCommentRepliesServices(Number(commentId), {
      limit,
      page,
    });
    return res
      .status(STATUS_CODE.OK)
      .json(appSuccess(SUCCESS_MESSAGES.REPLIES_RETRIEVED, replies));
  }
);

// Update comment
const updateCommentById = catchAsync(
  async (
    req: AuthRequest & Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<Response<SuccessResponse<CommentResponse>>> => {
    const { id: commentId } = req.params;
    const userId: number = req.userId!;
    const { content } = req.body;
    const { error, value } = updateCommentSchema.validate({ content });
    if (error) {
      throw next(
        new AppError(error.details[0].message, STATUS_CODE.BAD_REQUEST)
      );
    }
    const updateData = value as CommentRequest;
    const updatedComment = await updateCommentServices(updateData, {
      commentId: Number(commentId),
      userId,
    });
    return res
      .status(STATUS_CODE.OK)
      .json(appSuccess(SUCCESS_MESSAGES.COMMENT_UPDATED, updatedComment));
  }
);

// Delete comment
const deleteCommentById = catchAsync(
  async (
    req: AuthRequest & Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<Response<SuccessResponse<CommentResponse>>> => {
    const { id: commentId } = req.params;
    const userId: number = req.userId!;
    const deletedComment = await deleteCommentServices({
      commentId: Number(commentId),
      userId,
    });
    return res
      .status(STATUS_CODE.OK)
      .json(appSuccess(SUCCESS_MESSAGES.COMMENT_DELETED, deletedComment));
  }
);

export {
  createComment,
  postComments,
  updateCommentById,
  getCommentReplies,
  deleteCommentById,
};
