import { Request, Response, NextFunction } from 'express';
type AsyncHandler<TReq = Request, TRes = Response> = (req: TReq, res: TRes, next: NextFunction) => Promise<any>;
declare const catchAsync: <TReq = Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, TRes = Response<any, Record<string, any>>>(fn: AsyncHandler<TReq, TRes>) => (req: TReq, res: TRes, next: NextFunction) => void;
export default catchAsync;
