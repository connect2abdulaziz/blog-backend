import { PaginatedResponse, PaginationOptions, CommentRequest, CommentResponse } from "../types/app.interfaces";
import { CommentAttributes } from "../types/model.Interfaces";
export declare const addCommentServices: ({ postId, parentId, content }: CommentAttributes, userId: number) => Promise<CommentResponse>;
export declare const postCommentsServices: (postId: number, options: PaginationOptions) => Promise<PaginatedResponse<CommentResponse>>;
export declare const getCommentRepliesServices: (commentId: number, options: PaginationOptions) => Promise<PaginatedResponse<CommentResponse>>;
export declare const updateCommentServices: ({ content }: CommentRequest, { commentId, userId }: {
    commentId: number;
    userId: number;
}) => Promise<CommentResponse>;
export declare const deleteCommentServices: ({ commentId, userId, }: CommentRequest) => Promise<CommentResponse>;
