import { Request } from "express";
import { AppError } from "../utils/errors/appError";

export interface AuthRequest extends Request {
  userId?: number;  
  file?: Express.Multer.File;  
}



export interface SuccessResponse<T> {
  status: "success";
  message: string;
  data: T;
}


// type for cookie options
export interface CookieOptions {
  sameSite?: "strict" | "lax" | "none" | boolean;
  secure?: boolean;
  httpOnly?: boolean;
  expires?: Date;
}


export interface CommentResponse {
  id: number;
  userId?: number;
  postId?: number;
  parentId?: number | null;
  content?: string;
  createdAt?: Date;
  updatedAt?: Date;
  User?: UserResponse;
  repliesCount?: number;
}

export interface UserResponse {
  token?: string;
  refreshToken?: string;
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  profilePicture?: string | null;
  thumbnail?: string | null;
  verified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PostResponse {
  id: number;
  userId?: number;
  categoryId?: number;
  title?: string;
  content?: string;
  readTime?: number;
  image?: string | null;
  thumbnail?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  User?: UserResponse;
  Category?: CategoryResponse;
}

export interface CategoryResponse {
  id: number;
  tag?: string;
}

// --------------------------------

//Request methods
export interface CommentRequest {
  commentId?: number;
  postId?: number;
  parentId?: number | null;
  content?: string;
  userId?: number;
}

export interface PostRequest {
  postId?: number;
  userId?: number;
  categoryId?: number;
  title?: string;
  content?: string;
  readTime?: number;
  image?: string | null;
  thumbnail?: string | null;
}

export interface UserRequest {
  userId?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  profilePicture?: null | string;
  thumbnail?: null | string;
  verified?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalCount: number;
    totalPages?: number;
  };
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface ITokenRequest extends Request {
  body: { token: string };
}
