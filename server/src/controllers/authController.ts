import { Request, Response } from 'express';
import ApiError from '../utils/ApiError';
import { ApiResponse } from '../types/ApiResponse';
import User, { IUser } from '../models/User';
import { verifyPassword } from '../utils/password';
import { signToken } from '../utils/jwt';
import { getAuthUser } from '../middleware/requireAuth';

interface LoginBody {
  email?: unknown;
  password?: unknown;
}

interface LoginResult {
  token: string;
  user: IUser;
}

export async function login(req: Request<{}, {}, LoginBody>, res: Response<ApiResponse<LoginResult>>) {
  const { email, password } = req.body ?? {};
  if (typeof email !== 'string' || !email.trim() || typeof password !== 'string' || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+passwordHash');
  const isValid = user ? await verifyPassword(password, user.passwordHash) : false;
  if (!user || !isValid) throw new ApiError(401, 'Invalid email or password');

  const token = signToken({ sub: user.id, role: user.role });
  res.status(200).json({ success: true, data: { token, user } });
}

export async function getMe(req: Request, res: Response<ApiResponse<IUser>>) {
  const user = getAuthUser(req);
  res.status(200).json({ success: true, data: user });
}
