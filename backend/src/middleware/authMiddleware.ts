import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'No token provided'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!token || token === 'undefined') {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'Invalid token'
      });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      (req as any).userId = decoded.userId;
      (req as any).userEmail = decoded.email;
      next();
    } catch (jwtError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'Invalid or expired token'
      });
    }

  } catch (error: any) {
    console.error('Auth middleware error:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Authentication error'
    });
  }
};

// Export the same function with different name for compatibility
export const authenticateToken = authMiddleware;
