import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../config';
import { UserRole } from '../models/User';

export interface AuthTokenPayload {
  sub: string;
  role: UserRole;
}

export function signToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as SignOptions['expiresIn'],
  });
}

export function verifyToken(token: string): AuthTokenPayload | null {
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    if (typeof decoded === 'string' || typeof decoded.sub !== 'string') return null;
    return { sub: decoded.sub, role: decoded.role as UserRole };
  } catch {
    return null;
  }
}
