import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

const asyncHandler =
  <P = ParamsDictionary, ResBody = unknown, ReqBody = unknown>(
    fn: (req: Request<P, ResBody, ReqBody>, res: Response<ResBody>, next: NextFunction) => Promise<unknown>,
  ): RequestHandler<P, ResBody, ReqBody> =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncHandler;
