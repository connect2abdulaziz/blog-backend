import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/errors/catchAsync";
import { AppError } from "../utils/errors/appError";
import appSuccess from "../utils/errors/appSuccess";
import {
  postSchema,
  updateSchema,
  querySchema,
} from "../utils/validations/post.validator";
import {
  createPostServices,
  getAllPostServices,
  getPostServices,
  updatePostServices,
  deletePostServices,
} from "../services/post.service";
import { STATUS_CODE, SUCCESS_MESSAGES } from "../utils/constants/constants";
import { PostAttributes } from "../types/model.Interfaces";
import {
  AuthRequest,
  PostRequest,
  PostResponse,
  SuccessResponse,
} from "../types/app.interfaces";

// Create new post
const createPost = catchAsync(
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response<SuccessResponse<PostResponse>>> => {
    const { error, value } = postSchema.validate(req.body);
    if (error) {
      throw new AppError(error.details[0].message, STATUS_CODE.BAD_REQUEST);
    }
    const postData = value as PostAttributes;
    const userId = req.userId!;
    const newPost = await createPostServices(userId, postData, req.file);
    return res
      .status(STATUS_CODE.CREATED)
      .json(appSuccess(SUCCESS_MESSAGES.POST_CREATED, newPost));
  }
);

// Get all posts
const getPosts = catchAsync(
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response<SuccessResponse<PostResponse>>> => {
    const { error, value } = querySchema.validate(req.query);
    if (error)
      throw next(
        new AppError(error.details[0].message, STATUS_CODE.BAD_REQUEST)
      );
    const { searchBy, page = 1, limit = 10 } = value;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const userId = req.userId!;
    const posts = await getAllPostServices({
      searchBy,
      page: pageNumber,
      limit: limitNumber,
      userId,
    });

    return res
      .status(STATUS_CODE.OK)
      .json(appSuccess(SUCCESS_MESSAGES.POSTS_RETRIEVED, posts));
  }
);

// Get post by id
const getPostById = catchAsync(
  async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<Response<SuccessResponse<PostResponse>>> => {
    const { id: postId } = req.params;
    const result = await getPostServices(Number(postId));
    return res
      .status(STATUS_CODE.OK)
      .json(appSuccess(SUCCESS_MESSAGES.POST_RETRIEVED, result));
  }
);

// Update post
const updatePostById = catchAsync(
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response<SuccessResponse<PostResponse>>> => {
    const { title, content, categoryId, readTime }: PostRequest = req.body;
    const { error, value } = updateSchema.validate({
      title,
      content,
      categoryId,
      readTime,
    });
    if (error) {
      throw next(
        new AppError(error.details[0].message, STATUS_CODE.BAD_REQUEST)
      );
    }
    const userId = req.userId!;
    const { id: postId } = req.params;
    const updatedPost = await updatePostServices(
      Number(postId),
      userId,
      value,
      req.file
    );
    return res
      .status(STATUS_CODE.OK)
      .json(appSuccess(SUCCESS_MESSAGES.POST_UPDATED, updatedPost));
  }
);

// Delete post
const deletePostById = catchAsync(
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response<SuccessResponse<PostResponse>>> => {
    const { id: postId } = req.params;
    const userId = req.userId!;
    const deletedPostId = await deletePostServices({
      postId: Number(postId),
      userId,
    });
    return res
      .status(STATUS_CODE.OK)
      .json(appSuccess(SUCCESS_MESSAGES.POST_DELETED, deletedPostId));
  }
);

export { createPost, getPosts, getPostById, updatePostById, deletePostById };
