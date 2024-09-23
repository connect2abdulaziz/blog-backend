import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types/app.interfaces";
declare const createComment: (req: AuthRequest, res: Response<any, Record<string, any>>, next: NextFunction) => void;
declare const postComments: (req: Request<{
    id: string;
}, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => void;
declare const getCommentReplies: (req: Request<{
    id: string;
}, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => void;
declare const updateCommentById: (req: AuthRequest & Request<{
    id: string;
}, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => void;
declare const deleteCommentById: (req: AuthRequest & Request<{
    id: string;
}, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => void;
export { createComment, postComments, updateCommentById, getCommentReplies, deleteCommentById, };
