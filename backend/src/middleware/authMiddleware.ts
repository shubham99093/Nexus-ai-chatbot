import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { logSecurityEvent } from '../utils/logger';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logSecurityEvent('AUTH_FAILED', { ip: req.ip || 'unknown', message: 'Missing token' });
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyToken(token);
    req.userId = payload.userId;
    next();
  } catch {
    logSecurityEvent('AUTH_FAILED', { ip: req.ip || 'unknown', message: 'Invalid or expired token' });
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
