import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';

// Extend the Express Request type to include the user payload from the JWT
export interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string };
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Erişim reddedildi. Token bulunamadı.' });
  }

  try {
    const payload = verifyAccessToken(token) as { id: string; email: string };
    req.user = payload;
    next();
  } catch (error) {
    // If the token is expired or invalid
    return res.status(403).json({ message: 'Geçersiz veya süresi dolmuş token.' });
  }
};