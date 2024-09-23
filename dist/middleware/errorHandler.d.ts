import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors/appError";
declare const globalErrorHandler: (err: AppError, _req: Request, res: Response, _next: NextFunction) => void;
export default globalErrorHandler;
