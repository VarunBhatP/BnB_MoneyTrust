import type { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { StatusCodes} from "http-status-codes";
import { JWT_EXPIRE, JWT_SECRET } from "../utils/jwtExport.js";

interface JwtPayload{
    userId:number;
}

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).user?.role; // Assuming user is attached to req after auth

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'You do not have permission to perform this action' });
    }

    next();
  };
};

export const authenticateToken= (req:Request, res:Response,next:NextFunction)=>{
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1]:null);
    if(!token){
        res.status(StatusCodes.UNAUTHORIZED).json({message:'Access token missing relogin again'});
    }
    try {
        const decoded = jwt.verify(token,JWT_SECRET) as JwtPayload;
        (req as any).userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: 'Invalid token' });
    }
}