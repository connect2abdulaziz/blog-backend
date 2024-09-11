import { Request, Response, NextFunction } from 'express';

type AsyncHandler<TReq = Request, TRes = Response> = (
  req: TReq,
  res: TRes,
  next: NextFunction
) => Promise<any>;

const catchAsync = <TReq = Request, TRes = Response>(
  fn: AsyncHandler<TReq, TRes>
) => {
  return (req: TReq, res: TRes, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default catchAsync;
