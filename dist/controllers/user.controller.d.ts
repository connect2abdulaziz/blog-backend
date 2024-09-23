import { Request, Response, NextFunction } from "express";
import { AuthRequest, ITokenRequest } from "../types/app.interfaces";
declare const signup: (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => void;
declare const verifyEmail: (req: Request<{
    token: string;
}, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => void;
declare const login: (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => void;
declare const forgotPassword: (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => void;
declare const resetPassword: (req: Request<{
    token: string;
}, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => void;
declare const getUserById: (req: AuthRequest, res: Response<any, Record<string, any>>, next: NextFunction) => void;
declare const updateUser: (req: AuthRequest, res: Response<any, Record<string, any>>, next: NextFunction) => void;
declare const deleteUser: (req: AuthRequest, res: Response<any, Record<string, any>>, next: NextFunction) => void;
declare const changePassword: (req: AuthRequest, res: Response<any, Record<string, any>>, next: NextFunction) => void;
declare const updateImage: (req: AuthRequest, res: Response<any, Record<string, any>>, next: NextFunction) => void;
declare const refreshToken: (req: ITokenRequest, res: Response<any, Record<string, any>>, next: NextFunction) => void;
declare const logout: (req: ITokenRequest, res: Response<any, Record<string, any>>, next: NextFunction) => void;
export { signup, verifyEmail, login, forgotPassword, resetPassword, getUserById, updateUser, deleteUser, changePassword, updateImage, refreshToken, logout, };
