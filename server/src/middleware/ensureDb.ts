import asyncHandler from './asyncHandler';
import { connectDb } from '../db';

export const ensureDb = asyncHandler(async (_req, _res, next) => {
  await connectDb();
  next();
});

export default ensureDb;
