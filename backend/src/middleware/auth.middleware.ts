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
    
    if (!payload || !payload.id || !payload.email) {
      return res.status(401).json({ message: 'Geçersiz token formatı.' });
    }
    
    req.user = payload;
    next();
  } catch (error: any) {
    console.error("Auth middleware error:", error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token süresi dolmuş. Lütfen tekrar giriş yapın.' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Geçersiz token.' });
    }
    
    return res.status(401).json({ message: 'Token doğrulanamadı.' });
  }
};