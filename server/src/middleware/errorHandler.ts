import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';
import config from '../config';
import { ApiResponse } from '../types/ApiResponse';

export function notFound(req: Request, _res: Response, next: NextFunction): void {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response<ApiResponse<never>>,
  _next: NextFunction,
): void {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ success: false, error: err.message });
    return;
  }
  console.error(err);
  const message =
    config.nodeEnv === 'production'
      ? 'Internal server error'
      : err instanceof Error
        ? err.message
        : 'Internal server error';
  res.status(500).json({ success: false, error: message });
}

export default errorHandler;
