import { Request } from 'express';
import asyncHandler from './asyncHandler';
import ApiError from '../utils/ApiError';
import { verifyToken } from '../utils/jwt';
import User, { IUser } from '../models/User';

export const requireAuth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw new ApiError(401, 'Authentication required');

  const payload = verifyToken(token);
  if (!payload) throw new ApiError(401, 'Invalid or expired token');

  const user = await User.findById(payload.sub);
  if (!user) throw new ApiError(401, 'User no longer exists');

  req.user = user;
  next();
});

export function getAuthUser(req: Request): IUser {
  if (!req.user) throw new ApiError(401, 'Authentication required');
  return req.user;
}

export default requireAuth;
