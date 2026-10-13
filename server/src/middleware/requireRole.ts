import { Request, Response, NextFunction, RequestHandler } from 'express';
import ApiError from '../utils/ApiError';
import { UserRole } from '../models/User';

export function requireRole(...roles: UserRole[]): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new ApiError(401, 'Authentication required'));
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to perform this action'));
    }
    next();
  };
}

export default requireRole;
