import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/app.interfaces";
declare const authentication: (req: AuthRequest, res: Response<any, Record<string, any>>, next: NextFunction) => void;
export { authentication };
