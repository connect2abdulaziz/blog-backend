import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types/app.interfaces";
declare const createPost: (req: AuthRequest, res: Response<any, Record<string, any>>, next: NextFunction) => void;
declare const getPosts: (req: AuthRequest, res: Response<any, Record<string, any>>, next: NextFunction) => void;
declare const getPostById: (req: Request<{
    id: string;
}, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => void;
declare const updatePostById: (req: AuthRequest, res: Response<any, Record<string, any>>, next: NextFunction) => void;
declare const deletePostById: (req: AuthRequest, res: Response<any, Record<string, any>>, next: NextFunction) => void;
export { createPost, getPosts, getPostById, updatePostById, deletePostById };
