import { PaginatedResponse, PaginationOptions, PostRequest, PostResponse } from "../types/app.interfaces";
import { PostAttributes } from "../types/model.Interfaces";
declare const createPostServices: (userId: number, postData: PostAttributes, file?: Express.Multer.File) => Promise<PostResponse>;
declare const getAllPostServices: ({ searchBy, page, limit, userId, }: PaginationOptions & {
    searchBy?: string;
    userId?: number;
}) => Promise<PaginatedResponse<PostResponse>>;
declare const getPostServices: (postId: number) => Promise<PostResponse>;
declare const myPostsServices: (userId: number, { page, limit }: PaginationOptions) => Promise<PaginatedResponse<PostResponse>>;
declare const updatePostServices: (postId: number, userId: number, postData: PostRequest, file?: Express.Multer.File) => Promise<PostResponse>;
declare const deletePostServices: ({ postId, userId, }: {
    postId: number;
    userId: number;
}) => Promise<PostResponse>;
export { createPostServices, getAllPostServices, getPostServices, myPostsServices, updatePostServices, deletePostServices, };
